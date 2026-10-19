#!/usr/bin/env bash
#
# Build the Clearline dispatch board into public/demos/usc-dual-hacks/.
#
# This is the team's own application, not a reimplementation: the `web/` app
# from JakeRecharte/USC-Dual-Hacks, built from the commit below, which is the
# tip of main on 2026-10-18, the event's last day. The dispatch board, its map
# and its Palisades Fire scenario engine are the team's code, unedited.
#
# What it cannot keep is the backend. The real app is a Next.js server with a
# signed-cookie route guard, API routes, a Supabase database and a Retell phone
# line behind it, and this site does not run servers (DEMO.md 2.2). So it is
# exported as static files and the transport underneath the board is swapped
# for the one thing the board needs from it, the list of households. The
# scenario is a layer the board already draws over that list, and it writes
# nothing anywhere, so nothing the visitor sees depends on a server.
#
# Nine patches are applied to their source. All are deployment concerns, none
# changes what the board computes or draws, and each one fails the build if the
# line it patches has moved:
#
#   1. next.config.ts: static export, served under /demos/usc-dual-hacks
#   2. the route guard, API routes, sign-in and officer page are removed, and
#      `/` becomes the dispatch board (they all need the server)
#   3. useAddresses: the memory-mode SSE feed becomes the same household seed
#      the server would have streamed, built in the browser
#   4. /api/db-token becomes a static file holding what the real route answers
#      when no database is configured, `{"mode":"memory"}`
#   5. /buildings.json is fetched from under the base path
#   6. the board opens on Scenario instead of Live. Live, with no database or
#      phone line, is 8,000 grey houses and nothing else
#   7. the Sign out button goes, since there is nothing signed in
#   8. the five default Next.js SVGs in public/ are dropped, they're unused
#   9. the header clock's inner span gets suppressHydrationWarning. Their
#      server renders it at request time, so it matches; a static export bakes
#      in the build's minute, and React logs error #418 on every load
#
# Before any of that, the team's own test suite runs against the unpatched
# source and the build stops if it fails. It is 156 tests covering the scenario
# engine, the call routing, the colour rule (checked against the same cases as
# the database's SQL) and the fire's size bands, which is DEMO.md 2.4's bar for
# a demo that re-walks part of the original: a number, not a screenshot. It does
# not cover the patches below or the page itself. That check is by hand.
#
#   ./scripts/build-usc-dual-hacks.sh
#
# Requires node (22 or newer, for the tests) and network. About a minute.

set -euo pipefail

REPO="https://github.com/JakeRecharte/USC-Dual-Hacks.git"
COMMIT="10fb4ea6e13c27c5c89ccdaaca5428b5b7d92da7"   # 2026-10-18, merge of PR #5
BASE="/demos/usc-dual-hacks"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public${BASE}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "Cloning $REPO at ${COMMIT:0:7}"
git clone -q --filter=blob:none "$REPO" "$WORK/src"
git -C "$WORK/src" checkout -q "$COMMIT"

APP="$WORK/src/web"

echo "Installing and running the team's tests"
(
  cd "$APP"
  npm ci --silent --no-audit --no-fund
  if ! npm test >"$WORK/tests.log" 2>&1; then
    cat "$WORK/tests.log" >&2
    echo "The team's tests fail at ${COMMIT:0:7}, not building" >&2
    exit 1
  fi
  grep -E '^ℹ (tests|pass|fail) ' "$WORK/tests.log"
)

BASE="$BASE" APP="$APP" python3 - <<'PY'
import os, re, shutil, sys

base = os.environ["BASE"]
app = os.environ["APP"]


def path(*parts):
    return os.path.join(app, *parts)


def read(rel):
    with open(path(rel), encoding="utf-8") as f:
        return f.read()


def write(rel, text):
    with open(path(rel), "w", encoding="utf-8") as f:
        f.write(text)


def fail(msg):
    print(f"build-usc-dual-hacks: {msg}, check the patch", file=sys.stderr)
    sys.exit(1)


def swap(rel, old, new, expect=1):
    text = read(rel)
    n = text.count(old)
    if n != expect:
        fail(f"{rel} has {n} of {old!r}, expected {expect}")
    write(rel, text.replace(old, new))


def swap_re(rel, pattern, new):
    """Replace the one match of `pattern` with `new`, taken literally."""
    text = read(rel)
    found = re.findall(pattern, text, flags=re.S)
    if len(found) != 1:
        fail(f"{rel} has {len(found)} matches for {pattern[:40]!r}, expected 1")
    write(rel, re.sub(pattern, lambda _: new, text, flags=re.S))


def swap_groups(rel, pattern, template):
    """Like swap_re, but `template` may use \\1-style references to the match."""
    text = read(rel)
    found = re.findall(pattern, text, flags=re.S)
    if len(found) != 1:
        fail(f"{rel} has {len(found)} matches for {pattern[:40]!r}, expected 1")
    write(rel, re.sub(pattern, template, text, flags=re.S))


# 1. Static export under the base path. Their config is the empty scaffold, so
#    this replaces it outright, but only if it still is.
if "config options here" not in read("next.config.ts"):
    fail("next.config.ts is no longer the empty scaffold")
write(
    "next.config.ts",
    f"""import type {{ NextConfig }} from "next";

const nextConfig: NextConfig = {{
  output: "export",
  basePath: "{base}",
  // Their lint rules are theirs to enforce. A patched file can warn.
  eslint: {{ ignoreDuringBuilds: true }},
  images: {{ unoptimized: true }},
}};

export default nextConfig;
""",
)

# 2. Everything that needs a server, gone. The guard and the sign-in exist to
#    stop a stranger reading resident names, and there are no residents here.
for rel in ("src/middleware.ts", "src/app/api", "src/app/dispatch", "src/app/officer"):
    if not os.path.exists(path(rel)):
        fail(f"{rel} is gone already")
    target = path(rel)
    shutil.rmtree(target) if os.path.isdir(target) else os.remove(target)
write(
    "src/app/page.tsx",
    """import { DispatchBoard } from '@/components/dispatch/dispatch-board';

export default function Page() {
  return <DispatchBoard />;
}
""",
)

# 3. The households. In memory mode the server holds `seedAddresses()` and
#    streams it over SSE as one snapshot, and no officer is here to change it.
#    Hand the board that same list directly.
swap(
    "src/lib/use-live.ts",
    "import { browserClient } from './supabase';\n",
    "import { browserClient } from './supabase';\nimport { seedAddresses } from './addresses';\n",
)
swap_re(
    "src/lib/use-live.ts",
    r"  // --- SSE transport ---\n  useEffect\(\(\) => \{.*?return \(\) => source\.close\(\);\n  \}, \[session\]\);\n",
    """  // --- Static snapshot (the portfolio build has no server to stream one) ---
  useEffect(() => {
    if (session?.mode !== 'memory') return;
    setAddresses(seedAddresses());
    setConnection('live');
  }, [session]);
""",
)

# 4. What /api/db-token answers when no database is configured.
swap("src/lib/use-live.ts", "fetch('/api/db-token')", f"fetch('{base}/db-token.json')", expect=2)
swap("src/components/dispatch/retell-alerts.tsx", "fetch('/api/db-token')", f"fetch('{base}/db-token.json')")
write("public/db-token.json", '{"mode":"memory"}\n')

# 5. The building outlines, which a root-relative fetch would look for at the
#    portfolio's own root.
swap("src/components/dispatch/zone-map.tsx", "fetch('/buildings.json'", f"fetch('{base}/buildings.json'")

# 6. Open on the scenario.
swap(
    "src/lib/scenario/use-scenario.ts",
    "const [active, setActiveState] = useState(false);",
    "const [active, setActiveState] = useState(true);",
)

# 7. Nobody is signed in.
swap_re("src/components/ui.tsx", r"export function SignOutButton\(\) \{.*?\n\}\n", "export function SignOutButton() {\n  return null;\n}\n")

# 8. Scaffold leftovers.
for name in ("file", "globe", "next", "vercel", "window"):
    svg = path("public", f"{name}.svg")
    if os.path.exists(svg):
        os.remove(svg)

# 9. The header clock. Only the outer span carries suppressHydrationWarning, and
#    that covers its own text but not the child span holding the time.
swap_groups(
    "src/components/dispatch/dispatch-board.tsx",
    r'<span className="figure text-text">(\s*\{today\.toLocaleTimeString)',
    r'<span className="figure text-text" suppressHydrationWarning>\1',
)
PY

echo "Building"
cd "$APP"
npx next build

rm -rf "$OUT"
mkdir -p "$OUT"
cp -R out/. "$OUT/"

echo
echo "Built -> $OUT  ($(du -sh "$OUT" | cut -f1))"
echo "Serving needs the rewrite in next.config.ts (SPA entry)."
