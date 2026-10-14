# CONTENT.md — the source of truth for anything the site says

Read this before editing anything under `src/content/`, writing user-facing
copy, or adding a section. `TODO.md` is the build plan; this is the fact sheet.

**Hard rule: do not invent facts about Jake.** Every number, date, job title,
course name, and project claim on this site has to trace back to §2 below (his
CV and transcript) or to something he said directly. If a fact you need is
missing, add the question to §8 Open asks and leave a clearly-marked
placeholder. A plausible-sounding invention is worse than a blank, because it
ends up in front of a recruiter who may ask about it in an interview.

**Sources of record**

| Source | Covers | Status |
| --- | --- | --- |
| `FULL CV.pdf` (master CV, supplied 2026-10-13) | education, work, projects, skills, extracurriculars | authoritative |
| `SSR_TSRPT.pdf` (SDSU unofficial transcript, printed 2026-07-10) | courses, grades, GPA through Spring 2026 | authoritative |
| github.com/JakeRecharte | public repos (read 2026-10-13) | authoritative, see §4 |
| LinkedIn | — | **could not be read**, see §4 |

The CV is a master record that feeds several resume tabs (Base, Robotics, Full
Stack, AI/ML). Its "Appears on:" and "Keywords:" lines are resume-tab
bookkeeping, **not site content** — ignore them when writing copy.

---

## 1. Where content lives

All copy is typed TS objects. No CMS, no MDX, no hardcoded strings in
components.

| File | Exports | Renders in |
| --- | --- | --- |
| `src/content/site.ts` | `site` — name, headline, role, tagline, bio, email, links, education, stats | `Header`, `Hero`, `Contact` |
| `src/content/now.ts` | `NowEntry[]` — the 4 newest roles, with status badges | `Header` |
| `src/content/contributions.json` | generated, **do not hand-edit** — refresh with `npm run contributions` | `ContributionGraph` |
| `src/content/projects.ts` | `Project[]` | `Projects` section |
| `src/content/experience.ts` | `Role[]` | `Experience` section |
| `src/content/tools.ts` | `Tool[]` | `Tools` section |

Touch `src/components/Sections.tsx`, `Header.tsx`, `SectionHeading.tsx`
only when the *shape* changes, not the words. Metadata strings are duplicated
in `src/app/layout.tsx` — if `site.role` or the tagline changes, update the
`<title>`/description/OG block there too.

---

## 2. The facts

Everything in this section is verified against the CV or the transcript.
Numbers are quoted exactly as the CV states them — don't round, inflate, or
"approximately" them.

### 2.1 Identity

- **Name:** Jake Recharte
- **Location:** San Diego, CA
- **Email:** jakerecharte@gmail.com
- **Phone:** (805) 889-0380 — *CV only. Do not put a phone number on a public
  web page unless Jake explicitly asks; see §8.*
- **GitHub:** https://github.com/JakeRecharte (display handle is currently
  "Tendie"; bio "SDSU Computer Science Class of 2028"; 6 public repos)
- **LinkedIn:** https://www.linkedin.com/in/jake-recharte-8a3470377/
  — corrected in `site.ts` on 2026-10-13 (it previously pointed at the
  non-existent `/in/jakerecharte`).

### 2.2 Education

- San Diego State University, College of Sciences, San Diego, CA
- B.S. Computer Science — **expected May 2028**
- Plan of record on the transcript: Computer Science Major, subplan *Computer
  Science Pre-Major* (through Spring 2026)
- Transfer credit from Moorpark College and Oxnard College; test credit covers
  CS 100, CS 150/150L, CS 299, MATH 150, STAT 250, ART 101

**Completed CS/math coursework (transcript, with term):**

| Course | Term |
| --- | --- |
| CS 160 / 160L Intermediate Computer Programming | Fall 2024 |
| MATH 151 Calculus II | Fall 2024 |
| CS 210 Data Structures | Spring 2025 |
| CS 240 Computer Organization | Spring 2025 |
| MATH 254 Intro to Linear Algebra | Spring 2025 |
| PHYS 195 Principles of Physics | Spring 2025 |
| CS 370 Computer Architecture | Fall 2025 |
| CS 450 Intro to Artificial Intelligence | Fall 2025 |
| CS 250 Intro to Software Systems | Spring 2026 |
| CS 420 Advanced Programming Languages | Spring 2026 |
| MATH 245 Discrete Mathematics | Spring 2026 |

Plus, from test/transfer credit: CS 100 Computer Science Principles, CS 150
Intro Computer Programming (+ lab), MATH 150 Calculus I, STAT 250 Statistics.

**In progress / not yet on the transcript** (CV, as of Fall 2026): Algorithms
(CS 460 — repo exists), Machine Learning, UNIX/System Design, 3D Game Design,
Ethics of AI.

**GPA (transcript):** SDSU cumulative **3.09**; overall cumulative (incl.
transfer) **3.16**; transfer **3.60**. Best term: Spring 2026 at 3.40.
→ **Recommendation: do not display GPA on the site.** `TODO.md` §1 says the
site should answer "can he write code" — a 3.09 doesn't help that case, and
nothing requires volunteering it. This closes the open GPA question in
`TODO.md` §7 unless Jake overrides.
→ Related: CS 420 was withdrawn (W) in Fall 2025 and retaken for an **A** in
Spring 2026. That's a good story in an interview, not site copy.

### 2.3 Work experience

**GradeFlow — Software Developer Intern — February 2026 – July 2026**
- Built a curriculum standards tagging feature on a team of 5: takes
  teacher-uploaded assignment descriptions and automatically assigns aligned
  curriculum standards with confidence scores.
- Built a document-processing pipeline with PDF scrapers to extract and store
  structured standards data from 1,000+ curriculum pages in a searchable
  Supabase (PostgreSQL) knowledge base.
- Developed and integrated an ML model mapping assignment descriptions to
  standards with scored confidence outputs — **82% average accuracy**.

**NAVSEA / FathomWorks — Engineering Program Student — September 2023 – December 2023**
- 8-week government-sponsored defense engineering program covering defense and
  military technologies, with lectures from government and industry engineers.
- Note: this predates SDSU enrollment (Fall 2024) — it's a high-school-era
  program. Real and worth listing, but it is a program, not a job; don't let
  the copy imply engineering employment.

**Recharte's Gold Coast Insurance — IT & Office Support — September 2021 – May 2023**
- In-house IT support for a 7-computer office: hardware upgrades, Windows OS
  installations, software configuration.
- Family business (name match). Fine to list; frame as the IT work it was.

### 2.4 Projects

Ordered newest first, as the CV has them. "Repo" = verified public GitHub repo.

**Shower Hacks — "Lightning McShower" — September 2026**
- Hackathon, team of 5. **1st in hardware, 4th overall out of 200 competitors.**
- A remote-controlled car using a vision model and a gas sensor to determine
  the hygiene level of the person in front of it.
- Jake owned the hardware build (car assembly, camera and gas sensor wiring)
  and overall project scope.
- Tech: Arduino, Python, C++, HTML, sensors, multimeter, computer vision.
- Repo: **none found** — see §8.

**Building for Good Hackathon — "Permit Paragons" — August 2026**
- Hackathon, team of 6. **4th of 100+ participants.**
- Permit prediction algorithm to speed up low-income housing developers'
  timelines.
- Jake built the TypeScript front-end map visualization of **330,000+ parcels**
  in San Diego County.
- Tech: TypeScript, Python, Docker.
- Repo: **none found** — see §8.

**CWG — Coding With Git — May 2026 – Present**
- A language where the git commit DAG *is* the source code: branches are
  control-flow blocks, commits are Python statements, merges close scopes, tags
  define functions, `git revert` handles exceptions.
- Tree-walking interpreter that scrapes the repo via GitPython, builds an AST
  of if/while/for/fn nodes, executes via Python's `exec`/`eval`.
- Tech: Python, GitPython, Git.
- Repo: https://github.com/JakeRecharte/CWG-Coding_with_Git — **6 stars, the
  only repo with a polished README** (banner, badges, language reference,
  contributing guide, GPL v3).
- **Published on PyPI as `cwg`, v0.2.0, Python ≥3.10** —
  https://pypi.org/project/cwg/. The CV does not mention this. It is the single
  most distinctive thing on the whole CV: a published package with real docs.
  **Lead the Projects section with it.**

**BoulderBuddy — March 2026 – Present**
- Cross-platform mobile app for climbers: log routes with gym, V-grade, notes,
  photos; Supabase auth; relational PostgreSQL schema for gyms, routes, 3D hold
  placements, user profiles, community grade voting.
- Nearby-gym finder using phone GPS and the Haversine formula to sort by
  distance, climbing-style tags (bouldering, top rope, lead), one-tap
  directions in Apple or Google Maps.
- Rebuilt the whole app in Flutter (screens, login, navigation, theming) on the
  same Supabase backend and schema.
- Tech: TypeScript, React Native, Expo, Supabase, PostgreSQL, Flutter.
- Repo: https://github.com/JakeRecharte/BoulderBuddy — README is decent but
  **describes an earlier state** (AsyncStorage local persistence; Feed, Nearby
  Gyms and Profile marked "coming soon") that contradicts the CV's Supabase
  schema and shipped gym finder. Last push 2026-04-09. See §8.

**AI Trading Model — November 2025**
- Stock prediction pipeline pulling historical data from the Yahoo Finance API,
  then cleaning and preprocessing it for training.
- Random Forest Regression model ranks top stocks into an equal-weight
  portfolio of the top 5 — **beat the market by 1.7% in backtesting**.
- Tech: Python, Pandas, NumPy, scikit-learn, yfinance.
- Repo: https://github.com/JakeRecharte/Trading-Model (1 star). README is
  short, has typos ("Yahoo Fiance", "selction", "incerease"), and admits the
  large universe is untested. It also says "Assignment for CS450" — the CV
  doesn't. See §8.

**Avalanche NFT Project — 2022 – 2023**
- Co-founded and led a team of 8 to design, develop and launch an NFT
  collection on the Avalanche blockchain; oversaw smart contract deployment and
  community growth. **$12,000 in mint revenue.**
- Tech: Avalanche blockchain, Web3.
- Repo: none. High-school-era.
- **Judgment call for §8:** genuinely impressive for leadership and shipping,
  but crypto/NFT reads badly with a chunk of engineering recruiters. The CV
  itself only puts it on the Base template. Jake's call whether it makes the
  site.

### 2.5 Skills (CV, verbatim groupings)

- **Languages:** Python, TypeScript, JavaScript, Java, SQL, C++, Dart, HTML
- **Frameworks & Libraries:** React, React Native, Flutter, Pandas, NumPy,
  scikit-learn
- **Databases:** PostgreSQL, Supabase
- **Tools & Platforms:** Git, GitHub, Linux/Unix, Docker, Expo, Arduino,
  Hugging Face, Claude API
- **Project-specific (list only alongside their project):** GitPython,
  yfinance, Web3, sensors, multimeter
- **Concepts:** Machine Learning, Model Evaluation, Data Structures &
  Algorithms, OOP, REST APIs, Relational Database & Schema Design, Data
  Pipelines, Document Parsing & Extraction, Computer Vision, Sensor & Hardware
  Integration, Blockchain
- C# / Unity is **not** on the CV but is the language of the Apple-Picker repo
  (ShaderLab + HLSL too) — see §4 and §8.

### 2.6 Extracurriculars

- **ColorStack — Co-Vice President — July 2026 – Present.** Reestablishing
  SDSU's chapter; helped plan workshop events with 60+ attendees.
- **Sigma Phi Delta (engineering fraternity) — Rush & Brotherhood Chairs —
  November 2025 – Present.** Ran a 3-week rush reaching ~500 students; planned
  events with 100+ attendees.
- **Sigma Phi Delta — Academic Chair — November 2025 – Present.** Bi-weekly
  study sessions over 4 months, 40+ brothers attending regularly.
- **AI Club — Member — January 2026 – Present.** Completed a semester-long
  work study with a partner company; starting a second with Bright Sky
  Recruiting. One semester-long group project done, a second in progress.
- **SDSU Rock Climbing Club — Member — September 2025 – Present.** Attends and
  helps set up events. (Not on any resume tab; it's the human-interest one and
  it explains BoulderBuddy — worth one line somewhere.)

---

## 3. What to actually put on the site

Derived from §2. This is a recommendation, not a fact — Jake can override any
of it.

**Projects — ship 5, in this order.** The section holds 3–6 (§5).

1. **CWG — Coding With Git** — most distinctive, published on PyPI, best README.
2. **BoulderBuddy** — the most "real product" one, full-stack + mobile.
3. **GradeFlow work** stays in Experience, not here.
4. **Lightning McShower** — the award (1st in hardware of 200) plus hardware range.
5. **Permit Paragons** — the other placement, plus a big concrete number (330k parcels).
6. **AI Trading Model** — ML with a measurable result.

Avalanche NFT: Jake's call (§2.4). Apple-Picker and CS460: coursework repos,
leave off. This Portfolio site itself: optional 6th, but see the §4 warning
about its repo not being public.

**Experience — 3 roles,** in CV order: GradeFlow, NAVSEA/FathomWorks,
Recharte's Gold Coast Insurance. Drop the fake placeholder internship and the
generic "Relevant Coursework" row — coursework belongs in the profile card or
its own small block, using the real §2.2 list.

Extracurriculars have no section today. ColorStack Co-VP and the Sigma Phi
Delta chairs are real leadership signal. Either add a small section or fold the
strongest one into Experience — flagged in §8.

**Stats row — three candidates that are all literally true:**

| Value | Label | Sourced from |
| --- | --- | --- |
| `8` | LANGUAGES / SHIPPED | §2.5 languages list |
| `2` | HACKATHON / PLACEMENTS | 1st-in-hardware + 4th, and 4th of 100+ |
| `6` | PROJECTS / BUILT | §2.4 count |
| `82` | PERCENT / ACCURACY | GradeFlow ML model |
| `330K` | PARCELS / MAPPED | Permit Paragons |

Prefer the concrete ones (`82`, `330K`) over the countable-but-soft ones; they
survive scrutiny better. "Years coding" has no source — don't use it. Labels
must be two words, ≤10 chars each (§5).

---

## 4. External-source audit (read 2026-10-13)

**GitHub — 6 public repos.** Joined 2025-07-11. Display name "Tendie".

| Repo | Lang | README | Note |
| --- | --- | --- | --- |
| `CWG-Coding_with_Git` | Python | **strong** | 6 stars, on PyPI, docs/ with LANGUAGE.md, CONTRIBUTING, GPL v3 |
| `BoulderBuddy` | TypeScript, PLpgSQL | ok but stale | describes AsyncStorage + "coming soon" features the CV says shipped |
| `Trading-Model` | Python | thin | typos; says "Assignment for CS450" |
| `Machine-Learning` | Jupyter | **none** | desc: "name will be updated when we have a team/project name" |
| `Apple-Picker` | C#, ShaderLab, HLSL | **none** | Unity; likely the 3D Game Design course |
| `CS460` | — | **none** | empty; "Assignments for my SDSU CS460 Algorithms Class" |

**`github.com/JakeRecharte/Portfolio` returns 404** — it is private or doesn't
exist under that name. `projects.ts` currently links there and `TODO.md` lists
it as the repo URL. **That link is dead for every visitor.** Either make the
repo public or drop the self-referential project row.

**LinkedIn could not be read.** `linkedin.com/in/jake-recharte-8a3470377`
returns HTTP 999 to any unauthenticated fetch — that's LinkedIn's
anti-scraping, not a broken link, and no tool available here can get past it.
The one fact taken from the URL is the correct vanity path (§2.1). If anything
on LinkedIn isn't already in the CV, Jake needs to paste it (§8).

---

## 5. Shape and length constraints

The layout is tight. These are the limits the design actually holds at.

**Display headings** (`SectionHeading`, `site.headline`) — exactly two strings,
uppercase, rendered up to `text-8xl` with `tracking-tighter`. Each line
**≤ 10 characters**; longer wraps and breaks the two-line effect. The second
line renders at 20% opacity, so the pair must read as one phrase
(`RECENT`/`PROJECTS`), never as two sentences.

**`site.stats`** — exactly 3 entries. `value` 1–3 characters (`82`, `330K`),
`label` a tuple of exactly two words on separate lines, each **≤ 10 chars**.
Every stat must be literally true and traceable to §2.

**`NowEntry`** — exactly 4 entries, newest start date first. `org` ≤ 18 chars
and `title` ≤ 26 chars; past that the row wraps to two lines on a laptop.
`period` is the **start** month (`Nov 2025`) for anything ongoing and a span
(`Feb - Jul 2026`) for anything finished. `badge` is `NOW` for ongoing,
otherwise what the role was. Every entry must also exist in §2.3 or §2.6.

**`site.tagline`** — 1–2 sentences, ~150–220 chars, sits under the hero at
`max-w-xl`.

**`site.bio`** — 1–2 sentences, ~120–180 chars. Sits in the sticky card;
longer makes the card taller than the viewport on laptops and breaks the sticky
behaviour.

**`Project`** — `slug` (kebab-case, stable; becomes the Phase 4 deep-link URL),
`title` ≤ 30 chars, `blurb` 1–2 sentences ~120–200 chars, `tech` 2–4 chips of
≤ 14 chars each, `year` a 4-digit string, plus `repoUrl` and/or `liveUrl`. The
row links to `liveUrl ?? repoUrl`, so **a project with neither is an
unclickable row**. Keep the array at **3–6 items**, newest first.

**`Role`** — `org` ≤ 30 chars, `title` ≤ 40, `period` a short span
(`Feb – Jul 2026`), `bullets` **2–3 items**, each ~80–140 chars. Bullets are
outcomes, not duties.

**`Tool`** — `name` ≤ 14 chars, `kind` one of Language / Library / Framework /
Database / Version Control / Environment unless deliberately adding a category.
6–12 items, grouped so same-`kind` entries sit together — the grid renders
array order, there's no sorting. The §2.5 list is longer than 12; trim to what
Jake would be comfortable being interviewed on.

---

## 6. Voice

Short declarative sentences. Concrete over impressive. No exclamation marks, no
"passionate", "leverage", "cutting-edge", "journey", "I'm a developer who
loves...". Say what the thing does and what he built.

Write as Jake, first person, but sparing with "I" — hero and section copy
mostly drop the pronoun. Student-honest: a class project can be called a class
project; a hackathon build can be called a weekend. Never imply professional
experience that doesn't exist, and never upgrade a team result into a solo one
— the CV is careful about "on a team of 5", so the site must be too.

Numbers carry the copy. Where §2 has one (82%, 330,000+, 1st of 200, $12,000,
1.7%), use it. Where it doesn't, don't reach for an adjective instead.

Em dashes are used throughout the existing copy; keep them. American spelling.

---

## 7. Accessibility and technical constraints on copy

- Body text sits at `text-white/55`–`/65` on a near-black canvas. Don't drop
  copy below `/55` — `TODO.md` §1 commits to 4.5:1 contrast.
- Stat labels are visually two lines but exposed to screen readers via an
  `sr-only` `<dt>` joined with a space, so the two words must read correctly
  concatenated.
- Any image needs real `alt` text written as content, not `"screenshot"`, and
  goes through `next/image`.
- External links already get `target="_blank" rel="noreferrer"`; internal paths
  (like `/resume.pdf`) must not.
- `prefers-reduced-motion` is handled globally in `globals.css`. Don't write
  copy that only makes sense while an animation plays.

---

## 8. Open asks — Jake, this is the list

The CV and transcript closed most of the original questions. These are what's
left, roughly in order of how much they block.

**Broken or wrong right now**
1. `github.com/JakeRecharte/Portfolio` 404s. Make it public, or should the
   Portfolio row come off the site?
2. Resume PDF → needs to land at `public/resume.pdf`; `site.links.resume`
   points there and 404s today. Which tab — Base, Full Stack, or AI/ML?
3. Are there repos for **Lightning McShower** and **Permit Paragons**? They're
   two of your five best items and both would be unclickable rows without a
   URL. A teammate's repo or a Devpost page works.
4. **BoulderBuddy's README contradicts the CV** — it still says AsyncStorage
   and lists Nearby Gyms / Feed / Profile as "coming soon", and nothing's been
   pushed since April. The CV says Supabase, the gym finder, and a Flutter
   rebuild. Is that work in a private repo or a branch? A recruiter clicking
   the row lands on the stale version.
5. `Trading-Model`'s README has typos and says "Assignment for CS450" while the
   CV presents it as a project. Want me to rewrite that README?

**Decisions only you can make**
6. **Avalanche NFT ($12k, team of 8) — on the site or not?** Real leadership
   signal; crypto also turns off some engineering recruiters. Your call.
7. **Extracurriculars** — ColorStack Co-VP and the Sigma Phi Delta chairs are
   strong. Own section, folded into Experience, or left off?
8. **What are you targeting?** The site currently says "summer 2027
   internship" in two places. Confirm — summer 2027, new grad 2028, or both?
9. Phone number: CV has it, the site doesn't. Keep it off? (Recommended —
   email plus LinkedIn is enough, and a scraped phone number invites spam.)
10. Photo for the profile card, or keep the `JR` monogram?
11. GPA: §2.2 recommends leaving it off. Confirm or override.
12. Three or four sentences in your own words about what you're into
    technically — I'll cut them to length, not add to them. Right now the bio
    and tagline are my invention, not your voice.

**Nice to have**
12a. The header's contribution graph shows the **last 6 months** — 229 real
    contributions since Apr 2026. (The full year is 274, so the recent window
    is the denser, better-looking half.) Change `MONTHS_SHOWN` in
    `ContributionGraph.tsx` to widen it; the JSON always holds a full year, so
    no re-fetch is needed. Say the word if you'd rather it came off entirely.
13. Screenshots or screen recordings for any of the five projects (`TODO.md`
    Phase 3 has a media task open). The hackathon car and the parcel map are
    the two most visual.
14. Is C# / Unity (the Apple-Picker repo) something you'd want listed, or is it
    just coursework?
15. Your GitHub display name is "Tendie" and your bio is one line. Recruiters
    click through from this site — want it tidied?
16. Anything on LinkedIn that isn't in the CV? I can't read it (§4), so paste
    anything that matters.
17. Domain decision (`TODO.md` §3 and §7).
18. Anything you'd rather the site *not* say.

---

## 9. Workflow for a content change

1. Confirm the fact is in §2, or that Jake just supplied it.
2. Edit the `src/content/*.ts` file. Remove the `TODO:` comment above anything
   you've made real.
3. If a field is still unknown, leave it obviously fake (`Project Two`) rather
   than subtly fake — placeholders must be recognisable at a glance.
4. Run `npm run typecheck && npm run lint && npm run format`.
5. Tick the matching box in `TODO.md` §2 / §5 and add a line to its Log.
6. When an answer to §8 arrives, fold the fact into §2 and strike the question
   in the same commit. This file is only useful if it stays accurate about
   what's still unknown.
