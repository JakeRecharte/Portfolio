/**
 * Projects, split two ways on purpose.
 *
 * `featuredProjects` is the top three, in the order Jake ranked them, not
 * chronological. They render as cards, because three things given room read as
 * a claim; the same three in a row list read as inventory.
 *
 * `otherProjects` is the board underneath: a checkerboard of squares, in the
 * order Jake placed them, for everything that's real but isn't the pitch.
 * Array order is the board's reading order and also drives the checker fill
 * (`i % 2` in ProjectBoard), so reordering changes which tiles are filled.
 *
 * Every fact traces to CONTENT.md §2.4, except `apple-picker`, which is read
 * off the repo itself because there is no README and the CV omits it. Links
 * are audited in §4. A project with no public repo still gets a tile, and its
 * dialog says so rather than offering a dead link.
 */

/**
 * A runnable demo, keyed to a component in
 * [demos/ProjectDemo](../components/demos/ProjectDemo.tsx). Adding a key here
 * means adding a case there; the dialog renders the demo pane only for a
 * project that has one.
 */
export type DemoKey =
  "ai-trading-model" | "apple-picker" | "cwg" | "permit-paragons";

export type ProjectDemo = {
  key: DemoKey;
  /** Eyebrow over the demo pane. Says what the thing running actually is. */
  label: string;
  /** How to drive it. 2–4 steps, each one action or one thing to notice. */
  guide: string[];
  /** The caveat a visitor deserves before reading the output as a claim. */
  note?: string;
  /**
   * Take the dialog's full width instead of two of its three columns, with
   * the write-up below rather than beside. For a demo that is mostly a map
   * or a canvas, a third of the dialog spent on prose is the wrong trade.
   */
  wide?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  /** `HACKATHON` is a weekend build judged against other teams. */
  kind: "PROJECT" | "HACKATHON";
  /**
   * Where the thing is in its life, when that isn't "finished". `period` still
   * carries the time (`Sep 2026 - Now`, `Upcoming`); this is the chip that
   * says it outright, so an unbuilt thing can never read as a claim. Omit it
   * for anything shipped.
   */
  status?: "UPCOMING" | "IN PROGRESS";
  period: string;
  blurb: string;
  /**
   * The write-up the dialog carries: 2–3 paragraphs that say what the thing
   * does, what Jake built, and the number. The tile shows `blurb`; this is
   * what a visitor came into the dialog for (CONTENT.md §5).
   */
  detail?: string[];
  tech?: string[];
  repoUrl?: string;
  liveUrl?: string;
  /**
   * The project's Devpost page. Its own field rather than `liveUrl` because a
   * Devpost write-up is not the thing running: it is the judged submission,
   * with the demo video and the team on it. For a hackathon that is the
   * richest destination, so it outranks `repoUrl` for the tile's click.
   */
  devpostUrl?: string;
  demo?: ProjectDemo;
};

export const featuredProjects: Project[] = [
  {
    slug: "cwg-coding-with-git",
    title: "CWG: Coding With Git",
    kind: "PROJECT",
    period: "May 2026 - Now",
    blurb:
      "A language where the git commit graph is the source code: branches are control flow, commits are statements, tags define functions. Tree-walking interpreter, published on PyPI.",
    detail: [
      "A programming language whose source code is a git repository. Commits on main are Python statements run oldest first; a branch is a block, and its prefix is the keyword: if/, else/, while/, for/, fn/. The merge commit decides which variables come back out, and git revert is exception handling.",
      "The interpreter scrapes the repo with GitPython, builds an execution tree of if/while/for/fn nodes from the commit DAG, and walks it. Nothing runs as commits are written: the whole history is read first, then executed in one pass.",
      "Published on PyPI as cwg, v0.2.0, Python 3.10 and up. Run pip install cwg, then point cwg run at a .cwg file, a local repo, or a GitHub URL.",
    ],
    tech: ["Python", "GitPython", "Git"],
    repoUrl: "https://github.com/JakeRecharte/CWG-Coding_with_Git",
    liveUrl: "https://pypi.org/project/cwg/",
    demo: {
      key: "cwg",
      label: "CWG, running in your browser",
      guide: [
        "Pick a program. The six are ordered so each one adds a single idea, and together they are the whole language: statements, if/else, while, for, revert, functions.",
        "Press play. The highlighted row is the commit being executed; scope and output below it are what that commit did. Watch a merge promote a variable back to main, which is the rule that makes branches usable.",
        "Switch to \u201cAs Python\u201d to see the same program written the ordinary way, with the matching line highlighted as it steps. The revert example is the one worth looking at: it becomes try/except.",
        "Drag a value and the program re-runs for real. On the revert example, x = 0 makes the division raise and the handler fire; any other x and the handler is skipped entirely.",
      ],
      note: "This isn't a recording. Pyodide loads CPython as WebAssembly and installs the real cwg package from PyPI, so the interpreter running here is the one you'd get on your own machine after pip install cwg. The browser has no git binary, so programs get handed to it in CWG's own .cwg form, which is just a list of git commands, rather than as a cloned repository.",
    },
  },
  {
    slug: "permit-paragons",
    title: "Permit Paragons",
    kind: "HACKATHON",
    period: "Aug 2026",
    blurb:
      "Permit prediction to shorten low-income housing timelines, on a team of 6. I built the front-end map of 393,755 San Diego parcels. 4th of 100+ participants.",
    detail: [
      "San Diego zoning already permits homes on hundreds of thousands of parcels where nothing has been built. The app maps that unbuilt capacity, predicts how long the city takes to issue a permit on each parcel, and shows that the wait isn't spread evenly.",
      "I built the front end: real parcel geometry and vector tiles for all 393,755 City of San Diego parcels, the budget and timeframe filters that run client-side against attributes baked into the tiles so moving a slider costs no network request, pricing by project archetype, and locking the zoom and pan range to San Diego.",
      "On a team of 6, 4th of 100+ at the Data Science Alliance Building for Good hackathon. The model behind it is a RandomSurvivalForest, chosen because 29% of permits in the data haven't been issued yet, and a plain regressor trained only on issued permits fits the fast half and under-predicts the rest.",
    ],
    tech: ["TypeScript", "Python", "Docker"],
    repoUrl: "https://github.com/BrandonGarate177/BFFG-SD-HACKS",
    liveUrl: "https://d1xtsrdl1l82x1.cloudfront.net",
    demo: {
      key: "permit-paragons",
      label: "The live application",
      wide: true,
      guide: [
        "Every shaded parcel is one where zoning already allows homes that haven't been built. Darker means more unbuilt capacity.",
        "Move the budget and timeframe sliders. Filtering runs in your browser against attributes baked into the vector tiles, so nothing is re-fetched. That's the part I built.",
        "Click a parcel for its dashboard: capacity broken into competing entitlement paths, predicted permit timing for four project sizes, and fees.",
      ],
      note: "A team of 6 built this. The frame runs their own frontend as it stood at the end of the hackathon, built from the commit before the team restyled it in October. The parcel geometry and the predictions still come from their servers. By-right capacity means zoning permits the units without discretionary review; no approval has been granted for any specific project on any of these parcels.",
    },
  },
  {
    slug: "boulderbuddy",
    title: "BoulderBuddy",
    kind: "PROJECT",
    period: "Mar 2026 - Now",
    blurb:
      "Cross-platform app for climbers: log routes by gym, V-grade and photo, then find nearby gyms by GPS and Haversine distance. Rebuilt in Flutter on the same Supabase backend.",
    tech: ["Flutter", "React Native", "Supabase"],
    repoUrl: "https://github.com/JakeRecharte/BoulderBuddy",
  },
];

export const otherProjects: Project[] = [
  {
    // PLACEHOLDER: it hasn't happened. Jake said he's going; that is the
    // whole verified fact. A public recruitment page describes a 48-hour,
    // 200+ builder event on Oct 16-18 2026 with the problem statement held
    // back until the Friday, but that is third-party and unconfirmed, so none
    // of it is on the site. Confirm before any of it goes in the copy.
    slug: "usc-dual-use",
    title: "USC Dual Use",
    kind: "HACKATHON",
    status: "UPCOMING",
    period: "Upcoming",
    blurb:
      "A dual-use hackathon at USC. This one hasn't happened yet, so whatever gets built lands here afterwards.",
    detail: [
      "A dual-use hackathon at USC, coming up. Nothing's been built yet, so there's nothing here to judge.",
      "This tile is here so the board reads as current rather than complete. It gets the write-up, the stack and the result once there is one.",
    ],
  },
  {
    // PLACEHOLDER: "a 2D game I'm developing, started last month" is all
    // that's verified (Jake, 2026-10-14). No repo is public under this name.
    // Genre, engine, stack and what the game actually is: all open (§8).
    slug: "fools-mate",
    title: "Fool's Mate",
    kind: "PROJECT",
    status: "IN PROGRESS",
    period: "Sep 2026 - Now",
    blurb:
      "A 2D game, started in September and still being built. More here once there's something to play.",
    detail: [
      "A 2D game, in the works since September 2026.",
      "Too early for a write-up, so this tile is a marker, not a claim. It gets the real description, the stack and a way to play it once those exist.",
    ],
  },
  {
    slug: "lightning-mcshower",
    title: "Lightning McShower",
    kind: "HACKATHON",
    period: "Sep 2026",
    blurb:
      "On a team of 5: a remote-controlled car that rates the hygiene of whoever stands in front of it, from a vision model and a gas sensor. I built the hardware. 1st in hardware, 4th of 200.",
    detail: [
      "A remote-controlled car that rates the hygiene of whoever stands in front of it. A vision model watches through the camera, a gas sensor reads the air, and the two together produce the verdict.",
      "On a team of 5, I owned the hardware (car assembly, camera and gas sensor wiring) and the overall project scope.",
      "Judged 1st in hardware and 4th overall out of 200 competitors.",
    ],
    tech: ["Arduino", "C++", "Python", "Sensors"],
    repoUrl: "https://github.com/Ethanniu3177/Lightning-McShower",
    devpostUrl: "https://devpost.com/software/lightning-mcshower",
  },
  {
    // Written from the repo itself (CONTENT.md §4), since there is no README
    // the CV doesn't list it. The difficulty ramp is the part that isn't in
    // the standard build of this game: `treeSpeedRampRate` scales the tree's
    // speed every frame and `gravityRampRate` adds downward gravity over time.
    slug: "apple-picker",
    title: "Apple Picker",
    kind: "PROJECT",
    period: "Sep 2026",
    blurb:
      "A Unity arcade game in C#: a tree drifts overhead dropping apples into mouse-controlled baskets, and every miss costs a basket. I added a difficulty ramp that scales both tree speed and gravity the longer you last.",
    detail: [
      "A Unity arcade game. A tree drifts left and right overhead dropping apples, and you slide a stack of baskets under them with the mouse. Miss one and you lose a basket and the field clears; run out and the scene reloads.",
      "Six hand-written C# scripts (Apple, ApplePicker, AppleTree, Basket, ScoreCounter and HighScore) on URP with a TextMesh Pro interface.",
      "The part you won't find in the standard build of this game is the difficulty ramp in AppleTree: treeSpeedRampRate scales the tree's speed every frame and gravityRampRate adds downward gravity over time, so it gets harder the longer you last.",
    ],
    tech: ["Unity", "C#", "URP"],
    repoUrl: "https://github.com/JakeRecharte/Apple-Picker",
    demo: {
      key: "apple-picker",
      label: "The Unity build, playable",
      guide: [
        "Move the mouse to slide the stack of baskets along the bottom. Every apple caught is 100 points.",
        "A miss destroys one basket and clears the field. Run out of baskets and the scene reloads from the start.",
        "Last a while and feel it tighten: treeSpeedRampRate scales the tree's speed every frame and gravityRampRate keeps adding downward gravity, so the apples fall faster the longer you survive.",
      ],
      note: "This is the actual Unity project compiled to WebAssembly and running in the page, not a recording. It's mouse-driven, so you'll want a trackpad or a mouse; there's nothing to aim with on a phone.",
    },
  },
  {
    // Coursework, and the copy says so (§6 voice). Written from the three lab
    // PDFs Jake supplied on 2026-10-14: labs 0, 1 and 1b of SDSU's CS 470
    // Unix/Linux Sysadmin, the course §2.2 lists in progress as "UNIX/System
    // Design". Scope here is those three labs and nothing past them; how far
    // along he actually is, and whether any of it is in a repo, are open
    // (CONTENT.md §8.23), so the copy ends on "it isn't finished" rather than
    // implying the whole lab network already stands.
    slug: "homelab",
    title: "Homelab",
    kind: "PROJECT",
    status: "IN PROGRESS",
    period: "Aug 2026 - Now",
    blurb:
      "A lab network of VMs on one internal domain, built for a semester of Unix sysadmin: one OpenBSD server running BIND for DNS, a root CA that issues the certs, and an LDAP directory behind every login.",
    detail: [
      "A private network of virtual machines, all statically addressed on one domain (cs470.internal), with a single OpenBSD server holding it together: BIND answering forward and reverse DNS, a root certificate authority issuing the certs, and an OpenLDAP directory behind the logins.",
      "Coursework for a Unix/Linux sysadmin class, done solo from a bare install up: custom disk layout, static addressing, then sudo, bash and BIND compiled out of the OpenBSD ports tree rather than installed as packages, and a kernel rebuilt with the drivers a VM never uses taken out.",
      "The CA signs with a P-384 elliptic curve key and the directory answers only over LDAPS. Plain LDAP on 389 is switched off, so no login crosses the network in the clear. It isn't finished: FreeBSD, Ubuntu, AlmaLinux and the rest join the same domain as the semester runs.",
    ],
    tech: ["OpenBSD", "BIND", "OpenLDAP", "OpenSSL"],
  },
  {
    slug: "ai-trading-model",
    title: "AI Trading Model",
    kind: "PROJECT",
    period: "Nov 2025",
    blurb:
      "Stock prediction pipeline over Yahoo Finance data. A random forest regressor ranks the top five into an equal-weight portfolio, which beat the market by 1.7% in backtesting.",
    detail: [
      "A stock prediction pipeline. It pulls daily prices for a 50-ticker universe out of the Yahoo Finance API, cleans them, and builds five rolling-window features per ticker: 5-, 21- and 63-day returns, 21-day volatility, and price over its own 63-day moving average.",
      "A random forest regressor (200 trees, depth 8) predicts each ticker's return over the next 21 trading days. The five highest predictions become an equal-weight portfolio, re-ranked at every date in the test set.",
      "Across that test set the original run beat the universe average by 1.7%. Re-running the same pipeline on a fresh Yahoo Finance pull gives 1.95% (same code, newer data) and the test R\u00b2 is 0.006, so the edge is an average over noise rather than a signal you could lean on.",
    ],
    tech: ["Python", "scikit-learn", "Pandas"],
    repoUrl: "https://github.com/JakeRecharte/Trading-Model",
    demo: {
      key: "ai-trading-model",
      label: "The forest, running in your browser",
      guide: [
        "The 200 trees are retrained from the repo's pipeline and shipped as JSON. Just opening this scored all 50 tickers at every date in the test set, right in the page. There's no server behind this demo.",
        "Drag the date. The five rows are the portfolio the model would have held from that day: predicted is the return it expected over the next 21 trading days, realized is what the price actually did.",
        "Amber is those five picks, grey is the average of all 50. Amber above grey is a date the model won; the counter says how often that happened.",
        "Look for a date where amber dives well below grey. The 1.95% edge is the average of this whole noisy line, not something that holds on any given day.",
      ],
      note: "A backtest on historical prices, for research, not investment advice. The split is time-ordered, so the model never trained on the dates it's scored against, but it's still one split of one decade of one 50-stock universe.",
    },
  },
];
