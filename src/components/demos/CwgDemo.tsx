"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  cwgPrograms,
  fillProgram,
  type CwgProgram,
} from "@/content/cwgPrograms";
import Icon from "../Icon";

/**
 * CWG, running for real in the visitor's browser.
 *
 * Pyodide loads CPython as WebAssembly, micropip installs the actual `cwg`
 * wheel from PyPI (vendored into `public/demos/cwg/wheels/` so the demo does
 * not depend on PyPI being reachable), and `cwg_trace.py` runs the program
 * through `cwg.interpreter`: Jake's interpreter, unmodified, executing the
 * language's real semantics. Nothing here is a recording, which is why the
 * knobs can take any value rather than a precomputed few.
 *
 * Why a stepper rather than an editor: a commit graph *is* the program, and
 * that is invisible in a README and obvious the moment you watch one execute.
 * Writing CWG is hard; reading it run is not. So the demo spends its
 * interaction budget on stepping and on a couple of dialable values, and
 * never asks anyone to compose a commit message.
 *
 * Pyodide itself (~10MB) comes from its CDN rather than this repo, and the
 * poster makes that cost explicit before anyone pays it.
 */

const PYODIDE_VERSION = "0.28.0";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/**
 * Installed with `deps=False`. cwg declares GitPython, but nothing on the
 * .cwg path uses it and it cannot even import under Emscripten, so
 * `cwg_trace.py` stubs the module instead of shipping 320KB of wheels that
 * would fail on load.
 */
const WHEELS = ["/demos/cwg/wheels/cwg-0.2.0-py3-none-any.whl"];

type Step = {
  kind: "statement" | "condition" | "merge" | "revert" | "fn";
  sha: string | null;
  message: string;
  branch: string;
  depth: number;
  note: string;
  taken: boolean | null;
  error: string | null;
  out: string;
  scope: Record<string, string>;
};

type Commit = {
  sha: string;
  message: string;
  branch: string;
  parents: string[];
  isMerge: boolean;
  isRevert: boolean;
  isCherryPick: boolean;
  tags: string[];
  branchType: string;
};

type Trace = {
  commits: Commit[];
  branches: string[];
  steps: Step[];
  tail: string;
  final: Record<string, string>;
  /** Non-empty means the tracer disagreed with the real interpreter. */
  drift: string[];
};

type Pyodide = {
  loadPackage: (name: string) => Promise<unknown>;
  runPythonAsync: (code: string) => Promise<string>;
  globals: { set: (key: string, value: unknown) => void };
  FS: { writeFile: (path: string, data: string) => void };
};

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<Pyodide>;
  }
}

type View = "graph" | "python" | "git";

const VIEWS: { key: View; label: string }[] = [
  { key: "graph", label: "Commit graph" },
  { key: "python", label: "As Python" },
  { key: "git", label: "Git commands" },
];

/** The first non-empty line of a commit message, which is its statement. */
function subject(message: string) {
  return message.split("\n").find((l) => l.trim()) ?? "";
}

export default function CwgDemo() {
  const [booted, setBooted] = useState(false);
  const [phase, setPhase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pyodide = useRef<Pyodide | null>(null);

  const [programIndex, setProgramIndex] = useState(0);
  const program: CwgProgram = cwgPrograms[programIndex];

  const [knobs, setKnobs] = useState<Record<string, number>>(() =>
    Object.fromEntries(cwgPrograms[0].knobs.map((k) => [k.key, k.value])),
  );
  const [trace, setTrace] = useState<Trace | null>(null);
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<View>("graph");

  const source = useMemo(
    () => fillProgram(program.source, knobs),
    [program, knobs],
  );
  const python = useMemo(
    () => fillProgram(program.python, knobs),
    [program, knobs],
  );

  // --- boot ---------------------------------------------------------------

  const boot = useCallback(async () => {
    setBooted(true);
    try {
      setPhase("Downloading Python…");
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const tag = document.createElement("script");
          tag.src = `${PYODIDE_URL}pyodide.js`;
          tag.onload = () => resolve();
          tag.onerror = () => reject(new Error("Pyodide failed to load"));
          document.head.appendChild(tag);
        });
      }
      if (!window.loadPyodide) throw new Error("Pyodide failed to load");

      setPhase("Starting the interpreter…");
      const py = await window.loadPyodide({ indexURL: PYODIDE_URL });

      setPhase("Installing the cwg package…");
      await py.loadPackage("micropip");
      await py.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(WHEELS)}, deps=False)
`);

      setPhase("Loading the tracer…");
      const res = await fetch("/demos/cwg/cwg_trace.py");
      if (!res.ok) throw new Error("cwg_trace.py failed to load");
      py.FS.writeFile("/cwg_trace.py", await res.text());
      await py.runPythonAsync(`
import sys
if "/" not in sys.path:
    sys.path.insert(0, "/")
import cwg_trace
`);

      pyodide.current = py;
      setPhase("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  // --- run ----------------------------------------------------------------

  useEffect(() => {
    const py = pyodide.current;
    if (!py || phase || error) return;
    let cancelled = false;

    (async () => {
      try {
        py.globals.set("program_source", source);
        const json = await py.runPythonAsync(`
import json, cwg_trace
json.dumps(cwg_trace.run_source(program_source))
`);
        if (cancelled) return;
        const next = JSON.parse(json) as Trace;
        setTrace(next);
        setAt(0);
        setPlaying(false);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, phase, error]);

  // --- playback -----------------------------------------------------------

  useEffect(() => {
    if (!playing || !trace) return;
    // Both updates happen in the timeout, never synchronously in the effect:
    // a synchronous `setPlaying` here re-renders before paint and cascades.
    const last = trace.steps.length - 1;
    if (at >= last) return;
    const timer = window.setTimeout(() => {
      const next = at + 1;
      setAt(next);
      if (next >= last) setPlaying(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [playing, at, trace]);

  function pick(index: number) {
    setProgramIndex(index);
    setKnobs(
      Object.fromEntries(cwgPrograms[index].knobs.map((k) => [k.key, k.value])),
    );
    setPlaying(false);
  }

  // --- derived ------------------------------------------------------------

  const step = trace?.steps[at] ?? null;
  const previous = at > 0 ? (trace?.steps[at - 1] ?? null) : null;

  /** Shas already executed, so the graph can grey out what hasn't run. */
  const executed = useMemo(() => {
    const seen = new Set<string>();
    for (let i = 0; i <= at && trace && i < trace.steps.length; i++) {
      const sha = trace.steps[i].sha;
      if (sha) seen.add(sha);
    }
    return seen;
  }, [trace, at]);

  const output = useMemo(() => {
    if (!trace) return "";
    let text = "";
    for (let i = 0; i <= at && i < trace.steps.length; i++) {
      text += trace.steps[i].out;
    }
    if (at >= trace.steps.length - 1) text += trace.tail;
    return text;
  }, [trace, at]);

  /** Lane per branch, in order of first appearance. */
  const lanes = useMemo(() => {
    const order: string[] = [];
    for (const c of trace?.commits ?? []) {
      if (!order.includes(c.branch)) order.push(c.branch);
    }
    return order;
  }, [trace]);

  /** First and last row each branch occupies, for its vertical rule. */
  const spans = useMemo(() => {
    const out: Record<string, [number, number]> = {};
    (trace?.commits ?? []).forEach((c, i) => {
      const span = out[c.branch];
      out[c.branch] = span ? [span[0], i] : [i, i];
    });
    return out;
  }, [trace]);

  /** The Python line this step corresponds to, matched on the statement. */
  const pythonLine = useMemo(() => {
    if (!step) return -1;
    const want = subject(step.message).trim();
    if (!want) return -1;
    return python.split("\n").findIndex((l) => l.trim() === want);
  }, [step, python]);

  // --- render -------------------------------------------------------------

  if (error) {
    return (
      <p className="text-sm leading-relaxed text-white/55">
        The interpreter couldn&apos;t start ({error}). CWG is on PyPI and in the
        repo below, so{" "}
        <code className="font-mono text-white/75">pip install cwg</code> runs
        the same thing locally.
      </p>
    );
  }

  if (!booted) {
    return (
      <div className="aspect-[8/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <button
          type="button"
          onClick={boot}
          className="group flex h-full w-full flex-col items-center justify-center gap-3 p-6 transition-colors hover:bg-white/[0.07]"
        >
          <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white transition group-hover:border-white/25 group-hover:bg-white/[0.07]">
            <Icon name="Play" className="size-4 text-accent" />
            Start the interpreter
          </span>
          <span className="text-center font-mono text-xs text-white/35">
            Loads Python itself (~10 MB) and installs the real cwg package
          </span>
        </button>
      </div>
    );
  }

  if (phase || !trace || !step) {
    return (
      <div>
        <p className="font-mono text-xs text-white/35">
          {phase || "Running the program…"}
        </p>
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-1/3 animate-pulse bg-accent" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Pick a program, don't write one. Ordered so each adds one idea. */}
      <ul className="flex flex-wrap gap-2">
        {cwgPrograms.map((p, i) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => pick(i)}
              aria-pressed={i === programIndex}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                i === programIndex
                  ? "border-accent/40 text-white"
                  : "border-white/10 text-white/55 hover:border-white/25 hover:bg-white/[0.07]"
              }`}
            >
              {p.title}
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm leading-relaxed text-white/55">
        {program.teaches}
      </p>

      {program.knobs.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {program.knobs.map((k) => (
            <label key={k.key} className="flex items-center gap-3">
              <span className="font-mono text-xs text-white/35">{k.label}</span>
              <input
                type="range"
                min={k.min}
                max={k.max}
                value={knobs[k.key] ?? k.value}
                aria-label={`${k.label}, re-runs the program`}
                onChange={(e) =>
                  setKnobs((prev) => ({
                    ...prev,
                    [k.key]: Number(e.target.value),
                  }))
                }
                className="w-28 accent-accent"
              />
              <span className="font-mono text-xs text-white tabular-nums">
                {knobs[k.key] ?? k.value}
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            aria-pressed={view === v.key}
            className={`rounded-lg border px-3 py-1.5 text-xs transition ${
              view === v.key
                ? "border-white/25 bg-white/[0.07] text-white"
                : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        {view === "graph" && (
          <Graph
            commits={trace.commits}
            lanes={lanes}
            spans={spans}
            executed={executed}
            current={step.sha}
          />
        )}
        {view === "python" && <Code text={python} highlight={pythonLine} />}
        {view === "git" && <Code text={source} highlight={-1} />}
      </div>

      {/* Scrub. The slider is the crosshair for everything above and below. */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (at >= trace.steps.length - 1) setAt(0);
            setPlaying((p) => !p);
          }}
          className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/75 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
        >
          {playing ? "Pause" : at >= trace.steps.length - 1 ? "Replay" : "Play"}
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(trace.steps.length - 1, 0)}
          value={at}
          aria-label="Execution step"
          aria-valuetext={`Step ${at + 1} of ${trace.steps.length}: ${subject(step.message)}`}
          onChange={(e) => {
            setPlaying(false);
            setAt(Number(e.target.value));
          }}
          className="w-full accent-accent"
        />
        <span className="shrink-0 font-mono text-xs text-white/35 tabular-nums">
          {at + 1}/{trace.steps.length}
        </span>
      </div>

      <p className="mt-3 font-mono text-xs text-white/55">
        <span className="text-white/35">{step.kind}</span>{" "}
        {subject(step.message) || "(no message)"}
        {step.note && <span className="text-white/35"> · {step.note}</span>}
        {step.error && <span className="text-white"> · {step.error}</span>}
      </p>

      {/* Scope and output, the two things the graph is changing. */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
            Scope
          </h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {Object.keys(step.scope).length === 0 && (
              <li className="font-mono text-xs text-white/35">empty</li>
            )}
            {Object.entries(step.scope).map(([name, value]) => {
              const changed = previous && previous.scope[name] !== value;
              return (
                <li
                  key={name}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${
                    changed
                      ? "border-accent/40 text-white"
                      : "border-white/10 text-white/55"
                  }`}
                >
                  {name} = {value}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
            Output
          </h4>
          <pre className="mt-3 min-h-[1.5rem] font-mono text-xs leading-relaxed whitespace-pre-wrap text-white/55">
            {output || "(no output)"}
          </pre>
        </div>
      </div>

      {trace.drift.length > 0 && (
        <p className="mt-5 font-mono text-xs text-white">
          Trace disagreed with cwg.interpreter on: {trace.drift.join(", ")}
        </p>
      )}
    </div>
  );
}

/**
 * The program as `git log --graph` draws it: one row per commit, a lane per
 * branch. Branch *type* is carried by the lane label and position, never by
 * colour. The palette has one accent (DESIGN.md §2.1), so colour is spent on
 * execution state instead, which is what changes as you step.
 */
function Graph({
  commits,
  lanes,
  spans,
  executed,
  current,
}: {
  commits: Commit[];
  lanes: string[];
  spans: Record<string, [number, number]>;
  executed: Set<string>;
  current: string | null;
}) {
  return (
    <ol className="w-max min-w-full">
      {commits.map((commit, row) => {
        const isCurrent = commit.sha === current;
        const hasRun = executed.has(commit.sha);
        const tone = isCurrent
          ? "text-white"
          : hasRun
            ? "text-white/55"
            : "text-white/25";

        return (
          <li key={commit.sha} className="flex items-center gap-3">
            <span className="flex shrink-0">
              {lanes.map((lane, i) => {
                const span = spans[lane];
                const open = span && row >= span[0] && row <= span[1];
                const here = lane === commit.branch;
                return (
                  <span
                    key={lane}
                    className="relative flex h-7 w-4 items-center justify-center"
                  >
                    {open && (
                      <span className="absolute inset-y-0 w-px bg-white/10" />
                    )}
                    {here && (
                      <span
                        className={`relative size-2 rounded-full ${
                          isCurrent
                            ? "bg-accent"
                            : hasRun
                              ? "bg-white/55"
                              : "bg-white/25"
                        } ${commit.isMerge ? "ring-2 ring-white/25" : ""}`}
                      />
                    )}
                    {/* Keeps an unused lane column from collapsing. */}
                    {!open && !here && <span className="size-2" />}
                    <span className="sr-only">{i === 0 ? "" : ""}</span>
                  </span>
                );
              })}
            </span>

            <span
              className={`truncate font-mono text-xs ${tone} ${
                isCurrent ? "font-bold" : ""
              }`}
            >
              {subject(commit.message) || "(no message)"}
            </span>

            {commit.branch !== "main" && (
              <span className="shrink-0 font-mono text-[10px] text-white/25">
                {commit.branch}
              </span>
            )}
            {commit.isRevert && (
              <span className="shrink-0 font-mono text-[10px] text-white/25">
                revert
              </span>
            )}
            {commit.isCherryPick && (
              <span className="shrink-0 font-mono text-[10px] text-white/25">
                call
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A code block with one line called out. */
function Code({ text, highlight }: { text: string; highlight: number }) {
  return (
    <ol className="w-max min-w-full font-mono text-xs leading-relaxed">
      {text.split("\n").map((line, i) => (
        <li
          key={`${i}-${line}`}
          className={i === highlight ? "font-bold text-white" : "text-white/55"}
        >
          {line || " "}
        </li>
      ))}
    </ol>
  );
}
