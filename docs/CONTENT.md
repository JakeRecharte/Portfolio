# CONTENT.md: the source of truth for anything the site says

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
| `JakeRecharte/USC-Dual-Hacks`, README and `git log` (read 2026-10-18) | the Clearline project, §2.4 | authoritative for what it is and who committed what; **not** for the result or the team |
| LinkedIn | n/a | **could not be read**, see §4 |

The CV is a master record that feeds several resume tabs (Base, Robotics, Full
Stack, AI/ML). Its "Appears on:" and "Keywords:" lines are resume-tab
bookkeeping, **not site content**, ignore them when writing copy.

---

## 1. Where content lives

All copy is typed TS objects. No CMS, no MDX, no hardcoded strings in
components.

| File | Exports | Renders in |
| --- | --- | --- |
| `src/content/site.ts` | `site`, name, headline, role, tagline, bio, about, email, links, education, stats | `Header`, `Hero`, `ContactDialog`, `AboutDialog` |
| `src/content/now.ts` | `NowEntry[]`, the 4 newest roles, with status badges | `Header` |
| `src/content/contributions.json` | generated, **do not hand-edit**, refreshed daily by `.github/workflows/contributions.yml`, or by hand with `npm run contributions` | `ContributionGraph` |
| `src/content/projects.ts` | `featuredProjects` (top 3, ranked) and `otherProjects` (the rest, newest first), both `Project[]` | `FeaturedProjects` cards, `AdditionalProjects` rows |
| `src/content/experience.ts` | `Role[]`, the internship, the program, the job | `Experience` section |
| `src/content/art.ts` | `art`, the `/art` page's headline and intro; `artPieces`, `ArtPiece[]`, newest first | `src/app/art/page.tsx`, `ArtGallery` |

`art.ts` is the only content file whose source is a set of image files rather
than the CV, see §2.7. The pieces are real; their years and mediums are the
part still open (§8 Q24).

Touch `src/components/Sections.tsx`, `Header.tsx`, `SectionHeading.tsx`
only when the *shape* changes, not the words. Metadata strings are duplicated
in `src/app/layout.tsx`. If `site.role` or the tagline changes, update the
`<title>`/description/OG block there too.

---

## 2. The facts

Everything in this section is verified against the CV or the transcript.
Numbers are quoted exactly as the CV states them. Don't round, inflate, or
"approximately" them.

### 2.1 Identity

- **Name:** Jake Recharte
- **Location:** San Diego, CA
- **Email:** jakerecharte@gmail.com
- **Phone:** (805) 889-0380: *CV only. Do not put a phone number on a public
  web page unless Jake explicitly asks; see §8.*
- **GitHub:** https://github.com/JakeRecharte (display handle is currently
  "Tendie"; bio "SDSU Computer Science Class of 2028"; 6 public repos)
- **LinkedIn:** https://www.linkedin.com/in/jake-recharte-8a3470377/,
  corrected in `site.ts` on 2026-10-13 (it previously pointed at the
  non-existent `/in/jakerecharte`).

### 2.2 Education

- San Diego State University, College of Sciences, San Diego, CA
- B.S. Computer Science. **expected May 2028**
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
(CS 460. Repo exists), Machine Learning, UNIX/System Design, 3D Game Design,
Ethics of AI.

**GPA (transcript):** SDSU cumulative **3.09**; overall cumulative (incl.
transfer) **3.16**; transfer **3.60**. Best term: Spring 2026 at 3.40.
→ **Recommendation: do not display GPA on the site.** `TODO.md` §1 says the
site should answer "can he write code". A 3.09 doesn't help that case, and
nothing requires volunteering it. This closes the open GPA question in
`TODO.md` §7 unless Jake overrides.
→ Related: CS 420 was withdrawn (W) in Fall 2025 and retaken for an **A** in
Spring 2026. That's a good story in an interview, not site copy.

### 2.3 Work experience

**GradeFlow, Software Developer Intern, February 2026 – July 2026**
- Built a curriculum standards tagging feature on a team of 5: takes
  teacher-uploaded assignment descriptions and automatically assigns aligned
  curriculum standards with confidence scores.
- Built a document-processing pipeline with PDF scrapers to extract and store
  structured standards data from 1,000+ curriculum pages in a searchable
  Supabase (PostgreSQL) knowledge base.
- Developed and integrated an ML model mapping assignment descriptions to
  standards with scored confidence outputs, **82% average accuracy**.

**NAVSEA / FathomWerx, Engineering Program Student, September 2023 – December 2023**
- 8-week government-sponsored defense engineering program covering defense and
  military technologies, with lectures from government and industry engineers.
- Note: this predates SDSU enrollment (Fall 2024). It's a high-school-era
  program. Real and worth listing, but it is a program, not a job; don't let
  the copy imply engineering employment. It lives in the Work section anyway,
  by Jake's call, with the `PROGRAM` chip carrying the distinction.
- **Spelled "FathomWerx" on the site, 2026-10-13, per Jake**: the CV says
  "FathomWorks", and the lab in Port Hueneme spells it *Werx*. Worth fixing on
  the CV too.

**Recharte's Gold Coast Insurance, IT & Office Support, September 2021 – May 2023**
- In-house IT support for a 7-computer office: hardware upgrades, Windows OS
  installations, software configuration.
- Family business (name match). Fine to list; frame as the IT work it was.

### 2.4 Projects

Ordered newest first, as the CV has them. "Repo" = verified public GitHub repo.

**Clearline, USC Dual Use hackathon, October 2026**
- Hackathon: the **InnovateLA × Dual-Use Hackathon** at USC Viterbi, **Oct 16–18
  2026**, lens **Resilience Comms**. All of it is from the repo's own README
  (Jake's repo, read 2026-10-18), which closes the old question of whether it
  was the LA Tech Week event (§8.16). A third-party recruitment form
  (https://tally.so/r/7R0APa) also described "48 hours, 200+ student builders,
  problem withheld until Friday night". Jake hasn't confirmed that, so none of it
  is on the site.
- **What it is**, from the README (which calls it **Line**): Clearline connects what officers find at the
  door to the person who answers the phone during a wildfire evacuation. Three
  pieces: a one-tap **officer page** (Cleared, Refused, No answer, timestamped,
  held on the phone and sent later if there's no signal), a **voice agent**
  (Retell) that takes the call, checks the address against the sweep log and
  either says what was recorded and when or moves the call up the queue to a
  person, and a **dispatch board** (one map of every house's status, the call
  queue with the reason for each routing decision, and the door-knock list).
  Incident: the Palisades Fire, January 7, 2025.
- Stack, from `web/package.json` and the README: Next.js 15, React 19,
  TypeScript, Tailwind 4, MapLibre GL 5 on an OpenFreeMap basemap, Supabase
  (Postgres with Realtime), Retell AI for the voice agent, a Fastify server on
  Railway, Vercel for the web app. The tile carries **TypeScript, React,
  MapLibre, Supabase**: three are on the CV (§2.5), and MapLibre is named on
  the row that used it, the same way Apple Picker's Unity is.
- **What Jake built, in his words (2026-10-18) and confirmed by `git log`:** the
  officer's one-tap page and the dispatch board, plus **parts of the Supabase
  database, set up and wired into the front end**. His 39 commits
  (`jakerecharte`) are the web app: the officer and dispatcher portals with
  passcode sign-in, the Supabase-backed board, the paper-style map, the 8,103
  OpenStreetMap building footprints, the GPS-first officer map, the five-colour
  house rule, the Palisades Fire scenario, and the README. A teammate,
  Adriancluna (67 commits), wrote the server, the Retell agent and its prompt and
  tools, and also committed to `web/` (45 file touches against Jake's 123). "The
  voice agent and the phone line are teammates'" is read off the log and Jake
  hasn't disputed it, but he hasn't said it either.
- A third author name, **"Tendie"** (4 commits: the initial commit and three PR
  merges), is Jake's GitHub display name (§4), so it is probably him and is not
  counted above.
- **Result, Jake 2026-10-18: top third of the field, no placement.** That is
  his phrase and the copy keeps it ("finished in the top third of the field
  without placing"). No field size was given, so the copy has none, and a
  percentile is his own estimate, not a published ranking. It is why the stat
  row reads `2/3` (§3).
- **Team of 4**, Jake 2026-10-18, matching `team_plan.md`'s "for 4 people"
  (voice agent, backend and data, pitch, frontend and demo). The git log has
  only three author names, so at least one member committed nothing to the
  repo. The copy says "on a team of 4" and "teammates", and
  names no one.
- **The name is Clearline** (Jake, 2026-10-18), which is also what the Devpost
  page is titled ("Connecting Wild-Fire Dispatchers with Real Time House
  Evacuation", read 2026-10-18). The repo, the README, the app's header and its
  browser title all still say **Line**. The tile is `Clearline` and the dialog
  says the repo and the board's header still say Line, so a visitor who opens the
  demo or the repo isn't left wondering. Those strings are the team's code and
  are not patched in the build.
- The headline number, **3,624 911 calls in 24 hours against a normal day of just
  under 1,500** (LAFD, Jan 7 2025), is the team's own README and pitch citing
  LAFD. It is on the tile's dialog, and I did not check the original source.
- Repo: https://github.com/JakeRecharte/USC-Dual-Hacks, **Jake's own**, public,
  MIT, 109 commits across three author names. `liveUrl` is
  https://usc-dual-hacks.vercel.app (HTTP 200 on 2026-10-19), which Jake says is
  hosted live with the phone line technically working. Its sign-in screen prints
  the demo shift codes by design, so judges could get in (§8.27). `devpostUrl`
  is https://devpost.com/software/clearline-q2wktm (200 on 2026-10-18, supplied
  by Jake, who is on its team). The emailed link carried `ref_*` and `utm_*`
  tracking parameters and a `#app-team` anchor; the stored URL is the bare one.
- **Demo on the site since 2026-10-18**: the team's own dispatch board, built
  from `10fb4ea` by `scripts/build-usc-dual-hacks.sh` and opened on its
  Scenario mode, which replays the day on 8,088 placeholder households. **Real:**
  the map, the OpenStreetMap footprints, the 24-beat timeline from the LAPD and
  LAFD after-action reports and press, each street's researched threat level, and
  where and when the fire was documented. **Simulated:** what happens at any one
  house, every call and caller, the fire's shape between its documented points,
  and all addresses and resident names. The board's own banner says so and can't
  be closed. Nothing is connected behind it: no database, no phone line. The
  live site is the one with both connected, and the demo's note says so.
- Clearline is the **newest** project, so it takes the first seat on the board that
  the USC Dual Use placeholder held.

**Fool's Mate, September 2026 – Present**
- **Verified fact in full:** "a 2D game I'm developing", started September 2026
  (Jake, 2026-10-14). Nothing else is known.
- No public repo exists under that name as of 2026-10-14.
- The title is the chess term for the fastest possible checkmate. **Do not
  assume it is a chess game**. Nothing says so.
- On the board as an `IN PROGRESS` tile. Genre, engine, stack and what the game
  actually is are all open, see §8.

**Shower Hacks, "Lightning McShower", September 2026**
- Hackathon, team of 5. **1st in hardware, 4th overall out of 200 competitors.**
- A remote-controlled car using a vision model and a gas sensor to determine
  the hygiene level of the person in front of it.
- Jake owned the hardware build (car assembly, camera and gas sensor wiring)
  and overall project scope.
- Tech: Arduino, Python, C++, HTML, sensors, multimeter, computer vision.
- Repo: https://github.com/Ethanniu3177/Lightning-McShower, **a teammate's**
  (Ethan Niu), which is why it isn't under `JakeRecharte`. Public, language
  HTML, last pushed 2026-09-27, description "ShowerHacks". Supplied by Jake
  and verified 2026-10-14.
- Devpost: https://devpost.com/software/lightning-mcshower. Verified
  2026-10-14. This is the tile's destination, not the repo: for a hackathon
  the Devpost page is the judged submission, with the demo video and the
  team, and it is the thing worth landing a recruiter on.

**Homelab, August 2026 – Present**
- **Sourced from three lab PDFs Jake supplied on 2026-10-14** (`lab0.pdf`,
  `lab1.pdf`, `lab1b.pdf`), not from the CV. The CV doesn't list it. They are
  the course handouts for **SDSU CS 470: Unix/Linux Sysadmin, Fall 2026**,
  which is the "UNIX/System Design" course §2.2 has in progress.
- Jake named it **"Homelab"** and asked for it on the board as a `PROJECT`
  running **August 2026 – now** (2026-10-14). The dates and the label are his;
  the description is read off the labs.
- What the three labs build, in order:
  - **Lab 0**: a desktop hypervisor (VMware Fusion/Workstation on Intel, UTM
    on ARM Macs), shell and `vi` basics on the campus system, SSH key-based
    auth, and a shell script in `~/.profile` that finds a running `ssh-agent`
    or starts one and loads the key, so a password is typed once per session.
  - **Lab 1**: OpenBSD 7.9 installed from an ISO onto a custom disk label
    (one 14 GB root partition plus swap, GPT/UEFI), given a static address on
    the hypervisor's NAT network, then `sudo`, `bash`, `screen`, GnuPG and
    ISC BIND **built from source** through the ports tree with privilege
    separation (`doas`, `_pbuild`/`_pfetch`). `named` then serves
    **cs470.internal**: a forward zone of A records plus an MX, a reverse
    `in-addr.arpa` zone of PTRs, the `filter-aaaa` plugin hard-linked into
    BIND's chroot, and IPv6 turned off at both the daemon and the answers.
    Closes with `cron` jobs for `syspatch`/ports updates and a **custom
    kernel** (`CS470.MP`) rebuilt with the `softraid` and `vscsi` drivers
    removed.
  - **Lab 1b**: a **root certificate authority** built from OpenSSL's
    `CA.pl` with a **P-384 (secp384r1) elliptic curve** key, its certificate
    added to the trust anchors on both the VM and the host OS, then used to
    sign a server certificate carrying a `subjectAltName`. On top of it,
    **OpenLDAP**: `posixAccount` and `posixGroup` entries under
    `dc=cs470,dc=internal`, `slapd` listening on **LDAPS (636) and the local
    socket only, plain LDAP on 389 off**, and `ypldap` bridging the directory
    into the NIS maps OpenBSD resolves users and groups through, so one
    account logs into every machine. Ends by trimming the kernel and the VM's
    RAM.
- The lab network the labs are heading towards, all on cs470.internal with
  fixed last octets: openbsd `.71`, freebsd `.72`, alma `.73`, ubuntu `.74`,
  solaris `.75`, proxmox `.76`, alpine `.78`. **Only the OpenBSD box is
  described on the site**, because only labs 0–1b were supplied.
- Tech on the tile: OpenBSD, BIND, OpenLDAP, OpenSSL, see §2.5.
- No repo, no link. The tile is linkless like the two placeholders, which
  DESIGN.md allows on the board (every tile keeps its arrow and opens its
  dialog). See §8.23.
- **What is not claimed, on purpose:** that any lab past 1b is done, that the
  other six VMs exist yet, or that this is anything other than coursework.
  §6 is explicit that a class project can be called a class project, and the
  copy does. See §8.23 for what to ask him.

**Building for Good Hackathon, "Permit Paragons", August 2026**
- Hackathon, team of 6. **4th of 100+ participants.**
- Permit prediction algorithm to speed up low-income housing developers'
  timelines.
- Jake built the TypeScript front-end map visualization. **The CV's "330,000+
  parcels in San Diego County" is wrong twice**, see the parcel count below.
- Tech: TypeScript, Python, Docker.
- Repo: https://github.com/BrandonGarate177/BFFG-SD-HACKS, **a teammate's**
  (Brandon Garate), which is why it isn't under `JakeRecharte`. Public, language
  TypeScript, last pushed 2026-10-08, description "Make informed decisions about
  where to build affordable housing in San Diego, CA". Supplied by Jake and
  verified 2026-10-14. No Devpost page has been supplied.
- **Live, on the team's own AWS**: https://d1xtsrdl1l82x1.cloudfront.net,
  linked from the repo's README and verified 200 on 2026-10-14. It sends no
  `X-Frame-Options` and no CSP `frame-ancestors`, which is what lets the site
  embed it rather than only link to it.
- **393,755 parcels, City of San Diego, not 330,000+, and not the county.**
  From the repo's own `data/README.md`: `parcels_tile_attributes.parquet` has
  393,755 rows, the parcels falling inside a City base zoning polygon out of
  1,088,722 county-wide. The county is excluded on purpose, because city
  permit data doesn't cover unincorporated county and predictions there would
  be undefined. The site uses 393,755. See §8.
- Jake's 12 commits are the map, and they are specific: "wire up real parcel
  geometry and vector tiles", "lock zoom-out and pan range to San Diego",
  "type filter values directly", "price by archetype, scope the map by project
  type", "fold rates behind a disclosure, report the binding constraint", plus
  the favicon and a pyarrow/pydantic pin fix on the server. Second largest
  contributor of four.
- **The model is the team's, not Jake's, and the copy says so.** A
  `RandomSurvivalForest` (scikit-survival, 200 trees), chosen because ~29% of
  permits in the data are right-censored (not denied, simply not issued yet),
  so a regressor trained only on issued permits fits the fast half and
  under-predicts everything else. C-index 0.612, against 0.574 for a Cox PH
  baseline and 0.500 for chance. Chronological split at 2025-02-20.
- **Demo on the site since 2026-10-14**, and it is the **hackathon version**,
  not the team's current one. Brandon restyled the frontend onto a warm-paper
  editorial theme on 2026-10-07 (commit `c997e51`) to match his own site, so
  at Jake's request the demo is built from `ed392b2`, the last commit before
  that: the version the judges saw, the one Jake's commits are in, and the
  one whose dark palette suits this site. `scripts/build-permit-paragons.sh`
  builds it into `public/demos/permit-paragons/`.
- Three deployment patches, all recorded in that script: a `--base` and a
  react-router `basename` so it works from a subpath, and **the basemap**.
  CARTO's keyless tiles are now gated and print "API KEY REQUIRED" across the
  map, which is why the project itself moved to OpenFreeMap in October. The
  build takes that one change and nothing else from the restyle.
- Still from the team's AWS: the 77MB PMTiles archive of real parcel geometry
  (`Access-Control-Allow-Origin: *`, range requests, so it streams a viewport
  at a time) and the parcel API, which sends **no** CORS header and is
  therefore proxied server-side in `next.config.ts`. The RAG chat does not
  work in the demo. It is a WebSocket, which the proxy does not forward.

**CWG, Coding With Git, May 2026 – Present**
- A language where the git commit DAG *is* the source code: branches are
  control-flow blocks, commits are Python statements, merges close scopes, tags
  define functions, `git revert` handles exceptions.
- Tree-walking interpreter that scrapes the repo via GitPython, builds an AST
  of if/while/for/fn nodes, executes via Python's `exec`/`eval`.
- Tech: Python, GitPython, Git.
- Repo: https://github.com/JakeRecharte/CWG-Coding_with_Git, **6 stars, the
  only repo with a polished README** (banner, badges, language reference,
  contributing guide, GPL v3).
- **Published on PyPI as `cwg`, v0.2.0, Python ≥3.10**:
  https://pypi.org/project/cwg/. The CV does not mention this. It is the single
  most distinctive thing on the whole CV: a published package with real docs.
  **Lead the Projects section with it.**
- **Live demo since 2026-10-14**, and it is the real thing: Pyodide loads
  CPython as WebAssembly and installs the actual `cwg` wheel (vendored at
  `public/demos/cwg/wheels/`), so the interpreter a visitor drives is the one
  `pip install cwg` gives them. Six programs (statements, if/else, while,
  for, revert, functions) step commit by commit with scope and output, and
  two values per program are dialable so the program re-runs for real.
- **Found while building it: the `.cwg` runner is missing three verbs.**
  `cwg.runner.CWGRunner` parses `init`, `commit`, `branch`, `checkout` and
  `merge`, but not `revert`, `tag` or `cherry-pick`. It never sets
  `is_revert`, `revert_src` or `cherry_pick_src`, and always passes
  `functions=[]`. So **exception handling and functions cannot be expressed in
  a `.cwg` file at all**, only in a real repo. That is a third of the language
  the file format can't reach. See §8.
- **Also found: `cwg` can't be imported where git is absent.**
  `gpScraper.py` does `from git import …` at module scope and calls
  `sys.exit(1)` on failure (not a raise, an exit), so any environment
  without a git binary cannot even `import cwg`. See §8.

**BoulderBuddy, March 2026 – Present**
- Cross-platform mobile app for climbers: log routes with gym, V-grade, notes,
  photos; Supabase auth; relational PostgreSQL schema for gyms, routes, 3D hold
  placements, user profiles, community grade voting.
- Nearby-gym finder using phone GPS and the Haversine formula to sort by
  distance, climbing-style tags (bouldering, top rope, lead), one-tap
  directions in Apple or Google Maps.
- Rebuilt the whole app in Flutter (screens, login, navigation, theming) on the
  same Supabase backend and schema.
- Tech: TypeScript, React Native, Expo, Supabase, PostgreSQL, Flutter.
- Repo: https://github.com/JakeRecharte/BoulderBuddy. README is decent but
  **describes an earlier state** (AsyncStorage local persistence; Feed, Nearby
  Gyms and Profile marked "coming soon") that contradicts the CV's Supabase
  schema and shipped gym finder. Last push 2026-04-09. See §8.

**AI Trading Model, November 2025**
- Stock prediction pipeline pulling historical data from the Yahoo Finance API,
  then cleaning and preprocessing it for training.
- Random Forest Regression model ranks top stocks into an equal-weight
  portfolio of the top 5. **beat the market by 1.7% in backtesting**.
- Tech: Python, Pandas, NumPy, scikit-learn, yfinance.
- Repo: https://github.com/JakeRecharte/Trading-Model (1 star). README is
  short, has typos ("Yahoo Fiance", "selction", "incerease"), and admits the
  large universe is untested. It also says "Assignment for CS450". The CV
  doesn't. See §8.
- **Re-run 2026-10-13** by `scripts/export-trading-demo.py`, which reproduces
  the repo's pipeline exactly (same universe, features, 21-day horizon,
  time-ordered 80/20 split, `RandomForestRegressor(200, 8, random_state=42)`)
  against a fresh Yahoo Finance pull. 2,516 dates × 50 tickers → 121,600
  samples; 487 dates in the test set. Results, all verified:
  - strategy mean **3.94%** per horizon, universe mean **1.99%**, edge
    **1.95%**: **not the 1.7% the CV claims.** Same code, newer data. See §8.
  - test **R² 0.006**, MSE 0.0075. The edge is thin, and the picks beat the
    universe on **301 of 487** dates (62%).
  - the site states both numbers and says why they differ, rather than
    quietly using whichever is larger.

**Apple Picker, September 2026**
- **Not on the CV and has no README.** Everything here was read off the repo
  source on 2026-10-13; treat the repo as the source of record for this one.
- A Unity arcade game in C# (URP, TextMesh Pro UI): a tree drifts left and
  right overhead dropping apples, the player slides a stack of baskets with the
  mouse to catch them, a miss destroys one basket and clears the field, and
  running out of baskets reloads the scene.
- Six hand-written scripts: `Apple`, `ApplePicker`, `AppleTree`, `Basket`,
  `ScoreCounter`, `HighScore`. (The repo's large C#/ShaderLab line counts are
  mostly the vendored TextMesh Pro samples, not his code.)
- **The part that isn't in the standard build of this game** is the difficulty
  ramp in `AppleTree`: `treeSpeedRampRate` scales the tree's speed every frame
  and `gravityRampRate` adds downward gravity over time, so it gets harder the
  longer you last. That is the detail worth leading with.
- High score is a `static int`, so it survives a scene reload but not relaunch.
  **don't describe it as persistent.**
- Tech: Unity, C#, URP.
- Repo: https://github.com/JakeRecharte/Apple-Picker, no README. See §8.
- **Playable on the site since 2026-10-14**, as the real Unity project built
  to WebGL by `scripts/build-apple-picker.sh` into `public/demos/apple-picker/`.
  Source project: `~/Unity Projects/Apple Picker` (Unity 6000.5.11f1), which
  is outside this repo. Only the build output is committed.
- Read off the source while building it: the game is **mouse-driven**
  (`Input.mousePosition` in `Basket.Update`), so it cannot be played on a
  phone. The poster says so before the download starts.
- **`Physics.gravity` is never reset, see §8.** `AppleTree.Update` does
  `Physics.gravity += Vector3.down * gravityRampRate * Time.deltaTime`, and
  `Physics.gravity` is a global that survives `SceneManager.LoadScene`. In the
  editor, leaving play mode resets it; in a browser tab nothing does.
- Likely the 3D Game Design course listed as in progress (§2.2), but the repo
  doesn't say so and neither does the CV, so the site doesn't claim it. See §8.

**Avalanche NFT Project, 2022 – 2023**
- Co-founded and led a team of 8 to design, develop and launch an NFT
  collection on the Avalanche blockchain; oversaw smart contract deployment and
  community growth. **$12,000 in mint revenue.**
- Tech: Avalanche blockchain, Web3.
- Repo: none. High-school-era.
- **Off the site.** It went on as a placeholder on 2026-10-13 and came back off
  the same day at Jake's request. One line from the CV and no link wasn't
  worth a tile. Put it back when there's detail to put in it (§8).
- Standing caveat for when that happens: genuinely impressive for leadership
  and shipping, but crypto/NFT reads badly with a chunk of engineering
  recruiters, and the CV itself only puts it on the Base template.

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
  (ShaderLab + HLSL too). It is now on the site through that project's tech
  chips, which is the only way a tool should appear here, see the "no toolkit
  section" note in §3. Adding it to the CV is Jake's call (§8).
- **MapLibre** is not on the CV; it is the map library in the Clearline project's
  `web/` app (§2.4) and appears only as that project's chip, on the same rule.
  Next.js and Tailwind are in the same app and are not on the tile.
- **OpenBSD, BIND, OpenLDAP and OpenSSL** are not on the CV either; they are
  what the Homelab labs actually use (§2.4) and they appear only as that
  project's chips, on the same rule. `Linux/Unix` already covers the family in
  **Tools & Platforms**: these are the specific things, named on the row that
  used them. Worth adding to the CV alongside the UNIX course; Jake's call
  (§8.23).

### 2.6 Extracurriculars

- **ColorStack, Co-Vice President, July 2026 – Present.** Reestablishing
  SDSU's chapter; helped plan workshop events with 60+ attendees.
- **Sigma Phi Delta (engineering fraternity). Rush & Brotherhood Chairs.
  September 2025 – Present.** Ran a 3-week rush reaching ~500 students; planned
  events with 100+ attendees. *(Start corrected from the CV's November 2025 by
  Jake directly, 2026-10-13. Jake's word beats the CV here.)*
- **Sigma Phi Delta, Academic Chair, September 2025 – Present.** Bi-weekly
  study sessions over 4 months, 40+ brothers attending regularly.
- **AI Club, Member, January 2026 – Present.** Completed a semester-long
  work study with a partner company; starting a second with Bright Sky
  Recruiting. One semester-long group project done, a second in progress.
- **SDSU Rock Climbing Club. Member. September 2025 – Present.** Attends and
  helps set up events. (Not on any resume tab; it's the human-interest one and
  it explains BoulderBuddy, worth one line somewhere.)

### 2.7 Art

**Source of record: the image files**, the way §2.4 treats the Apple Picker
repo as its own source. Jake supplied the folder on 2026-10-14
(`iCloud Drive/Projects/Art/Jake finals/Better Items`), and said to use all of
it. Eight pieces, now in `public/art/`:

| Title (Jake's filename) | File | Pixels |
| --- | --- | --- |
| Garden | `garden.jpg` | 3024 × 4032 |
| Hell's Trip | `hells-trip.jpg` | 3024 × 4032 |
| Skulls | `skulls.jpg` | 2984 × 3824 |
| The Watcher | `the-watcher.jpg` | 2732 × 2048 |
| All Seeing | `all-seeing.png` | 2160 × 2160 |
| Cradled Fortress | `cradled-fortress.png` | 2160 × 2160 |
| Oni | `oni.png` | 2160 × 2160 |
| Moon | `moon.png` | 2732 × 2048 |

**One of them is also the profile picture.** *Cradled Fortress* is Jake's
pick for the header avatar, his call on 2026-10-14, and it replaced the `JR`
monogram (§8 Q10). The header reads the piece out of `art.ts` instead of
holding its own copy of the path, so the file, the dimensions and the `alt`
stay in one place; the alt is re-worded at that call site to say whose
illustration it is, since there it stands in for a photo of a person.

**What is verified:** the files exist, those are their real dimensions, and
those are Jake's own filenames with the underscores taken out. `Moon` arrived
as a 5.7 MB TIFF, which no browser renders, and was converted to a 362 KB PNG;
the other seven are byte-identical copies. The iCloud originals were not
touched. All four PNGs have an alpha channel but an opaque corner pixel. The
backgrounds are painted, not transparent, so nothing shows the fog through.

**What is read off the work, and flagged:** every `alt` string, written from
looking at each piece (§7 requires real alt text and there was no other
source), and `medium: "Digital illustration"` on all eight, uniform black
linework, flat fills, no paper or canvas texture. Both need Jake's confirmation
(§8 Q24).

**What is deliberately missing: the year on every piece.** The file dates are
*export* dates, and there is proof inside the folder. `Cradled_Fortress` and
`Oni` are dated June 2024 in `Better Items`, while the TIFF originals one
folder up are dated November 2023 and September 2023. A wall label with an
export date on it is wrong, so there is no wall label. `year` is optional in
`ArtPiece` and the caption line only renders when something fills it.

**Order is not chronological**, because the dates to sort by don't exist yet.
It is the export batches, newest first. Jake's call to re-rank.

Two things the files hint at and the site does **not** say: the plaque inside
*Skulls* reads "But What If?", which may be the real title, and the parent
folder contains a `Stickers.numbers`, which suggests some of these are sticker
designs. Both are in §8 Q24, neither is on the site.
---

## 3. What to actually put on the site

Derived from §2. This is a recommendation, not a fact. Jake can override any
of it.

**Three sections, not one.** The brief merge of projects and work was reversed
on 2026-10-13 at Jake's call: a recruiter reads "built this" and "was paid for
this" differently, and the merged list buried the top projects among jobs.

**Work leads.** Also Jake's call on 2026-10-13: page order is Hero →
`Experience` → projects, and that is the whole page. The paid and sponsored
work is the part a recruiter is scanning for, so it goes above the things he
built for himself. The numbered list below is grouped by kind, not by page
order.

**No Contact section.** Removed on 2026-10-13 at Jake's call. Email and
LinkedIn now live only in the nav bar's Contact modal, and the resume only in
its Resume pill, so **those two pills are the entire contact surface**. Don't
let a redesign treat them as optional chrome. The availability line is not lost
with the section: `site.bio` still carries "looking for a summer 2027
internship" in the header.

1. **`FeaturedProjects`**: the top three, as full-width cards stacked one per
   row: **CWG, Permit Paragons, BoulderBuddy**, in that order. The order is Jake's ranking and is *not*
   chronological; don't "fix" it. CWG leads because it's the most distinctive
   thing on the CV (published on PyPI, the only polished README).
2. **`AdditionalProjects`**: everything else, newest first: Lightning
   McShower, AI Trading Model. Thin at two rows; Avalanche NFT (§2.4) and this
   site itself are the two candidates to lengthen it, both still open in §8.
   It renders as a subsection under the featured cards, so its title is the
   small eyebrow `Additional projects`, not a display heading.
3. **`Experience`**: GradeFlow, NAVSEA/FathomWerx, Gold Coast Insurance.
   NAVSEA sits here, not in projects, per Jake: it was a program he attended,
   not a thing he built. The `PROGRAM` chip is what keeps that honest.

The board holds six tiles as of 2026-10-14, **newest first with one
exception** (§5), which is also the board's reading order and decides which
squares are filled: **Fool's Mate, Clearline, Lightning McShower, Apple Picker,
Homelab, AI Trading Model**. The exception is Fool's Mate and Clearline, swapped
on 2026-10-18 at Jake's request: Clearline is the newer one (Oct 2026 against a
Sep 2026 start), but Fool's Mate is still being built, and Jake wants the thing
in flight first. Six is two full rows with no filler at all. Homelab (added
2026-10-14 at Jake's request) took the seat the lone inert cell held. Apple
Picker and AI Trading Model swapped on 2026-10-14 at Jake's request. The
board had drifted out of the order §5 already specified. Lightning McShower
and Apple Picker are both September 2026; the CV's own order breaks that tie,
and Homelab sits below all three on an August start.

Clearline was the `UPCOMING` USC Dual Use placeholder until 2026-10-18, when the
event happened and the tile was filled in, and it held the first seat until Jake
swapped it with Fool's Mate the same day. That puts the one unfinished tile that
sits above finished ones first, which does the work of a board that opens with
what's in flight reading as current; Homelab is the other unfinished tile, lower
down on an August start. **The tile chip says what a thing is, never where it is
in its life**, `kind`, always, so a hackathon reads as `HACKATHON` and not as
`UPCOMING` (changed 2026-10-14 at Jake's request; it is the same axis rule §5
sets for the Now rail's badge). Nothing is lost, because `period` carries the
state in words ("Oct 2026", "Sep 2026 - Now"), and the dialog shows the `status`
chip beside the `kind` one. Fool's Mate is also the thinnest tile on the site,
and now the first one a visitor reads. If it stays contentless for long, it is
doing less work than the filler it displaced, and the seat it holds is the
costliest on the board.

Off the board, and why: **Avalanche NFT** (§2.4. One CV line and no link isn't
a tile; waiting on detail), the **Portfolio site** itself (its repo 404s (§4,
§8.1), so it was the one tile guaranteed to disappoint a click; it goes on the
moment the repo is public), and **CS460** and **Machine-Learning** (one is
empty, the other has no name yet).

Note the arithmetic: the board pads its last row with inert cells, so three
and six are the sizes that look deliberate and four or five always show
filler. It is at six now. A **seventh** tile (the Portfolio site is the one
waiting (§8.1)) costs two fillers again, so the next addition wants a
partner.

**The art page is a second route, not a section, and it is not in the nav.**
`/art` shipped 2026-10-14 at Jake's request. It is deliberately off the
homepage: the homepage answers "can he write code" (`TODO.md` §1) and a gallery
does not help that case, so it gets its own URL to hand to people who asked
about the art instead.

**The only route to it is the last row of the About modal** (`site.about.art`),
by Jake's call the same day. It went into the nav bar first and came straight
back out. The reasoning is the nav bar's job: Work, Projects, Contact and
Resume are what a recruiter is scanning for, and a fifth item called Art sets a
gallery at the same level as the work. Behind the About button it reads as
what it is. Part of who he is, found by someone who went looking. **The cost,
stated plainly:** the About trigger is a `<button>` (DESIGN.md §4, rule 3), so
with JavaScript off there is no link to `/art` anywhere on the site. The URL
still works for anyone handed it, which is what it is for.

It carries **eight real pieces** as of 2026-10-14 (§2.7), captioned with Jake's
own titles. What it does not carry is a year on any of them, an intro
paragraph, or a hero line that says anything. Those are §8 Q24.

**No toolkit section.** The standalone grid of languages and frameworks came off
on 2026-10-13: a tool named on the row that used it is evidence, and the same
tool floating in a grid is an assertion. The §2.5 skills list is still the
source for which chips are allowed to appear.

Extracurriculars have no section today. ColorStack Co-VP and the Sigma Phi
Delta chairs are real leadership signal. Either add a small section or fold the
strongest one into Experience, flagged in §8.

**Stats row. `2/3` HACKATHONS/PLACED, `8` PROJECTS/FINISHED, `1`
PUBLISHED/PACKAGE** (set 2026-10-14, replacing the project-scoped pair that
shipped a day earlier).

**The rule the hero now follows, in both the stats row and the tagline: a hero
claim has to span the career, not a project.** `82` PERCENT/ACCURACY and `330K` PARCELS/MAPPED were true, but each
was one project's metric doing summary duty, and both already appear on the
tile that earned them, evidence there, assertion here. It is the same
distinction that took the toolkit grid off the site (§3, "No toolkit section").
Don't put a single project's number back in this row.

The tagline took the same edit on 2026-10-14: it ended "an ML model at 82%
accuracy" and now ends "a hackathon car wired by hand" (§2.4. He owned the
car assembly and the camera and gas sensor wiring). The three examples are
descriptions rather than metrics, and they deliberately cover three different
kinds of building (tooling, an app with a backend, hardware), which three
software projects wouldn't.

| Value | Label | Sourced from | On the site? |
| --- | --- | --- | --- |
| `2/3` | HACKATHONS / PLACED | three entered, two placed (Permit Paragons 4th of 100+, Lightning McShower 1st in hardware and 4th of 200); Clearline finished top third without placing | **yes** |
| `8` | PROJECTS / FINISHED | Jake's count: 7 on 2026-10-14, 8 on 2026-10-18 | **yes** |
| `1` | PUBLISHED / PACKAGE | CWG on PyPI (§2.4) | **yes** |
| `8` | LANGUAGES / USED | §2.5 languages list | no, closer to an assertion |
| `82` | PERCENT / ACCURACY | GradeFlow ML model | no, project-scoped |
| `330K` | PARCELS / MAPPED | Permit Paragons | no, project-scoped |

Two of the three live ones need watching:

- **`2/3` has an expiry condition: the next hackathon.** It was `2/2` until
  2026-10-18, when Clearline became a third entry without a placement and Jake said
  to move it to `2/3` (§8.18, closed). Every hackathon after this changes the
  denominator, and the numerator if it places, so the stat is only true on the
  day it is edited. It is a fraction rather than a plain `2` because the
  fraction is the honest half: placing twice says less than placing twice out
  of three.
- **`8` is Jake's number, not arithmetic.** §2.4 lists the builds, but
  "finished" is genuinely ambiguous. CWG is published yet still ongoing,
  BoulderBuddy shipped but stale, and the board carries two tiles that aren't
  finished at all. He set it to 7 on 2026-10-14, and it went to 8 on 2026-10-18
  when Clearline was done: **the +1 is my reading of his question that day, not
  a count he gave me**, and it assumes Clearline wasn't already one of the
  seven (it was an upcoming placeholder then). Don't recompute it; ask him.

"Years coding" has no source. It was on the site until 2026-10-13 and is now
gone. Labels must be two words, ≤10 chars each (§5).

---

## 4. External-source audit (read 2026-10-13)

**GitHub, 6 public repos.** Joined 2025-07-11. Display name "Tendie".

| Repo | Lang | README | Note |
| --- | --- | --- | --- |
| `CWG-Coding_with_Git` | Python | **strong** | 6 stars, on PyPI, docs/ with LANGUAGE.md, CONTRIBUTING, GPL v3 |
| `BoulderBuddy` | TypeScript, PLpgSQL | ok but stale | describes AsyncStorage + "coming soon" features the CV says shipped |
| `Trading-Model` | Python | thin | typos; says "Assignment for CS450" |
| `Machine-Learning` | Jupyter | **none** | desc: "name will be updated when we have a team/project name" |
| `Apple-Picker` | C#, ShaderLab, HLSL | **none** | Unity; **on the site since 2026-10-13**, the only project whose copy comes from source, not the CV |
| `CS460` | n/a | **none** | empty; "Assignments for my SDSU CS460 Algorithms Class" |

**`github.com/JakeRecharte/Portfolio` returns 404**: it is private or doesn't
exist under that name. `projects.ts` linked there until 2026-10-13 and `TODO.md` lists
it as the repo URL. **That link is dead for every visitor.** Either make the
repo public or drop the self-referential project row.

**LinkedIn could not be read.** `linkedin.com/in/jake-recharte-8a3470377`
returns HTTP 999 to any unauthenticated fetch. That's LinkedIn's
anti-scraping, not a broken link, and no tool available here can get past it.
The one fact taken from the URL is the correct vanity path (§2.1). If anything
on LinkedIn isn't already in the CV, Jake needs to paste it (§8).

---

## 5. Shape and length constraints

The layout is tight. These are the limits the design actually holds at.

**Display headings** (`SectionHeading`, `site.headline`), exactly two strings,
uppercase, rendered up to `text-8xl` with `tracking-tighter`. Each line
**≤ 10 characters**; longer wraps and breaks the two-line effect. The second
line renders at 20% opacity, so the pair must read as one phrase
(`RECENT`/`PROJECTS`), never as two sentences.

`site.headline` is `ACTUALLY`/`FINISHED` as of 2026-10-13. It replaced
`COMPUTER`/`SCIENCE`, which spent the largest type on the page restating what a
page full of code already proves. A hero heading has to earn that size: say
something a reader couldn't have assumed.

**`site.stats`**: exactly 3 entries. `value` 1–4 characters (`82`, `330K`),
`label` a tuple of exactly two words on separate lines, each **≤ 10 chars**.
Every stat must be literally true and traceable to §2.

**`NowEntry`**: exactly 4 entries, newest start date first. `org` ≤ 18 chars
and `title` ≤ 26 chars; past that the row wraps to two lines on a laptop.
`period` carries **all** the time information: `Sep 2025 - Now` for anything
ongoing, a closed span (`Feb - Jul 2026`) for anything finished. `badge` carries
**only** what the thing is (`CLUB`, `INTERNSHIP` or `PROGRAM`), and never when
it was; mixing the two axes is what made the old `NOW`/`INTERN` pair read
wrong. Every entry must also exist in §2.3 or §2.6.

**`site.tagline`**: 1–2 sentences, ~150–220 chars, sits under the hero at
`max-w-xl`.

**`site.bio`**: 1–2 sentences, ~120–180 chars. Sits in the sticky card;
longer makes the card taller than the viewport on laptops and breaks the sticky
behaviour.

**`Project`**: two exported arrays, same type.

- `featuredProjects` is **exactly 3**, in Jake's ranked order (not
  chronological). Three is the grid; a fourth breaks `lg:grid-cols-3` into an
  orphan row and stops the set reading as a shortlist.
- `otherProjects` is **2–6**, newest first, except that Fool's Mate (in
  progress) leads Clearline at Jake's call (§3). The board pads its last row, so
  **3 and 6 are the only counts with no inert filler**: it has been at 6
  since Homelab went on (2026-10-14). Past 6 is untested: nine would be three
  clean rows, but a board that long stops reading as the footnote to the
  featured three.
- `slug` kebab-case and stable (it becomes the Phase 4 deep-link URL).
- `title` ≤ 30 chars. In a featured card it sits at `text-xl` with no `sm:`
  step up; now that cards are full width a 30-char title fits on one line there,
  so the limit is about the board's squares, where it still wraps.
- `kind` is `PROJECT` or `HACKATHON`. `HACKATHON` means a weekend build judged
  against other teams (Lightning McShower, Permit Paragons, Clearline). The chip says it,
  so the blurb must not repeat the word.
- `period` a month (`Sep 2026`), a span, or `May 2026 - Now` while it's
  running. Time lives here, never in `kind`.
- `blurb` 1–2 sentences, ~120–200 chars. The featured cards stack one per row
  and cap their prose at `max-w-lg`, so ~200 chars is about four lines in a
  card. Past that the card stops being scannable, which is the whole point of
  a featured card.
- `tech` 2–4 chips of ≤ 14 chars, from the §2.5 skills list. Featured cards cap
  at **3**. A full-width card has room for a fourth now that they stack, but the
  cap stays: three is what the board tiles carry, and the featured set should
  not read as a denser version of the same list.
- `devpostUrl` optional, and only for a hackathon. It is its own field rather
  than a second `liveUrl` because a Devpost page is not the thing running.
  It is the judged submission, with the demo video and the team. It **outranks
  `repoUrl`** for the tile's click and leads the dialog's link list, labelled
  "Read the Devpost": for a weekend build that page sells the work better than
  the source does.
- `repoUrl` / `liveUrl` optional. The row or card links to `liveUrl ??
  devpostUrl ?? repoUrl`; with neither it renders with **no arrow**, which is
  honest for the placeholders that have nothing to show yet, Fool's Mate (in
  progress) and Homelab (in progress, no repo). Every finished project now has
  a destination (§8.3), so a linkless *finished* one is a bug, not a style.
- `detail` **2–3 paragraphs**, each ~150–300 chars, on every board project.
  This is what the dialog is *for* now that the tile carries the blurb and the
  tech chips: paragraph one says what the thing does, two says what Jake built
  and with whom, three carries the number and its caveat. Don't restate the
  blurb. A visitor has already read it on the tile.
- `demo` optional, and only where something really runs. `label` ≤ 40 chars,
  naming what is executing rather than the project again ("The forest, running
  in your browser"). `guide` **2–4 steps**, ~120–220 chars each, each one
  action to take or one thing to notice, not a feature list. `note` is the
  caveat a visitor deserves before reading the output as a claim, ~1–2
  sentences; for anything with money or health in it, that note is mandatory.

**`Role`**: **2–4 items**, newest first, in `experience.ts`.

- `org` ≤ 30 chars, `title` ≤ 40 (renders in accent under the org).
- `kind` is `INTERNSHIP`, `PROGRAM` or `JOB`. This chip is load-bearing:
  NAVSEA/FathomWerx was an eight-week program, and §2.3 is explicit that the
  copy must not imply engineering employment.
- `period` a span (`Feb - Jul 2026`) or a year range (`2021 - 2023`).
- `bullets` **2–3 items**, each ~80–140 chars, outcomes not duties, with the
  number wherever §2.3 has one.
- `tech` optional, same rules as a project's. The NAVSEA program has none
  worth naming and omits it.

**`art`** (`art.ts`), the `/art` page's own hero copy, same rules as the
homepage's because it renders at the same size.

- `headline` exactly two strings, uppercase, each **≤ 10 chars** (§5's display
  rule). It is `ART`/`PORTFOLIO` today, which restates the nav link that got
  the visitor there, a placeholder, not a decision.
- `intro` 1–2 sentences, ~150–220 chars, at `max-w-xl`, the tagline's slot.

**`ArtPiece`**: `artPieces`. **No count constraint**, unlike the project
arrays: masonry has no row to leave half-empty, so 4 pieces and 40 both look
deliberate. Eight are in there now. Order is the export batches, newest first,
and is **not** chronological. There are no creation dates to sort by (§2.7).

- `slug` kebab-case and stable; it is the React key and a future deep link.
- `title` ≤ 40 chars. It sits under the piece at `text-sm` in a column about
  a third of the page wide, and wraps to two lines past that.
- `year` **optional**, a year (`2026`) or a span (`2025 - 2026`), mono like
  every date. Unset on all eight pieces today, and §2.7 says why.
- `medium` **optional**. What it is made of, ≤ 24 chars. It shares one
  caption line with `year`, and **the line renders only if one of the two
  exists**, so a piece with neither shows its title alone rather than an empty
  mono row.
- `src` a path under `public/` (`"/art/foo.jpg"`), or `null` while the piece
  has no file, which draws the placeholder frame instead of a broken image.
- `width` / `height` the file's **real** pixel dimensions, read off the file
  (`sips -g pixelWidth -g pixelHeight <file>`), never guessed, `next/image`
  reserves space from them and a wrong ratio makes the image jump on load.
- `alt` real alt text describing the picture, for someone who cannot see it,
  not `"artwork"` and not the title again (§7).

---

## 6. Voice

Short declarative sentences. Concrete over impressive. No exclamation marks, no
"passionate", "leverage", "cutting-edge", "journey", "I'm a developer who
loves...". Say what the thing does and what he built.

Write as Jake, first person, but sparing with "I": hero and section copy
mostly drop the pronoun. Student-honest: a class project can be called a class
project; a hackathon build can be called a weekend. Never imply professional
experience that doesn't exist, and never upgrade a team result into a solo one.
The CV is careful about "on a team of 5", so the site must be too.

Numbers carry the copy. Where §2 has one (82%, 330,000+, 1st of 200, $12,000,
1.7%), use it. Where it doesn't, don't reach for an adjective instead.

**No em dashes, anywhere** (Jake, 2026-10-15). They were used throughout the
copy until then and were swept out of every file in the project. Use a comma, a
colon, parentheses or a second sentence instead, and don't reintroduce one in
new copy or in a code comment.

**Casual, not formal** (Jake, 2026-10-15). Contractions are good: "it's",
"isn't", "there's", "you'll". Prefer the plain word over the stiff one and
write the way Jake would say it out loud. This sits on top of the rules above,
not against them: still short, still concrete, still no exclamation marks and
no "passionate". Casual means unbuttoned, not padded.

American spelling.

---

## 7. Accessibility and technical constraints on copy

- Body text sits at `text-white/55`–`/65` on a near-black canvas. Don't drop
  copy below `/55`. `TODO.md` §1 commits to 4.5:1 contrast.
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

## 8. Open asks: Jake, this is the list

The CV and transcript closed most of the original questions. These are what's
left, roughly in order of how much they block.

**Broken or wrong right now**
1. ~~`github.com/JakeRecharte/Portfolio` 404s.~~ **Resolved 2026-10-14**. The
   repo is public. The Portfolio tile can go back on the board whenever you
   want, but Homelab took the seat that would have made it exact. The board
   is at **six** now, which is two clean rows; a seventh tile brings two inert
   fillers back, and it takes a **ninth** to be clean again.
2. ~~Resume PDF → 404s.~~ Fixed 2026-10-13: `public/resume.pdf` is a copy of
   `~/Downloads/Jake Recharte Resume.pdf` (modified Oct 6 2026), and the
   nav bar's Resume pill now opens it in a modal viewer instead of navigating
   (it was the Contact row too, until that section came off). Two
   things to confirm: is that the tab you want public, and **that PDF prints
   your phone number**, which Q9 and §2.1 say to keep off the site. A
   phone-free export would settle it.
3. ~~Are there repos for **Lightning McShower** and **Permit Paragons**?~~
   **Closed 2026-10-14**: Jake supplied a Devpost page and Ethan Niu's repo for
   Lightning McShower, and Brandon Garate's repo for Permit Paragons (§4). Both
   are live. Every finished project now has a destination; the only linkless
   tiles left are the two placeholders, which have nothing to link to yet. One
   thing worth knowing: the Permit Paragons repo's README is whatever the team
   left it as. Say the word and I'll read it and tell you what a recruiter
   lands on, the way Q4 and Q5 flag BoulderBuddy's and Trading-Model's.
4. **BoulderBuddy's README contradicts the CV**: it still says AsyncStorage
   and lists Nearby Gyms / Feed / Profile as "coming soon", and nothing's been
   pushed since April. The CV says Supabase, the gym finder, and a Flutter
   rebuild. Is that work in a private repo or a branch? A recruiter clicking
   the row lands on the stale version.
5. `Trading-Model`'s README has typos and says "Assignment for CS450" while the
   CV presents it as a project. Want me to rewrite that README?

13. **The trading model's headline number has moved: 1.7% → 1.95%.** Re-running
    your own pipeline on a fresh Yahoo pull gives a 1.95% edge, not the 1.7%
    on the CV (§2.4). Nothing is wrong with either (Yahoo revises history and
    `yfinance` has changed since November 2025), but the CV, the tile blurb
    and the live demo can't all say different things forever. Right now the
    blurb keeps **1.7%** (it is what your CV says) and the dialog explains the
    **1.95%** re-run beside it. Options: leave it, move everything to 1.95%
    and update the CV, or drop the single number and let the demo be the
    claim. Related: the test **R² is 0.006**, which the dialog also states.
    Tell me if you'd rather that came off, though I'd keep it.

14. **Apple Picker's gravity never resets between rounds, and the live demo
    makes that visible.** `AppleTree.Update` adds to `Physics.gravity` every
    frame, but `Physics.gravity` is a global that `SceneManager.LoadScene`
    does not restore. Leaving play mode resets it in the editor, which is why
    it has never shown up, in a browser tab nothing does. At
    `gravityRampRate = 0.2`, a one-minute round leaves gravity at about -22
    against a default of -9.81, so round two starts twice as fast and round
    four is unplayable. The demo ships as-is because the first playthrough is
    the honest one and it is your game, not mine to change. The fix is one
    line in `ApplePicker.Start()` (`Physics.gravity = new Vector3(0, -9.81f,
    0);`), and I'd take it: a visitor who dies once and retries is the common
    case, and right now that visitor gets a broken game. Say the word.

15. **Two real gaps in `cwg` itself, found by building the demo.** Both are
    package bugs, not site problems, and both have a fix worth upstreaming:
    - **`.cwg` files can't express revert, tags or cherry-pick.**
      `CWGRunner.load` handles five verbs and silently ignores the rest, so a
      `.cwg` file can't do exception handling or functions. A third of the
      language. The demo needed those two examples, so it ships its own
      parser (`public/demos/cwg/cwg_trace.py`, `Builder`) that handles all
      eight verbs and feeds the same `CommitNode` graph to your unmodified
      interpreter. That class is a PR to `cwg` more or less as written.
    - **`import cwg` calls `sys.exit(1)` when git is missing.**
      `gpScraper.py` exits the process on a failed `from git import …`. A
      library should raise, not kill its host, and the import only needs to
      succeed for the scraper, which `.cwg` files never use. Making it lazy
      (import `git` inside `scrape()`) would let `cwg` run anywhere Python
      runs, which is exactly what the browser demo needed and what it had to
      stub around.

16. **Your CV undersells Permit Paragons and gets the geography wrong.** It
    says "330,000+ parcels in San Diego County". The repo's data README says
    **393,755 parcels, City of San Diego**: the county holds 1,088,722, and
    the team deliberately excluded the rest because city permit data doesn't
    cover unincorporated county. The real number is bigger *and* more precise
    than the one you are claiming. The site now says 393,755 City of San
    Diego; the CV should too.
17. **The Permit Paragons demo still leans on someone else's AWS, though
    less than it did.** The frontend is now built and served from this repo,
    so the app itself survives. What does not: the parcel tiles and the
    parcel API, both on `d1xtsrdl1l82x1.cloudfront.net`. If Brandon tears
    that down, the map loads its interface and draws no parcels. Options, in
    order of effort: ask him to keep the tiles bucket up, copy the 77MB
    PMTiles archive into this repo (it is the single biggest thing on the
    site if you do, and the API would still be gone), or accept it. Worth
    re-checking before any application round, because nothing will tell you.

**Decisions only you can make**
6. **Avalanche NFT ($12k, team of 8), on the site or not?** Real leadership
   signal; crypto also turns off some engineering recruiters. Your call.
7. **Extracurriculars**: ColorStack Co-VP and the Sigma Phi Delta chairs are
   strong. Own section, folded into Experience, or left off?
8. **What are you targeting?** The site currently says "summer 2027
   internship" in two places. Confirm, summer 2027, new grad 2028, or both?
9. Phone number: CV has it, the site's copy doesn't, but the resume PDF
   served at `/resume.pdf` does, so it is public now. Keep it off? (Recommended.
   Email plus LinkedIn is enough, and a scraped phone number invites spam.
   Acting on it means re-exporting the PDF without the number.)
10. ~~Photo for the profile card, or keep the `JR` monogram?~~
    → **Closed 2026-10-14.** Neither. You said to use *Cradled Fortress*, so
    the header now carries your own art where the monogram was. It is the same
    file `/art` serves, read from `art.ts` so a corrected caption or a
    re-export only has to happen once (§2.7). The `alt` text names it as your
    illustration rather than describing you, which is the one thing a
    screen-reader user would otherwise get wrong about it. Still open if you
    want it: a photo of you somewhere on the page is a separate question, and
    nothing on the site needs one.
11. GPA: §2.2 recommends leaving it off. Confirm or override.
12. Three or four sentences in your own words about what you're into
    technically, I'll cut them to length, not add to them. Still open: the
    bio, the tagline and the `ACTUALLY`/`FINISHED` hero line are my wording,
    not your voice. The *facts* in the tagline are yours (§2.4); the phrasing
    isn't.
    → **Closed 2026-10-14.** You sent the draft; it is in §2.7 and live in
    the header's **About** modal as two sections, *The code* and *Outside the
    code*, plus a row through to `/art`. It was cut, not extended. The only
    words in there that aren't yours are joins. The bio, the tagline and the
    `ACTUALLY`/`FINISHED` hero line are **still mine**, and now that the About
    copy exists in your voice, the tagline is the next one worth rewriting
    from it.

**Nice to have**
12a. The header's contribution graph shows the **last 6 months**. 229 real
    contributions since Apr 2026. (The full year is 274, so the recent window
    is the denser, better-looking half.) Change `MONTHS_SHOWN` in
    `ContributionGraph.tsx` to widen it; the JSON always holds a full year, so
    no re-fetch is needed. Say the word if you'd rather it came off entirely.
13. Screenshots or screen recordings for any of the five projects (`TODO.md`
    Phase 3 has a media task open). The hackathon car and the parcel map are
    the two most visual.
14. **Apple Picker needs a README**: it's on the site now and it's the only
    tile that sends a recruiter to a repo with no explanation at all. I can
    write one from the source in a few minutes; say the word. Two things only
    you know: is it for the 3D Game Design course (the site doesn't claim it
    either way), and is there anything beyond the difficulty ramp that's yours
    rather than the standard build of this game?
15. **Avalanche is parked, not dropped.** To put it back: a link (collection
    page, explorer, anything that still resolves), whether the contracts are
    anywhere public, and one sentence on what *you* built versus what the team
    of 8 did. The board is at six (two clean rows), so adding
    Avalanche alone leaves two inert fillers and adding it **with** the
    Portfolio tile (§8.1) leaves one. It takes three more to be clean at
    nine, which is a longer board than this section probably wants.
16. ~~**Clearline (USC Dual Use): result, team, role, Devpost.**~~ **Mostly
    closed 2026-10-18.** The README answered whether it was the Oct 16–18 event,
    and Jake supplied the rest: top third of the field with no placement, a team
    of 4, what he built (the officer page, the board, and parts of Supabase wired
    into the front end), the Devpost URL, and that the name is Clearline, not
    Line. All of it is folded into §2.4 and live on the tile. One thing is still
    open: **should the teammates be named?** The copy says "teammates" and "a
    team of 4" and no one by name. Names are yours to give. Adriancluna is the
    only other author in the log, and crediting teammates with the voice agent
    and the phone line is read off that log.
17. **Fool's Mate needs everything.** Right now the site says "a 2D game,
    started in September" because that is all I have. Most useful: what the
    game is, engine and stack, whether it's chess-related at all, whether
    there's a repo (public or to-be), and whether anyone else is on it.
18. ~~**`2/2` HACKATHONS PLACED needs your answer today.**~~ **Closed
    2026-10-18.** Clearline finished in the top third without placing, so Jake said to
    make it `2/3`, and it is (§3). It goes stale again at the next hackathon.
    Still open from the old question: any hackathon you've been to that the CV
    doesn't list, which would change both numbers.
19. Your GitHub display name is "Tendie" and your bio is one line. Recruiters
    click through from this site. Want it tidied?
20. Anything on LinkedIn that isn't in the CV? I can't read it (§4), so paste
    anything that matters.
21. Domain decision (`TODO.md` §3 and §7).
22. Anything you'd rather the site *not* say.
25. **Is the high school Rancho Campana?** Your draft wrote "ranch Campana"
    and the About copy says *Rancho Campana, a STEM academy high school*. The
    one in Camarillo. Correct it if that is the wrong name, and tell me if you
    would rather it were not named at all. Related and smaller: the draft said
    "numerous coding and engineering classes" there; the copy keeps only the
    *first* coding class, because that is the sentence with a story in it.
26. **The architecture line is doing a lot of work.** "What made choosing
    between computer science and architecture hard" is the most interesting
    sentence in the About, and right now it goes nowhere. The art portfolio
    sits under it as a bare link. If any of that drawing *is* architectural,
    say so and the two halves connect.
23. **Homelab. I wrote it from your lab PDFs, so check it.** You asked for
    the tile on 2026-10-14 and gave me `lab0.pdf`, `lab1.pdf` and `lab1b.pdf`;
    everything the tile and its dialog say is read off those three (§2.4), so
    the site currently describes an OpenBSD VM serving DNS, a P-384 root CA
    and an LDAP directory, and says outright that it isn't finished. Four
    things only you know: **(a)** how far past lab 1b you actually are. If
    FreeBSD, AlmaLinux or the rest of the network are standing, the copy is
    behind and I'll widen it; **(b)** whether any of it is in a repo
    (dotfiles, zone files, the `srcpatch`-style scripts). Right now it is the
    only *non-placeholder* tile on the board with nothing to click, which the
    board allows but which I'd rather fix; **(c)** whether you want it named
    as the CS 470 course on the site, or kept as "a semester of Unix
    sysadmin" the way it reads now; and **(d)** whether OpenBSD, BIND,
    OpenLDAP and OpenSSL should go on the CV's Tools line (§2.5). They are
    real and they are not on it.

24. **`/art` has your eight pieces on it. Now it needs their labels.** You
    pointed me at `Better Items` on 2026-10-14 and I used all eight (§2.7).
    They are live, optimized and captioned with their titles. What is still
    missing is everything a wall label carries:
    - **(a) Years.** Not on the site, on purpose: the file dates are export
      dates, and your own folder proves it. `Cradled_Fortress` and `Oni` are
      June 2024 in `Better Items`, but the TIFF originals one folder up are
      November 2023 and September 2023. Give me eight years and they go in;
      the caption line is already wired to appear when they do.
    - **(b) Medium.** I put "Digital illustration" on all eight, read off the
      work, uniform black linework, flat fills, no paper or canvas texture.
      Correct me if any of them is a print, a sticker run, or inked by hand
      first. (The parent folder has a `Stickers.numbers` in it, which is why
      I'm asking.)
    - **(c) Titles, confirm, especially two.** They are your filenames with
      the underscores removed. *Hell's Trip* is `Hells_trip` plus an
      apostrophe I added. And the brass plaque inside *Skulls* reads **"But
      What If?"**, which looks a lot more like the real title than "Skulls"
      does.
    - **(d) The order.** It is the export batches, newest first, because there
      are no dates to sort by. If you want a strongest-first order instead,
      give me the ranking. Masonry has no row to leave half-empty, so any
      order works.
    - **(e) Check my alt text.** Eight descriptions written from looking at
      the pieces. They are what a screen reader announces, and I may have
      called something by the wrong name.
    - **(f) Two sentences for the intro, and a hero line.** The intro slot is
      `null` right now and renders nothing, which is better than filler over
      real work. The heading reads `ART`/`PORTFOLIO`, which just repeats the
      link you clicked. §2.5 says a heading that size has to beat that. Two
      lines, ≤ 10 characters each.
    - **(g) Should a piece be clickable?** A piece is not a link today, which
      is why it carries no arrow. If you want full-size views, the project
      board's tile→dialog pattern already exists and would be a lightbox for
      roughly nothing.
    - **(h) Is eight the set?** `Jake finals` has nine more outside
      `Better Items` (`Frothey`, `Fuck It`, `Pierced Failure`, `Shroomports`,
      `Silenced`, `The Jester's Blade`, `Untitled_2`, an `IMG_0266.HEIC`, and
      TIFF originals of two that are already up). I used only what you
      pointed at.

27. **The Clearline demo leans on three things outside this repo, all of which fail
    soft.** DEMO.md §2.2 wants level 4 and 5 dependencies named with an owner:
    - **OpenFreeMap** (`tiles.openfreemap.org`) serves the basemap tiles and map
      glyphs. A free public service, keyless, owned by its maintainers. If it
      goes away or starts gating tiles, as CARTO did (§2.4, Permit Paragons), the
      board keeps its perimeter, its houses and its fire on a blank basemap.
      Permit Paragons' basemap comes from the same place. About 1.7MB of the
      demo's roughly 3MB is these tiles.
    - **Google Fonts** serves the board's two typefaces (Libre Caslon Display and
      Geist Mono). If it's unreachable the board falls back to Georgia and the
      system mono, and nothing else changes.
    - **`usc-dual-hacks.vercel.app`** is the tile's `liveUrl` ("View it live"),
      and it's yours. **Kept on, at Jake's call 2026-10-18:** it's hosted live and
      the phone line technically works. It dies if that Vercel project is
      deleted. Its sign-in screen prints the demo shift codes because the README
      says so, for judges; the README's `HIDE_DEMO_CODES=1` turns that off, and if
      you do, a recruiter who clicks the link lands on a code prompt with no
      code. Worth re-checking before an application round, like §8.17.

---

## 9. Workflow for a content change

1. Confirm the fact is in §2, or that Jake just supplied it.
2. Edit the `src/content/*.ts` file. Remove the `TODO:` comment above anything
   you've made real.
3. If a field is still unknown, leave it obviously fake (`Project Two`) rather
   than subtly fake. Placeholders must be recognisable at a glance.
4. Run `npm run typecheck && npm run lint && npm run format`.
5. Tick the matching box in `TODO.md` §2 / §5 and add a line to its Log.
6. When an answer to §8 arrives, fold the fact into §2 and strike the question
   in the same commit. This file is only useful if it stays accurate about
   what's still unknown.
