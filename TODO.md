# Portfolio — Project Plan

**Owner:** Jake Recharte — CS student, San Diego State University
**Repo:** https://github.com/JakeRecharte/Portfolio
**Goal:** A personal site that showcases my projects and experience to recruiters, hiring managers, and anyone I hand a link to.

---

## 1. Goals

### Primary
- [ ] Give recruiters a single link that answers: *who is this, what has he built, can he write code, how do I reach him.*
- [x] Show 3–6 projects with real detail (problem, stack, what I did, link to code/demo). Five shipped 2026-10-13; two have no repo to link yet (§8.3 in CONTENT.md).
- [ ] Show experience: internships, jobs, research, TA/tutoring, clubs, relevant coursework. (Shares one section with projects — same claim, for an undergrad.)
- [x] Make resume download one click. (The nav bar's Resume pill opens a modal viewer with a Download button; `public/resume.pdf` is the Oct 6 2026 one-pager.)
- [ ] Be memorable — the site itself is a portfolio piece.

### Success criteria
- [ ] Loads in under 2s on mobile.
- [ ] Readable and usable on a phone (recruiters check links on phones).
- [ ] Lighthouse: 90+ performance, 95+ accessibility.
- [ ] Live on a custom domain with HTTPS.
- [ ] Someone who doesn't know me can find my GitHub, resume, and email in under 10 seconds.

### Non-goals (for v1)
- Blog / CMS / MDX pipeline
- Backend, database, auth
- Contact form (a `mailto:` link is enough — no spam handling, no server)
- Analytics beyond something trivial

---

## 2. Reference site teardown — afamolie.com

The site I'm modeling this on. Torn down so I know what I'm building before I build it.

**Their stack:** Gatsby 5.13 · React + TypeScript · Tailwind 3.4 · Framer Motion · react-helmet · Adobe Typekit (`paralucent`) · hosted on Netlify.

**Structure:** One single page. No router. A `useState` holds `"home" | "projects" | "contact"` and swaps which component renders on the right side. Only two Gatsby pages exist: `index` and `404`.

**Flow and layout:**
1. **Intro splash** — full-screen black, centered `<h1>` fades in from `y: -100`. A `setTimeout(1800)` flips a `loaded` flag, the splash exits downward, and the real site fades in over 1.5s.
2. **Background** — a looping GIF at `object-cover`, absolutely positioned, `z-index: 1`. All content sits at `z-index: 2` above it.
3. **Left rail** (`w-28`) — name as `<h1>`, job title as `<h2>`, then a vertical nav `<ul>`: Home / Projects / Contact. Active item gets an `active-link` class; hover goes emerald-300.
4. **Right pane** — `<AnimatePresence mode="wait">` keyed on the active view. Each view enters from `y: -100` and exits to `y: 100` over ~0.8s.
   - **Home** — one bio paragraph, half width, centered.
   - **Projects** — a narrow vertical list of project titles on the far right (active = emerald-300, rest = stone-300, `whileHover: scale 1.05`, `whileTap: scale 0.95`). Clicking one swaps the detail panel: `<h3>` title, description, "Technologies Used:" as a horizontal italic list, then an image *or* an `.mp4` video depending on the file extension.
   - **Contact** — a `text-4xl` list of four links: LinkedIn, GitHub, Email (`mailto:`), Resume (PDF in `/static`).
5. **Mobile** — a custom `max-600:` Tailwind variant flips everything to a column and turns the nav into a horizontal row.

**What I'm taking:** the dark full-bleed canvas, the left identity rail with vertical nav, the state-swapped panes with enter/exit motion, the master-detail projects list, the big contact links.

**What I'm changing:**
- Add an **Experience** section — theirs has none, and it's half of what I need to show.
- Add education + relevant coursework (I'm a student; this is a real signal).
- Fix the accessibility problems in their build: nav is `<li onClick>` with no `<button>`, no keyboard support, no focus states, no `prefers-reduced-motion` handling, and the 1.8s splash blocks content on every single visit.
- Make the projects panel deep-linkable so I can send someone straight to one project.
- Real `<title>`/meta per view, plus Open Graph tags so the link preview isn't blank when I paste it in a DM.

**Note on "copying":** I'm rebuilding the layout and interaction pattern from this teardown, not lifting their source or assets. Their code, copy, images, and Typekit license aren't mine to reuse, and everything visible on my site will be my own content anyway. Layout inspiration is normal; a source-map dump is not.

---

## 2a. Second reference — sawad.framer.website

Where the *layout* comes from, as opposed to the background.

**Pattern:** sticky profile card in a left column; the right column scrolls
through sections. Each section opens with a huge uppercase display heading
split across two lines, the second line dropped back in opacity so it reads as
depth. Content rows are flat lists — title, supporting text, meta, and a small
diagonal arrow at the far right — divided by hairline rules rather than boxed
into cards. Everything fades up as it enters the viewport.

**Taken:** the sticky-card-plus-scrolling-column split, the two-tone display
headings, the hairline-divided rows, the arrow affordance, the scroll reveals.

**Changed:**
- The card is translucent glass instead of solid white, so the fog shows
  through rather than being punched out by a white rectangle.
- Nav is real anchor links, not click handlers on list items, so it is
  keyboard navigable and works without JS.
- No contact form — `mailto:` only, per the §1 non-goals.
- Accent is amber `#ffa94d`, warm against the blue fog. Not the reference's
  orange-red, and not afamolie's emerald.

---

## 3. Stack decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js (App Router) + TypeScript** | Gatsby is in maintenance mode; Next is what job postings ask for. Static export works fine for a site with no backend. |
| Styling | **Tailwind CSS v4** | Same utility model as the reference; fast to iterate. |
| Animation | **Framer Motion** (`motion/react`) | Exactly the primitives the reference uses: `AnimatePresence`, `whileHover`, layout transitions. |
| Content | **Typed TS objects** in `src/content/` | No CMS needed. Projects and jobs are arrays I edit by hand. |
| Fonts | **Google Fonts / `next/font`** | Free, self-hosted, no Typekit subscription. |
| Hosting | **Vercel** | Zero-config for Next, free tier, auto-deploy on push, preview URLs per branch. |
| Domain | TBD — `jakerecharte.com` or similar | ~$12/yr. Namecheap or Cloudflare. |

- [ ] Confirm domain name and buy it
- [ ] Pick font pairing (one display face for headings, one readable sans for body)
- [ ] Pick accent color (reference uses emerald — pick something that isn't emerald)

---

## 4. Phases

### Phase 0 — Setup ✅
- [x] `npx create-next-app@latest` — TypeScript, Tailwind, App Router, `src/` dir
      *(scaffolded into a lowercase subdir and hoisted — npm rejects the capital
      "P" in `Portfolio/` as a package name)*
- [x] Add Motion (`motion` v13, imported as `motion/react` — this is Framer
      Motion, renamed)
- [x] Set up ESLint + Prettier (`eslint-config-prettier`,
      `prettier-plugin-tailwindcss`)
- [x] `.gitignore`, README with local dev instructions
- [x] Scripts: `dev`, `build`, `start`, `lint`, `lint:fix`, `format`,
      `format:check`, `typecheck`
- [x] Placeholder page + dark canvas base, focus-ring and reduced-motion rules
      already in `globals.css`
- [x] Verified: typecheck clean, lint clean, production build succeeds
- [x] First commit, push to `origin/main`
- [ ] **Connect repo to Vercel** — needs your browser: import the repo at
      vercel.com/new, framework auto-detects as Next.js, no env vars needed.
      Confirm a deploy goes out on push before writing any real code.

**Landed versions:** Next 16.3.2 · React 19.2.8 · Tailwind v4 · Motion 13.1.1

**Next 16 gotchas** (differs from most tutorials and from what the reference
site uses):
- Turbopack is the default bundler now
- `params` and `searchParams` are **async** (Promises) — matters for the
  Phase 4 project deep-linking
- `next lint` was removed; ESLint runs directly via flat config
- `LayoutProps<"/">` and friends are generated global types — no manual
  `children: React.ReactNode` typing needed
- `AGENTS.md` is generated and re-added by `next dev`; leave it committed

### Phase 1 — Skeleton ✅
- [x] Root layout: full-height dark canvas, font loading, metadata
- [x] Animated fog background (see §2a below)
- [x] Sticky left identity card: monogram, name, role, links, education
- [x] Sticky nav bar, real anchor links to sections, plus Contact and Resume
      pills that open modals (replaced the floating pill 2026-10-13)
- [x] Scroll-reveal transitions between blocks (Motion `whileInView`)
- [x] Mobile layout: stacks to a single column
- [x] `prefers-reduced-motion` respected globally

**Layout changed from the original plan.** The afamolie pattern (state-swapped
panes, one view at a time) was replaced with the sawad.framer.website pattern:
a sticky profile card beside a single scrolling column of sections. It suits a
student portfolio better — a recruiter scrolls once and sees everything,
instead of hunting through tabs. Keeps real anchors, so it works without JS.

### Phase 2 — Content layer
- [x] `src/content/projects.ts` — typed `Project`, exported as
      `featuredProjects` (3, ranked) and `otherProjects` (the timeline)
- [x] `src/content/experience.ts` — typed `Role`
- [x] `tools.ts` deleted — tools are listed per project instead
- [x] `src/content/site.ts` — name, headline, tagline, links, education, stats
- [x] **Fill in real content** — done 2026-10-13. No `TODO:` placeholders are
      left in `src/content/`; every row and stat traces to CONTENT.md §2.
      Outstanding content gaps are now open *asks*, not placeholders:
      `public/resume.pdf` still 404s, and two projects have no link.

### Phase 3 — Sections
- [x] **Header** — identity block plus a "Now and recently" rail and the real
      GitHub contribution graph (pattern taken from brandon-garate.com)
- [x] **Hero** — two-tone display heading, tagline, stats row
- [x] **Featured projects** — the top three as a 3-up card grid: title,
      period, kind chip, blurb, tech chips, arrow where there's a URL
- [x] **Project timeline** — the rest, in the standard row pattern
- [x] **Work experience** — org, period, kind chip, role line, bullets, tools.
      The Tools grid is gone; tools sit on the thing that used them.
- [x] ~~**Contact** — big links: Email, GitHub, LinkedIn, Resume~~ — section removed 2026-10-13; the nav bar's Contact and Resume pills are the contact surface now
- [x] **Tiles carry their own write-up** — the checkerboard squares show the
      period, blurb and tech chips from `sm:` up, so the board reads without
      opening anything (DESIGN.md §2.3)
- [x] **Live demo: AI Trading Model** — see Phase 3a
- [ ] Project screenshots / demo media for the projects with no live demo
- [ ] Custom 404

### Phase 3a — Live demos

The goal is most projects having something that actually runs. The thing that
kills that goal is maintenance: **a dead demo link is worse than no demo
link**, and eight free-tier accounts is eight things that expire quietly. So
the rule is *static by default* — ship the model, the build or the data as
files this repo serves, and only pay for a backend where a visitor supplies
input the demo cannot precompute.

- [x] **AI Trading Model** — shipped 2026-10-13. `scripts/export-trading-demo.py`
      retrains the repo's forest and writes `public/demos/*.json`; the browser
      walks the 200 trees itself. No server, no API key, no cold start.
      Verified against the Python backtest: 1.9499% vs 1.9514% edge over the
      same 487 dates, ~160ms of compute. Payload is 469KB + 107KB gzipped,
      fetched only when the dialog opens.
- [x] **Apple Picker** — shipped 2026-10-14. The real Unity project built to
      WebGL by `scripts/build-apple-picker.sh` into `public/demos/apple-picker/`,
      behind a click-to-play poster so the bundle never touches the homepage's
      critical path. Gzip + JS decompression fallback took it from **48MB to
      16MB** and keeps it working on a host that sets no Content-Encoding.
      Two things still open:
      - **Gravity never resets between rounds** — CONTENT.md §8.14. One line
        in the game fixes it; it is Jake's call.
      - ~~Nobody has played it in a real browser yet.~~ Jake played it
        2026-10-14 and the game itself runs fine. One bug came out of that:
        the "Loading…" overlay stayed up over the loaded game, because the
        generated page named its element reference `status` — and
        `window.status` is a legacy property whose setter coerces to a
        string, so the variable held `"[object HTMLParagraphElement]"` and
        every use of it failed silently. Renamed to `statusEl`. Worth
        remembering for any future demo page: at top-level scope in a
        browser, `status`, `name`, `length` and `origin` are not free names.
- [ ] Revisit the 16MB in git once there are two or three builds in here. The
      options, in order of how much they cost: Brotli plus Content-Encoding
      headers once the site is on Vercel (~13MB, and the fast native decode
      instead of the JS fallback), dropping `TextMesh Pro/Examples & Extras`
      from the game project (most of the 6.6MB `.data`), or Git LFS.
- [ ] **Permit Paragons** — the 330,000-parcel map, predictions precomputed to
      vector tiles, on a static MapLibre canvas. Visually the strongest, and
      still needs no backend. Blocked on §8.3: there is no repo yet.
- [x] **CWG** — shipped 2026-10-14, and live rather than prebaked. Pyodide
      loads CPython as WebAssembly and micropip installs the real `cwg` wheel
      (vendored, 26KB, so PyPI is not a runtime dependency), then
      `public/demos/cwg/cwg_trace.py` runs the program through Jake's own
      `cwg.interpreter` and records a step per commit. Six programs, a scrub
      control, three views (commit graph / as Python / git commands) and two
      dialable values per program that re-run it for real.
      - The tracer mirrors `interpreter._execute`, so it could drift from it.
        `run_source` guards that by running the same program through the real
        `cwg.interpreter.run` and asserting the final scopes match; the demo
        surfaces any mismatch rather than animating a lie. All six programs
        also produce byte-identical output to their plain-Python equivalents.
      - Pyodide itself (~10MB) comes from jsdelivr, not this repo. That is the
        one live third-party dependency on the site. Self-hosting it is ~12MB
        in git — worth doing if the CDN ever proves flaky, or if the repo is
        getting a size pass anyway.
      - Two bugs in `cwg` came out of this; see CONTENT.md §8.15.
- [ ] **BoulderBuddy** — `flutter build web` with a seeded demo account.
      Supabase is already the hosted backend, so this adds no infrastructure.
- [ ] Lightning McShower is hardware — video only, never a live demo.
- [ ] Revisit once two or more demos exist: they are all reached through the
      project dialog today, which is fine for one. A third would be the point
      to do the Phase 4 `/projects/[slug]` route and give each a real URL.

### Phase 4 — Polish
- [ ] Intro animation — make it *skippable*, and don't replay it on every navigation (`sessionStorage` flag)
- [ ] Background treatment: gradient, subtle noise, or canvas effect (a heavy GIF is the reference's worst perf decision — don't copy it)
- [ ] Hover/tap micro-interactions on nav and project list
- [ ] Deep-link projects (`?p=slug` or `/projects/[slug]`) so a single project is shareable
- [x] Per-view `<title>` and description. Done 2026-10-14 with the second
      route: the root layout sets `title.template` (`"%s · Jake Recharte"`),
      so a route exports `title: "Art"` and gets the rest for free.
- [ ] Fill `/art` — it is live with six placeholder frames (CONTENT.md §8 Q24)
- [ ] Open Graph + Twitter card image so pasted links preview correctly
- [ ] Favicon

### Phase 5 — Quality
- [ ] Keyboard-only pass: tab through everything, nothing unreachable, focus always visible
- [ ] Screen reader smoke test (VoiceOver, `Cmd+F5`)
- [ ] Color contrast ≥ 4.5:1 on all body text
- [ ] Images: correct sizing via `next/image`, real `alt` text, lazy loading
- [ ] Lighthouse run — hit the §1 targets
- [ ] Test on a real phone, not just devtools
- [ ] Cross-browser: Chrome, Safari, Firefox

### Phase 6 — Ship
- [ ] Point custom domain at Vercel, verify HTTPS
- [ ] `robots.txt` + sitemap
- [ ] Add the URL to GitHub profile, LinkedIn, and resume header
- [ ] Ask 2–3 people to click through and tell me what's confusing

---

## 5. Content to write

The code is the easy half. This is what actually gates shipping.

- [ ] **Bio** — 3–4 sentences. Who I am, what I'm into technically, what I'm looking for (internship? new grad role? when do I graduate?).
- [ ] **Education block** — SDSU, BS Computer Science, expected graduation, GPA if it's good, relevant coursework (data structures, algorithms, OS, databases, etc.)
- [ ] **Projects** — for each: what problem it solves, what I personally built, what stack, what was hard. Screenshot or short screen recording. GitHub link that goes to a repo with a real README.
- [ ] **Experience** — internships, jobs (yes, non-tech jobs count — frame the transferable parts), research, TA/grader, club or hackathon work. Bullets with concrete outcomes, not duties.
- [x] **Resume PDF** — `public/resume.pdf` is a copy of `Jake Recharte Resume.pdf` (Oct 6 2026). Swap the file to update; nothing in code names a tab. **It carries the phone number** — see `CONTENT.md` §8 Q9.
- [x] **Links** — GitHub, LinkedIn, email (LinkedIn URL corrected 2026-10-13)

---

## 6. Backlog (post-v1)

- Dark/light toggle
- View-transition animations between project details
- Writeups per project (a real case study page)
- Blog
- Analytics (Vercel Analytics is one line)
- A terminal/CLI easter egg — on-brand for a CS portfolio

---

## 7. Open questions

- [ ] Which 3–6 projects make the cut? Quality beats quantity — three strong ones beat eight class assignments.
- [ ] Do I have screenshots/demos for each, or do I need to build them?
- [ ] Is the intro splash worth the delay it costs every visitor? (Reference site: 1.8s before you see anything. That's a lot to spend on an animation.)
- [ ] Include GPA?
- [ ] Domain name?

---

## Log

- **2026-08-21** — Repo initialized. Reference site (afamolie.com) torn down and documented. Plan written. Stack chosen: Next.js + TS + Tailwind + Motion on Vercel.
- **2026-08-21** — Phase 0 complete. Next 16.3.2 scaffolded, tooling wired, build green. Vercel connection still pending (needs browser).
- **2026-10-01** — Fog background built from gradients instead of the reference's 2.9 MB GIF. Layout rebuilt on the sawad pattern: sticky profile card, scrolling sections, two-tone headings, scroll reveals. Content files typed but still placeholder.
- **2026-10-13** — Header rebuilt on the brandon-garate.com pattern: the sticky
  profile card is gone, replaced by a full-width header card — identity on the
  left, a "Now and recently" rail plus the real GitHub contribution graph on the
  right. Graph data is scraped by `npm run contributions` into a committed JSON
  file, so the build stays offline and the page stays static. Kept the dark fog
  canvas rather than the reference's light browser-chrome card.
- **2026-10-13** — Contribution graph trimmed to the trailing 6 months
  (`MONTHS_SHOWN`), counted over the drawn window rather than the full year so
  the caption stays true: 229 since Apr 2026. Grid metrics pulled into shared
  `CELL`/`GAP`/`PITCH` constants so the month labels can't drift off the
  columns again.
- **2026-10-13** — Projects and Experience merged into one "Work & projects"
  section backed by `src/content/work.ts`; for an undergrad they make the same
  claim, and splitting them halved both lists. The Tools grid came off — tools
  are listed per row instead, so a chip is evidence rather than an assertion.
  "Now and recently" badges switched from status (`NOW`/`INTERN`) to kind
  (`CLUB`/`INTERNSHIP`/`PROGRAM`), which were mixing two axes in one chip;
  ongoing rows now say so in the period (`Sep 2025 - Now`). Sigma Phi Delta
  corrected to a September 2025 start per Jake.
- **2026-10-13** — Placeholders gone. `work.ts` now holds the five real
  projects plus the three real roles, ordered live-first then newest. The
  self-referential Portfolio row came off because its repo 404s. Stats row
  swapped from invented counts ("3 years coding") to sourced numbers: 82%
  accuracy, 330K parcels, 2 hackathon placements. Hero heading changed from
  `COMPUTER`/`SCIENCE` to `ACTUALLY`/`FINISHED` — the old one spent the biggest
  type on the page restating the obvious. Tagline and OG description now lead
  with the PyPI package, the Supabase app and the 82% model.
- **2026-10-13** — Work and projects split apart again, and projects split in
  two: three featured cards (CWG, Permit Paragons, BoulderBuddy, in Jake's
  ranked order) over a plain-row timeline for the rest. Cards are now the one
  deliberate exception to "rows beat boxes" besides the header, which is what
  makes the featured set read as featured. NAVSEA/FathomWerx moved into Work
  with a `PROGRAM` chip — attended, not built — and its spelling corrected
  from the CV's "FathomWorks" per Jake.
- **2026-10-13** — The contribution graph became a link to the profile it is
  scraped from, and the snapshot it draws now refreshes itself: a daily
  `workflow_dispatch`-able Action re-runs the scraper and commits the JSON,
  but only when the calendar moved — the `fetchedAt` stamp changes every run
  and committing on that alone would be a commit a day that says nothing.
- **2026-10-13** — The project board stopped being a set of titles: each tile
  now carries its period, blurb and tech chips from `sm:` up, and the dialog
  behind it was rebuilt around what the tile *can't* hold — a live demo, a
  2–3 paragraph write-up and a guide to driving it. First demo: the AI
  Trading Model, with its random forest exported to JSON and walked in the
  browser, so there is nothing to host and nothing to keep alive. Re-running
  the pipeline also moved its headline number from 1.7% to 1.95% — same code,
  a fresher Yahoo pull — which the site now states both halves of
  (CONTENT.md §8.13).
- **2026-10-14** — Homelab added to the project board at Jake's request, from
  the three CS 470 lab PDFs he supplied (`lab0`, `lab1`, `lab1b`): an OpenBSD
  VM on a static address serving DNS for cs470.internal with BIND, a P-384
  root CA built on OpenSSL's `CA.pl`, and an OpenLDAP directory reachable only
  over LDAPS, bridged into the system's user and group lookups by `ypldap`.
  Labelled `PROJECT` / `IN PROGRESS`, `Aug 2026 - Now`, and it sits between
  Apple Picker and the AI Trading Model on an August start. That takes the
  board to **six tiles — two complete rows with no inert filler**, so
  `CONTENT.md` §5 widened `otherProjects` from 2–5 to 2–6 and §3's filler
  arithmetic was rewritten. The copy claims nothing past lab 1b and says the
  thing isn't finished; what Jake needs to confirm is §8.23.
- **2026-10-14** — **Second route: `/art`.** The site stopped being one page.
  `src/app/art/page.tsx` is the route (a folder under `app/` becomes a URL
  segment; the `page.tsx` inside it is what makes the segment public), fed by
  `src/content/art.ts` and rendered by `ArtGallery` — uncropped masonry, two
  columns on a phone and three from `lg:`, because art is the one kind of
  content on this site that a square crop actively damages (DESIGN.md §2.3).
  Three things moved to make room: the fog, the nav bar and the footer went
  from `page.tsx` up into the **root layout**, so both routes share one copy
  and the fog GIF no longer restarts on navigation; the nav's homepage anchors
  became **rooted** (`/#work`, not `#work`, which resolved to `/art#work` from
  the gallery) and all its links became `next/link`; and `SectionHeading` grew
  `size` and `as` props, which closed the hero-duplication note DESIGN.md §6
  had open since the doc was written — the art page needed that markup a third
  time and copying it again was the point the note came due. **Every word on
  the page is a placeholder**: CONTENT.md has no verified fact about Jake's
  art, so all six pieces have `src: null` and draw an empty labelled frame at
  a real aspect ratio. New: CONTENT.md §2.7, §5's `ArtPiece` limits, and §8
  Q24, which is the list of what Jake has to supply.
- **2026-10-14** — Featured cards gained the project dialog. Until now only
  the board tiles had one, so CWG — the lead project — had nowhere to put a
  demo. The dialog moved out of `ProjectBoard` into `ProjectDialog`, which
  takes its trigger as `children` the way the resume and contact dialogs
  already did; both call sites stayed server components. CWG's demo runs the
  real interpreter under Pyodide, which makes it the third live demo and the
  first that executes Jake's own published package in the visitor's browser.
