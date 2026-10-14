/**
 * Projects, split two ways on purpose.
 *
 * `featuredProjects` is the top three, in the order Jake ranked them — not
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
 * are audited in §4 — a project with no public repo still gets a tile, and its
 * dialog says so rather than offering a dead link.
 */

/**
 * A runnable demo, keyed to a component in
 * [demos/ProjectDemo](../components/demos/ProjectDemo.tsx). Adding a key here
 * means adding a case there; the dialog renders the demo pane only for a
 * project that has one.
 */
export type DemoKey = "ai-trading-model";

export type ProjectDemo = {
  key: DemoKey;
  /** Eyebrow over the demo pane — says what the thing running actually is. */
  label: string;
  /** How to drive it. 2–4 steps, each one action or one thing to notice. */
  guide: string[];
  /** The caveat a visitor deserves before reading the output as a claim. */
  note?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** `HACKATHON` is a weekend build judged against other teams. */
  kind: "PROJECT" | "HACKATHON";
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
  demo?: ProjectDemo;
};

export const featuredProjects: Project[] = [
  {
    slug: "cwg-coding-with-git",
    title: "CWG — Coding With Git",
    kind: "PROJECT",
    period: "May 2026 - Now",
    blurb:
      "A language where the git commit graph is the source code: branches are control flow, commits are statements, tags define functions. Tree-walking interpreter, published on PyPI.",
    tech: ["Python", "GitPython", "Git"],
    repoUrl: "https://github.com/JakeRecharte/CWG-Coding_with_Git",
    liveUrl: "https://pypi.org/project/cwg/",
  },
  {
    slug: "permit-paragons",
    title: "Permit Paragons",
    kind: "HACKATHON",
    period: "Aug 2026",
    blurb:
      "Permit prediction to shorten low-income housing timelines, on a team of 6. I built the front-end map of 330,000+ San Diego County parcels. 4th of 100+ participants.",
    tech: ["TypeScript", "Python", "Docker"],
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
    slug: "lightning-mcshower",
    title: "Lightning McShower",
    kind: "HACKATHON",
    period: "Sep 2026",
    blurb:
      "On a team of 5: a remote-controlled car that rates the hygiene of whoever stands in front of it, from a vision model and a gas sensor. I built the hardware. 1st in hardware, 4th of 200.",
    detail: [
      "A remote-controlled car that rates the hygiene of whoever stands in front of it. A vision model watches through the camera, a gas sensor reads the air, and the two together produce the verdict.",
      "On a team of 5, I owned the hardware — car assembly, camera and gas sensor wiring — and the overall project scope.",
      "Judged 1st in hardware and 4th overall out of 200 competitors.",
    ],
    tech: ["Arduino", "C++", "Python", "Sensors"],
  },
  {
    slug: "ai-trading-model",
    title: "AI Trading Model",
    kind: "PROJECT",
    period: "Nov 2025",
    blurb:
      "Stock prediction pipeline over Yahoo Finance data. A random forest regressor ranks the top five into an equal-weight portfolio, which beat the market by 1.7% in backtesting.",
    detail: [
      "A stock prediction pipeline. It pulls daily prices for a 50-ticker universe from the Yahoo Finance API, cleans them, and builds five rolling-window features per ticker: 5-, 21- and 63-day returns, 21-day volatility, and price over its own 63-day moving average.",
      "A random forest regressor — 200 trees, depth 8 — predicts each ticker's return over the next 21 trading days. The five highest predictions become an equal-weight portfolio, re-ranked at every date in the test set.",
      "Across that test set the original run beat the universe average by 1.7%. Re-running the same pipeline on a fresh Yahoo Finance pull gives 1.95% — same code, newer data — and the test R\u00b2 is 0.006, so the edge is an average over noise rather than a signal you could lean on.",
    ],
    tech: ["Python", "scikit-learn", "Pandas"],
    repoUrl: "https://github.com/JakeRecharte/Trading-Model",
    demo: {
      key: "ai-trading-model",
      label: "The forest, running in your browser",
      guide: [
        "The 200 trees are retrained from the repo's pipeline and shipped as JSON. Opening this scored all 50 tickers at every date in the test set, in the page — there is no server in this demo.",
        "Drag the date. The five rows are the portfolio the model would have held from that day: predicted is the return it expected over the next 21 trading days, realized is what the price actually did.",
        "Amber is those five picks, grey is the average of all 50. Amber above grey is a date the model won; the counter says how often that happened.",
        "Look for a date where amber dives well below grey. The 1.95% edge is the average of this whole noisy line, not a thing that holds on any given day.",
      ],
      note: "A backtest on historical prices, for research — not investment advice. The split is time-ordered, so the model never trained on the dates it is scored against, but it is still one split of one decade of one 50-stock universe.",
    },
  },
  {
    // Written from the repo itself (CONTENT.md §4) — there is no README and
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
      "A Unity arcade game. A tree drifts left and right overhead dropping apples, and you slide a stack of baskets under them with the mouse. A miss destroys one basket and clears the field; run out and the scene reloads.",
      "Six hand-written C# scripts — Apple, ApplePicker, AppleTree, Basket, ScoreCounter and HighScore — on URP with a TextMesh Pro interface.",
      "The part that isn't in the standard build of this game is the difficulty ramp in AppleTree: treeSpeedRampRate scales the tree's speed every frame and gravityRampRate adds downward gravity over time, so it gets harder the longer you last.",
    ],
    tech: ["Unity", "C#", "URP"],
    repoUrl: "https://github.com/JakeRecharte/Apple-Picker",
  },
];
