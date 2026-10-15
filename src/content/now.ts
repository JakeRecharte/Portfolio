/**
 * The header's "Now and recently" rail: the four most recent things, newest
 * start first. Longer history lives in `experience.ts` and `projects.ts`; this is the
 * glance.
 *
 * Every row is verified in CONTENT.md §2.3 / §2.6. `badge` says what the thing
 * *is* (a club, an internship) and never when it was; `period` is the only
 * place time is expressed, and it ends in "Now" while a row is ongoing.
 */
export type NowEntry = {
  org: string;
  title: string;
  period: string;
  badge: "CLUB" | "INTERNSHIP" | "PROGRAM";
};

export const now: NowEntry[] = [
  {
    org: "ColorStack",
    title: "Co-Vice President",
    period: "Jul 2026 - Now",
    badge: "CLUB",
  },
  {
    org: "GradeFlow",
    title: "Software Developer",
    period: "Feb - Jul 2026",
    badge: "INTERNSHIP",
  },
  {
    org: "SDSU AI Club",
    title: "Member",
    period: "Jan 2026 - Now",
    badge: "CLUB",
  },
  {
    org: "Sigma Phi Delta",
    title: "Rush & Brotherhood Chair",
    period: "Sep 2025 - Now",
    badge: "CLUB",
  },
];
