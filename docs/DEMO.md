# DEMO.md: the source of truth for anything that runs

Read this before adding a demo to a project, or before touching one that's
already there. It's to running code what `DESIGN.md` is to styling: the rules
the demos actually hold to, written down so the sixth one is built the same
way as the first five.

`DESIGN.md` §3 owns what a demo *looks* like (the poster, the chart recipe,
the scrub control, the colour rules). This doc owns what it *is*: what's
allowed to run, where it's allowed to come from, how it gets rebuilt, and how
we know it isn't lying.

**Division of labor**

| Doc | Owns |
| --- | --- |
| [DESIGN.md](./DESIGN.md) | how it looks and moves |
| [CONTENT.md](./CONTENT.md) | what it says, and length limits per field |
| `DEMO.md` (this) | what runs, where it comes from, how it's rebuilt |
| [TODO.md](./TODO.md) | what gets built next |

---

## 1. The one-sentence version

Five projects have a demo. Each one runs that project's real artifact, ships
as files this repo serves, is rebuilt by one command in `scripts/`, and says
out loud what it costs and what it isn't.

---

## 2. The rules

### 2.1 Run the real thing

A demo executes the project's own artifact: the trained forest, the Unity
build, the published wheel, the team's own frontend, the team's own dispatch
board. Never a reimplementation, never a recording dressed up as live.

This is the whole point. A demo is evidence that the thing works, and a
rebuild is just new code wearing the project's name. If you can't run the real
artifact, either say so plainly in the demo's `note`, or don't ship a demo for
that project yet. Permit Paragons sat without one for exactly this reason
until the team's repo turned up.

What counts as "the real artifact" is the thing the project produces, not the
environment it normally runs in. Re-exporting a trained model to JSON and
walking its trees in TypeScript is fine, because the model is the artifact.
Rewriting the model is not.

### 2.2 Static by default, and a ladder for everything else

In order of preference, a demo's bytes come from:

1. **Files this repo serves.** Always the goal.
2. **A vendored third-party artifact**, committed here. The `cwg` wheel.
3. **A pinned public CDN.** Pyodide, at an exact version.
4. **A third-party service, proxied** through `next.config.ts`. The Permit
   Paragons API, which sends no CORS header.
5. **A third-party service, live.** The Permit Paragons tiles. Worst case.

Anything at level 4 or 5 is a thing that can die without a commit, so it gets
an entry in `CONTENT.md` §8 naming who owns it and what breaks. Two of the five
demos, trading and Apple Picker, are entirely at level 1 or 2.

**Never add a backend.** No demo gets a server, a database, an API key or an
account. A dead demo link is worse than no demo link, and a free tier you
forgot about is the most reliable way to get one.

### 2.3 One command rebuilds it

Every committed byte under `public/demos/` is produced by a script in
`scripts/`, and the script pins its inputs: a commit SHA, a package version, a
random seed. "I ran some commands once" isn't a build.

If the script has to patch someone else's source to make it work, the patch
lives in the script with the reason written next to it, and it fails loudly
when the thing it's patching has moved. `build-permit-paragons.sh` applies
three and checks all three. `build-usc-dual-hacks.sh` applies nine, which is
what it costs to turn a Next.js app with a server into static files, and checks
every one: build it against a commit from before the scenario existed and it
stops on the first patch that no longer finds its line, having written nothing
to `public/`.

### 2.4 Prove it matches

If a demo re-implements or re-walks any part of the original, it has to check
itself against the real implementation and fail where people can see it.

`cwg_trace.py` mirrors `cwg.interpreter._execute` to record a step per commit,
which means the two can drift. So it runs the same program through the real
`cwg.interpreter.run` and compares the final scope, and `CwgDemo` prints the
disagreement on the page if there is one. A wrong animation should be loud,
not subtle.

The bar for "verified" is a number you can repeat, not a screenshot that
looked fine. The trading demo's TypeScript port was checked against the Python
backtest and agreed to 1.9499% versus 1.9514% over the same 487 dates. That's
what verified means. (It isn't automated yet, see §6.)

Clearline re-implements nothing, so there's no drift to catch between two copies. The
risk there is the other kind: the patched build isn't the code the team tested.
So `build-usc-dual-hacks.sh` runs the team's own suite, 156 tests, against the
unpatched commit before it builds and stops if one fails. That covers the
scenario engine, the call routing, the colour rule and the fire's size bands. It
doesn't cover the patches or the page, which were checked in a browser by hand.

### 2.5 Say what it costs before it costs it

A demo that downloads megabytes doesn't start downloading because a dialog
opened. It renders a poster with the cost on it and waits for a click, and the
poster also names anything the visitor needs that they might not have. Apple
Picker is 16MB and wants a mouse, so it says both before you click it.

### 2.6 Mount only while open

A demo is a client component reached through `ProjectDialog`, and it's mounted
only while that dialog is open. Six tiles must not each hold a Python runtime
or a Unity instance. Never import a demo into a server section.

### 2.7 Fail in a sentence

Every demo needs a path for the browser that can't run it, and that path is
one readable sentence plus somewhere else to go. Apple Picker probes for
WebGL 2 before booting Unity, because the alternative is Emscripten throwing a
wasm stack trace at someone on Safari. CWG catches a failed boot and points at
`pip install cwg`. Permit Paragons keeps a link to the team's own deployment
under the frame.

### 2.8 The note is where the honesty goes

Every demo has a `note` in `src/content/projects.ts`, and it covers what's
real, what isn't, and what the numbers do and don't mean. Anything touching
money or health gets one without exception: the trading demo says it's a
backtest and not advice, and that its edge is an average over noise.

---

## 3. The five demos

| Demo | What actually runs | Comes from | Payload | Rebuild |
| --- | --- | --- | --- | --- |
| AI Trading Model | 200-tree forest, walked in TypeScript | exported from the repo's pipeline | 469KB + 107KB gzipped | `python scripts/export-trading-demo.py` |
| Apple Picker | the Unity build, as WebAssembly | `~/Unity Projects/Apple Picker` | 16MB | `./scripts/build-apple-picker.sh` |
| CWG | the real `cwg` wheel, under Pyodide | PyPI, vendored | 72KB + Pyodide from CDN | re-vendor the wheel |
| Permit Paragons | the team's own frontend | their repo at `ed392b2` | 1.5MB | `./scripts/build-permit-paragons.sh` |
| Clearline | the team's own dispatch board, as static files | `JakeRecharte/USC-Dual-Hacks` at `10fb4ea` | 1.1MB + 1.7MB map tiles | `./scripts/build-usc-dual-hacks.sh` |

**AI Trading Model.** The export retrains the repo's pipeline (same universe,
features, horizon, split and seed) and writes the forest out as flat arrays,
so the browser walks 200 depth-8 trees in about 160ms with no runtime
dependency at all. Re-running the export re-pulls Yahoo Finance, so the
headline number moves: that's how 1.7% became 1.95%. Rebuilding it is a
content change as well as a code change.

**Apple Picker.** `PortfolioWebGLBuild.cs` lives in the game's own project so
the build settings are in version control rather than in someone's Build
Settings window. Gzip plus a JS decompression fallback took it from 48MB to
16MB and keeps it working on a host that sets no `Content-Encoding`. Unity 6
is WebGL 2 only, so there's no API to fall back to.

**CWG.** Pyodide loads CPython as WebAssembly and micropip installs the real
wheel, vendored here so PyPI isn't a runtime dependency. Two things were
needed to make it work: `cwg.gpScraper` imports GitPython at module scope and
calls `sys.exit(1)` if it fails, and GitPython itself runs the `git` binary
during its own import, which Emscripten has no way to do. `cwg_trace.py`
stubs the `git` module, which is safe because `.cwg` programs never touch a
repository.

**Permit Paragons.** The only demo built from someone else's repo, pinned to
`ed392b2`, the last commit before the October restyle. Three deployment
patches (base path, router basename, basemap) are applied by the script. The
interface is ours to serve; the parcel tiles and the parcel API are still on
the team's CloudFront.

**Clearline.** The `web/` app from Jake's own USC Dual Hacks repo, pinned to
`10fb4ea` (main on 2026-10-18). The real app is a Next.js server with a signed
cookie guard, a Supabase database and a Retell phone line, so the build keeps
the dispatch board, its map and its scenario engine and swaps what's underneath:
the route guard, API routes, sign-in and officer page come out, the household
list the server would have streamed is built in the browser from the same
`seedAddresses()`, and the board opens on Scenario instead of Live. Scenario is
a layer the board already draws, and it writes nothing, so nothing depends on a
server. What a visitor sees is therefore real code on simulated data: the
statuses, calls, callers and the fire's spread are generated by the team's seeded
engine, the addresses and residents are placeholders, and the map, the building
footprints and the day's 24-beat timeline are real. The board says so itself, in
a banner it won't let you close. The patches are listed in the script's header.
Live mode is still there and still honest: with no database or phone line it's
8,088 grey houses.

---

## 4. What's pinned and what's live

Nothing updates on its own, with two exceptions. Every demo ships a built
artifact, so changing a project's source does nothing to the site until the
demo is rebuilt and pushed.

| Change this | Does the site move? |
| --- | --- |
| The Trading Model repo | No. Re-run the export. |
| The Apple Picker Unity project | No. Re-run the build. |
| `cwg` on PyPI | No. The wheel is pinned to 0.2.0. |
| The Permit Paragons frontend | No. It's pinned twice: a build, and `COMMIT` in the script. |
| The Clearline repo | No. It's pinned twice: a build, and `COMMIT` in the script. |
| **The Permit Paragons tiles or API** | **Yes, immediately.** Fetched at runtime. |
| **OpenFreeMap tiles, or Google Fonts** (Clearline, and Permit Paragons' basemap) | **Yes, immediately.** Fetched at runtime. With the network down the board still draws its perimeter, houses and fire, just on a blank basemap and in fallback type. |

That last row cuts both ways. If the team retrains the model, the site shows
it with no action from you. If they change the API's response shape, the
parcel dashboard breaks with no action from you, and nothing will tell you.

Pinning is deliberate. It means a bad upstream release can't break the site,
and it means the demos drift behind their projects until someone rebuilds
them. Both halves of that are on purpose.

---

## 5. Adding a demo

1. **Check there's a real artifact to run.** If there isn't, stop. Add the
   question to `CONTENT.md` §8 instead.
2. **Write the build script first**, in `scripts/`, pinning its inputs. Output
   goes to `public/demos/<slug>/`.
3. **Check the payload size** gzipped, not raw, and keep it out of the
   homepage's critical path.
4. **Add the key** to `DemoKey` in `src/content/projects.ts` and a case in
   `demos/ProjectDemo.tsx`.
5. **Build the component** against `DESIGN.md` §3. No new design values
   without adding them to that doc in the same commit.
6. **Write the content**: `label`, 2 to 4 `guide` steps, and a `note` that
   says what isn't real. Length limits are in `CONTENT.md` §5.
7. **Verify with a number**, per §2.4, and write down what you could not
   verify.
8. **Record the facts** in `CONTENT.md` §2.4 and the state in `TODO.md`, and
   add anything third-party to `CONTENT.md` §8.

Things that are not demos: a video, a screenshot, a link to a deployed app.
Those are fine on a project, they just don't go in a demo pane.

---

## 6. Known gaps: fix on sight

- **The trading demo has no automated parity check.** The export writes a
  `backtest` block into `trading-prices.json` and `TradingDemo` never reads
  it. The browser recomputes the same numbers, so comparing them and showing
  a mismatch (the way `CwgDemo` shows drift) is a few lines and would close
  the gap for good. Right now the agreement was checked once, by hand.
- **Apple Picker can fail on Safari.** A lost WebGL 2 context, which is the
  WebKit bug class in `TODO.md`. The probe makes it fail readably, but it
  isn't fixed, and it can't be reproduced headlessly.
- **Permit Paragons depends on the team's CloudFront** for tiles and the API.
  `CONTENT.md` §8.17 has the options.
- **Clearline's patch set is the biggest on the site, and it's coupled to the team's
  code.** Nine string patches on a Next.js app. If they restructure `use-live.ts`
  or `ui.tsx` the build stops, which is the point, but someone has to re-patch it.
  The pin makes that a choice rather than an emergency. Also not automated: the
  patched page itself. The tests run on the pristine commit, and the board was
  checked in a browser by hand (it boots in about 2.4 seconds, runs the day when
  scrubbed to 13:00, 17:00 and 23:00, and logs no errors). Real WebGL was the
  installed Chrome; headless Chrome's software GL is enough for MapLibre here.
- **Clearline's scenario starts quiet.** Nothing changes until about 10:44 on the
  board's clock, which is 20 real seconds at its default speed, and the first calls
  have landed by about 11:15. That's the team's pacing, left alone, and the guide says so.
- **Pyodide comes from jsdelivr**, the only live third-party dependency on the
  site that isn't Permit Paragons. Self-hosting it is about 12MB in git.
- **Apple Picker is 16MB in git history**, permanently. Fine for one demo, not
  for five. `TODO.md` lists the ways to trim it.
- **No demo rebuild is automated.** The contribution graph already proves the
  pattern works: a scheduled Action re-runs its script and commits only when
  the output actually changed. The trading export and the `cwg` wheel could
  both work that way. Apple Picker can't, since it needs the Unity editor, and
  Permit Paragons shouldn't, since the pin is the point.
