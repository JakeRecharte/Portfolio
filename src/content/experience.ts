/**
 * Work: the internship, the program, and the job. Newest first.
 *
 * `kind` matters here in a way it doesn't for projects. NAVSEA/FathomWerx was
 * an eight-week program, not employment, and CONTENT.md §2.3 is explicit that
 * the copy must not imply otherwise. The chip does that work so the bullets
 * don't have to.
 *
 * Bullets are outcomes, with the number where there is one. All verified in
 * CONTENT.md §2.3.
 */
export type Role = {
  slug: string;
  org: string;
  title: string;
  kind: "INTERNSHIP" | "PROGRAM" | "JOB";
  period: string;
  bullets: string[];
  tech?: string[];
};

export const experience: Role[] = [
  {
    slug: "gradeflow",
    org: "GradeFlow",
    title: "Software Developer Intern",
    kind: "INTERNSHIP",
    period: "Feb - Jul 2026",
    bullets: [
      "Built a curriculum standards tagging feature on a team of 5: teacher-uploaded assignments get aligned standards with confidence scores.",
      "Built a document pipeline with PDF scrapers that turned 1,000+ curriculum pages into a searchable Supabase knowledge base.",
      "Trained and integrated the model mapping assignments to standards, at 82% average accuracy.",
    ],
    tech: ["Supabase", "PostgreSQL", "ML"],
  },
  {
    slug: "navsea-fathomwerx",
    org: "NAVSEA / FathomWerx",
    title: "Engineering Program Student",
    kind: "PROGRAM",
    period: "Sep - Dec 2023",
    bullets: [
      "Eight-week government-sponsored defense engineering program covering defense and military technologies.",
      "Lectures delivered by working government and industry engineers.",
    ],
  },
  {
    slug: "gold-coast-insurance",
    org: "Gold Coast Insurance",
    title: "IT & Office Support",
    kind: "JOB",
    period: "Sep 2021 - May 2023",
    bullets: [
      "In-house IT support for a 7-computer office, with no outside vendor on call.",
      "Hardware upgrades, Windows OS installations, and software configuration.",
    ],
    tech: ["Windows", "Hardware"],
  },
];
