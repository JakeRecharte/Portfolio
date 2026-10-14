/**
 * The header's "Now and recently" rail — the four most recent things, newest
 * start first. Longer history lives in `experience.ts`; this is the glance.
 *
 * Every row is verified in CONTENT.md §2.3 / §2.6. `badge` is the status chip:
 * "NOW" for anything ongoing, otherwise what the role actually was.
 */
export type NowEntry = {
  org: string;
  title: string;
  period: string;
  badge: "NOW" | "INTERN" | "PROGRAM";
};

export const now: NowEntry[] = [
  {
    org: "ColorStack",
    title: "Co-Vice President",
    period: "Jul 2026",
    badge: "NOW",
  },
  {
    org: "GradeFlow",
    title: "Software Developer",
    period: "Feb - Jul 2026",
    badge: "INTERN",
  },
  {
    org: "SDSU AI Club",
    title: "Member",
    period: "Jan 2026",
    badge: "NOW",
  },
  {
    org: "Sigma Phi Delta",
    title: "Rush & Brotherhood Chair",
    period: "Nov 2025",
    badge: "NOW",
  },
];
