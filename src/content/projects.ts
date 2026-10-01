export type Project = {
  slug: string;
  title: string;
  blurb: string;
  tech: string[];
  repoUrl?: string;
  liveUrl?: string;
  year: string;
};

// TODO: replace these with real projects. Keep 3-6 — quality beats quantity.
export const projects: Project[] = [
  {
    slug: "portfolio",
    title: "Portfolio Site",
    blurb:
      "This site. Next.js App Router with a procedural animated background built from layered gradients instead of a multi-megabyte GIF.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    repoUrl: "https://github.com/JakeRecharte/Portfolio",
    year: "2026",
  },
  {
    slug: "project-two",
    title: "Project Two",
    blurb:
      "What problem it solves, what you personally built, and what was actually hard about it. Two sentences is plenty.",
    tech: ["Python", "PostgreSQL"],
    repoUrl: "https://github.com/JakeRecharte",
    year: "2026",
  },
  {
    slug: "project-three",
    title: "Project Three",
    blurb:
      "Recruiters skim this. Lead with the outcome, not the assignment prompt.",
    tech: ["C++", "Data Structures"],
    repoUrl: "https://github.com/JakeRecharte",
    year: "2025",
  },
];
