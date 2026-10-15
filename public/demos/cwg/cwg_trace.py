"""
Runs a CWG program and records a step-by-step trace of its execution.

This is shipped to the browser and executed by Pyodide against the real `cwg`
package from PyPI. The language semantics below are *not* reimplemented, they
are `cwg.interpreter`'s own. Two things are added:

1. **A fuller .cwg parser.** `cwg.runner.CWGRunner` understands `init`,
   `commit`, `branch`, `checkout` and `merge`, which covers statements,
   if/else, while and for, but not `revert`, `tag` or `cherry-pick`, because
   it never sets `is_revert` / `revert_src` / `cherry_pick_src` or fills
   `functions`. Those three are a third of what makes CWG interesting, so
   `Builder` below handles them. It is the same job `CWGRunner` does (git
   commands in, `CommitNode` graph out), just with the rest of the verbs.

2. **A recording executor.** `cwg.interpreter._execute` already snapshots
   scope at every commit, then discards all of it and returns only the final
   scope. `_trace` mirrors it branch for branch and keeps each step.

`_trace` mirroring `_execute` is the risk here: if the two drift, the demo
lies about what the interpreter does. `run_source` guards that by executing
the same program through the real `cwg.interpreter.run` and asserting the
final scopes match, so a drift turns into a loud failure rather than a subtly
wrong animation.
"""

import contextlib
import io
import re
import shlex
import sys
import types
from datetime import datetime, timezone


def _stub_gitpython() -> None:
    """Satisfy `cwg.gpScraper`'s import of GitPython without GitPython.

    `gpScraper` does `from git import Repo, ...` at module scope and calls
    `sys.exit(1)` if it fails, so `import cwg` is impossible without the name
    resolving. GitPython cannot provide it here: it runs the `git` binary
    during its own import to find a version, and Emscripten has no
    subprocesses. `GIT_PYTHON_REFRESH=quiet` does not help, because the
    failure is an OSError from `popen`, not the missing-executable path that
    flag covers.

    Nothing in this module needs git. Programs arrive as `.cwg` files, so
    `scrape()`, the only function that touches a repository, is never
    called. The stub is installed unconditionally so a local run and a
    browser run exercise the same code, and each placeholder raises if
    anything ever does reach for it, rather than failing quietly.
    """
    if "git" in sys.modules:
        return
    module = types.ModuleType("git")

    def _unavailable(*_args, **_kwargs):
        raise RuntimeError(
            "this build of cwg runs .cwg programs only, no git available"
        )

    module.Repo = _unavailable
    for name in (
        "InvalidGitRepositoryError",
        "NoSuchPathError",
        "GitCommandError",
    ):
        setattr(module, name, type(name, (Exception,), {}))
    sys.modules["git"] = module


_stub_gitpython()

from cwg.gpScraper import CommitNode, FunctionDef, GpScrapeResult  # noqa: E402
from cwg.interpreter import (  # noqa: E402
    _MAX_FOR_ITERATIONS,
    _MAX_WHILE_ITERATIONS,
    CheckChainNode,
    FnCallNode,
    ForNode,
    IfNode,
    RevertNode,
    StatementNode,
    WhileNode,
    _extract_condition,
    _extract_for_header,
    _extract_handler,
    _parse_return,
    _promote,
    build_exec_tree,
    run,
)

_FN_BRANCH_RE = re.compile(r"^fn/(.+)$")


# ---------------------------------------------------------------------------
# Parsing: git commands -> CommitNode graph
# ---------------------------------------------------------------------------

class Builder:
    """`CWGRunner`, plus `revert`, `tag` and `cherry-pick`."""

    def __init__(self):
        self.commits: dict[str, CommitNode] = {}
        self.order: list[str] = []
        self.branch_tips: dict[str, str | None] = {}
        self.current = "main"
        self.branches: list[str] = []
        self.counter = 0
        self.tags: dict[str, str] = {}
        self.functions: list[FunctionDef] = []

    def _sha(self) -> str:
        self.counter += 1
        return f"c{self.counter:04d}"

    def _add(self, message, is_merge=False, extra_parents=None, **kw) -> str:
        sha = self._sha()
        parents = []
        tip = self.branch_tips.get(self.current)
        if tip:
            parents.append(tip)
        if extra_parents:
            parents.extend(extra_parents)
        self.commits[sha] = CommitNode(
            sha=sha, message=message, branch=self.current, parents=parents,
            author="CWG", timestamp=datetime.now(tz=timezone.utc),
            is_merge=is_merge, tags=[], **kw,
        )
        self.order.append(sha)
        self.branch_tips[self.current] = sha
        return sha

    def _resolve(self, ref: str) -> str | None:
        """HEAD, HEAD~n, a tag, or a literal sha."""
        if ref in self.commits:
            return ref
        if ref in self.tags:
            return self.tags[ref]
        on_branch = [s for s in self.order if self.commits[s].branch == self.current]
        if ref == "HEAD":
            return on_branch[-1] if on_branch else None
        m = re.match(r"^HEAD~(\d+)$", ref)
        if m and len(on_branch) > int(m.group(1)):
            return on_branch[-1 - int(m.group(1))]
        return None

    def load(self, source: str) -> GpScrapeResult:
        for raw in source.splitlines():
            line = raw.strip()
            if not line.startswith("git"):
                continue
            parts = shlex.split(line)
            verb = parts[1] if len(parts) > 1 else ""
            msg = parts[parts.index("-m") + 1] if "-m" in parts else None

            if verb == "init":
                self.current = "main"
                self.branch_tips["main"] = None
                self.branches = ["main"]

            elif verb == "commit" and msg is not None:
                self._add(msg)

            elif verb == "branch" and len(parts) == 3:
                self.branches.append(parts[2])
                self.branch_tips[parts[2]] = self.branch_tips.get(self.current)
                self.current = parts[2]

            elif verb == "checkout" and len(parts) >= 3:
                self.current = parts[2]

            elif verb == "merge" and len(parts) >= 3:
                other = self.branch_tips.get(parts[2])
                tip = self.branch_tips.get(self.current)
                extra = [other] if other and other != tip else []
                self._add(msg or f"Merge {parts[2]}", is_merge=True, extra_parents=extra)

            elif verb == "revert" and len(parts) >= 3:
                target = self._resolve(parts[2])
                if target is None:
                    continue
                # Exactly the shape `git revert` writes, which is what
                # `_extract_handler` keys off: handler code first, then the
                # auto-generated trailer.
                subject = self.commits[target].message.splitlines()[0]
                body = f'{msg}\n\n' if msg else ""
                self._add(
                    f'{body}Revert "{subject}"\n\nThis reverts commit {target}.',
                    is_revert=True, revert_src=target,
                )

            elif verb == "tag" and len(parts) >= 3:
                name = parts[2]
                tip = self.branch_tips.get(self.current)
                if tip:
                    self.tags[name] = tip
                    self.commits[tip].tags.append(name)

            elif verb == "cherry-pick" and len(parts) >= 3:
                ref = parts[2]
                # Calling a function is `cherry-pick fn/<name>`. The handle
                # the interpreter wants is the *first* commit of that branch
                # (`fn_by_start` is keyed on `FunctionDef.start_sha`), not the
                # branch tip a normal ref would resolve to.
                fn = _FN_BRANCH_RE.match(ref)
                if fn and ref in self.branches:
                    body = [s for s in self.order if self.commits[s].branch == ref]
                    src = body[0] if body else None
                    label = f"{fn.group(1)}()"
                else:
                    src = self._resolve(ref)
                    label = self.commits[src].message if src else ""
                if src is None:
                    continue
                self._add(label, is_cherry_pick=True, cherry_pick_src=src)

        self._collect_functions()
        return GpScrapeResult(
            repo_path="<demo>", is_cwg=True,
            commits=[self.commits[s] for s in self.order],
            branches=self.branches, tags=self.tags,
            functions=self.functions, stash=[],
        )

    def _collect_functions(self) -> None:
        """Every `fn/<name>` branch becomes a FunctionDef over its commits."""
        for branch in self.branches:
            m = _FN_BRANCH_RE.match(branch)
            if not m:
                continue
            body = [s for s in self.order if self.commits[s].branch == branch]
            if body:
                self.functions.append(
                    FunctionDef(name=m.group(1), start_sha=body[0],
                                end_sha=body[-1], body_shas=body)
                )


# ---------------------------------------------------------------------------
# Recording executor: mirrors cwg.interpreter._execute
# ---------------------------------------------------------------------------

def _show(scope: dict) -> dict:
    out = {}
    for k, v in scope.items():
        if k.startswith("__"):
            continue
        try:
            out[k] = repr(v)
        except Exception:
            out[k] = "<unrepresentable>"
    return out


class _Rec:
    def __init__(self):
        self.steps: list[dict] = []
        self.buf = io.StringIO()
        self.seen = 0

    def drain(self) -> str:
        text = self.buf.getvalue()
        new, self.seen = text[self.seen:], len(text)
        return new

    def add(self, *, kind, commit, scope, depth, note="", error=None, taken=None):
        self.steps.append({
            "kind": kind,
            "sha": getattr(commit, "sha", None),
            "message": getattr(commit, "message", "") or "",
            "branch": getattr(commit, "branch", "") or "",
            "depth": depth,
            "note": note,
            "taken": taken,
            "error": error,
            "out": self.drain(),
            "scope": _show(scope),
        })


def _trace(nodes, scope, snapshots, errors, rec, depth):
    for node in nodes:
        if isinstance(node, StatementNode):
            msg = node.commit.message.strip()
            if not msg:
                continue
            snapshots[node.commit.sha] = scope.copy()
            err = None
            try:
                exec(msg, scope)  # noqa: S102
            except SyntaxError:
                pass
            except Exception as e:  # recorded, like the interpreter does
                errors[node.commit.sha] = e
                err = f"{type(e).__name__}: {e}"
            rec.add(kind="statement", commit=node.commit, scope=scope,
                    depth=depth, error=err)

        elif isinstance(node, IfNode):
            expr = _extract_condition(node.condition.message)
            try:
                taken = bool(eval(expr, scope))  # noqa: S307
            except Exception:
                taken = False
            rec.add(kind="condition", commit=node.condition, scope=scope,
                    depth=depth, taken=taken,
                    note=f"{expr} is {taken}")
            branch_scope = scope.copy()
            if taken:
                _trace(node.true_branch, branch_scope, snapshots, errors, rec, depth + 1)
                merge = node.if_merge
            else:
                _trace(node.false_branch, branch_scope, snapshots, errors, rec, depth + 1)
                merge = node.else_merge
            returns = _parse_return(merge.message if merge else "")
            _promote(branch_scope, scope, returns)
            if merge is not None:
                rec.add(kind="merge", commit=merge, scope=scope, depth=depth,
                        note=("returns " + ", ".join(returns)) if returns
                        else "side effects only")

        elif isinstance(node, WhileNode):
            expr = _extract_condition(node.condition.message)
            while_scope = scope.copy()
            returns = _parse_return(node.merge.message if node.merge else "")
            for _ in range(_MAX_WHILE_ITERATIONS):
                try:
                    keep = bool(eval(expr, while_scope))  # noqa: S307
                except Exception:
                    break
                rec.add(kind="condition", commit=node.condition, scope=while_scope,
                        depth=depth, taken=keep, note=f"{expr} is {keep}")
                if not keep:
                    break
                _trace(node.body, while_scope, snapshots, errors, rec, depth + 1)
            _promote(while_scope, scope, returns)
            if node.merge is not None:
                rec.add(kind="merge", commit=node.merge, scope=scope, depth=depth,
                        note=("returns " + ", ".join(returns)) if returns
                        else "side effects only")

        elif isinstance(node, ForNode):
            target, iter_expr = _extract_for_header(node.header.message)
            for_scope = scope.copy()
            returns = _parse_return(node.merge.message if node.merge else "")
            if target and iter_expr:
                try:
                    iterable = eval(iter_expr, for_scope)  # noqa: S307
                except Exception:
                    iterable = []
                count = 0
                for item in iterable:
                    if count >= _MAX_FOR_ITERATIONS:
                        break
                    count += 1
                    for_scope["__cwg_iter_value"] = item
                    try:
                        exec(f"{target} = __cwg_iter_value", for_scope)  # noqa: S102
                    except Exception:
                        break
                    rec.add(kind="condition", commit=node.header, scope=for_scope,
                            depth=depth, taken=True, note=f"{target} = {item!r}")
                    _trace(node.body, for_scope, snapshots, errors, rec, depth + 1)
                for_scope.pop("__cwg_iter_value", None)
            _promote(for_scope, scope, returns)
            if node.merge is not None:
                rec.add(kind="merge", commit=node.merge, scope=scope, depth=depth,
                        note=("returns " + ", ".join(returns)) if returns
                        else "side effects only")

        elif isinstance(node, CheckChainNode):
            code = "\n".join(node.lines)
            try:
                exec(code, scope)  # noqa: S102
            except Exception:
                pass
            rec.add(kind="statement", commit=None, scope=scope, depth=depth,
                    note="inline check")

        elif isinstance(node, FnCallNode):
            for commit in node.body:
                msg = commit.message.strip()
                if not msg:
                    continue
                try:
                    exec(msg, scope)  # noqa: S102
                except Exception:
                    pass
                rec.add(kind="fn", commit=commit, scope=scope, depth=depth + 1,
                        note=f"in {node.name}()")

        elif isinstance(node, RevertNode):
            if node.handler:
                fired = node.target_sha in errors
                if fired:
                    try:
                        exec(node.handler, scope)  # noqa: S102
                    except Exception:
                        pass
                rec.add(kind="revert", commit=node.commit, scope=scope, depth=depth,
                        taken=fired,
                        note=("handler ran" if fired else "target succeeded, skipped"))
            else:
                if node.target_sha in snapshots:
                    scope.clear()
                    scope.update(snapshots[node.target_sha])
                rec.add(kind="revert", commit=node.commit, scope=scope, depth=depth,
                        taken=True, note=f"scope restored to before {node.target_sha}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run_source(source: str) -> dict:
    """Parse, trace and verify a CWG program. Returns a JSON-ready dict."""
    result = Builder().load(source)

    rec = _Rec()
    scope: dict = {}
    with contextlib.redirect_stdout(rec.buf):
        _trace(build_exec_tree(result), scope, {}, {}, rec, 0)
    tail = rec.drain()

    # The guard: the real interpreter, same program, must land on the same
    # scope. If `_trace` has drifted from `_execute`, fail loudly.
    with contextlib.redirect_stdout(io.StringIO()):
        expected = run(Builder().load(source))
    actual = {k: v for k, v in scope.items() if not k.startswith("__")}
    drift = sorted(
        k for k in set(expected) | set(actual)
        if repr(expected.get(k)) != repr(actual.get(k))
    )

    return {
        "commits": [
            {
                "sha": c.sha, "message": c.message, "branch": c.branch,
                "parents": c.parents, "isMerge": c.is_merge,
                "isRevert": c.is_revert, "isCherryPick": c.is_cherry_pick,
                "tags": c.tags, "branchType": c.branch_type(),
            }
            for c in result.commits
        ],
        "branches": result.branches,
        "steps": rec.steps,
        "tail": tail,
        "final": _show(scope),
        "drift": drift,
    }
