# Portfolio — Project Plan

**Owner:** Jake Recharte — CS student, San Diego State University
**Repo:** https://github.com/JakeRecharte/Portfolio
**Goal:** A personal site that showcases my projects and experience to recruiters, hiring managers, and anyone I hand a link to.

---

## 1. Goals

### Primary
- [ ] Give recruiters a single link that answers: *who is this, what has he built, can he write code, how do I reach him.*
- [ ] Show 3–6 projects with real detail (problem, stack, what I did, link to code/demo).
- [ ] Show experience: internships, jobs, research, TA/tutoring, clubs, relevant coursework.
- [ ] Make resume download one click.
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

### Phase 1 — Skeleton
Structure with placeholder text. Ugly is fine; wiring is the point.
- [ ] Root layout: full-height dark canvas, font loading, metadata
- [ ] Left identity rail: name, "CS Student @ SDSU", nav
- [ ] View state (`home | projects | experience | contact`) driving the right pane
- [ ] `AnimatePresence` enter/exit between views
- [ ] Nav as real `<button>` elements — keyboard focusable, visible focus ring, `aria-current` on the active one
- [ ] Mobile layout: stacks to column, nav becomes a row
- [ ] `prefers-reduced-motion` respected globally

### Phase 2 — Content layer
- [ ] `src/content/projects.ts` with a typed `Project`: `slug`, `title`, `blurb`, `description`, `tech[]`, `repoUrl`, `liveUrl`, `media`, `date`
- [ ] `src/content/experience.ts` with a typed `Role`: `org`, `title`, `start`, `end`, `bullets[]`
- [ ] `src/content/site.ts` — name, tagline, links, email
- [ ] Fill in **real content** (see §5 — this is the actual bottleneck, not the code)

### Phase 3 — Sections
- [ ] **Home** — name, one-line pitch, short bio, education (SDSU, major, expected grad), primary links
- [ ] **Projects** — master-detail: list of titles, panel with description, tech chips, screenshot/demo, GitHub + live links
- [ ] **Experience** — vertical timeline: role, org, dates, 2–4 accomplishment bullets each; relevant coursework below
- [ ] **Contact** — big links: GitHub, LinkedIn, Email, Resume PDF
- [ ] Custom 404

### Phase 4 — Polish
- [ ] Intro animation — make it *skippable*, and don't replay it on every navigation (`sessionStorage` flag)
- [ ] Background treatment: gradient, subtle noise, or canvas effect (a heavy GIF is the reference's worst perf decision — don't copy it)
- [ ] Hover/tap micro-interactions on nav and project list
- [ ] Deep-link projects (`?p=slug` or `/projects/[slug]`) so a single project is shareable
- [ ] Per-view `<title>` and description
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
- [ ] **Resume PDF** — current version, exported to `public/resume.pdf`
- [ ] **Links** — GitHub, LinkedIn, email

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
