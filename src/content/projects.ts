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
export type Project = {
  slug: string;
  title: string;
  /** `HACKATHON` is a weekend build judged against other teams. */
  kind: "PROJECT" | "HACKATHON";
  period: string;
  blurb: string;
  tech?: string[];
  repoUrl?: string;
  liveUrl?: string;
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
    tech: ["Arduino", "C++", "Python", "Sensors"],
  },
  {
    slug: "ai-trading-model",
    title: "AI Trading Model",
    kind: "PROJECT",
    period: "Nov 2025",
    blurb:
      "Stock prediction pipeline over Yahoo Finance data. A random forest regressor ranks the top five into an equal-weight portfolio, which beat the market by 1.7% in backtesting.",
    tech: ["Python", "scikit-learn", "Pandas"],
    repoUrl: "https://github.com/JakeRecharte/Trading-Model",
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
    tech: ["Unity", "C#", "URP"],
    repoUrl: "https://github.com/JakeRecharte/Apple-Picker",
  },
];
