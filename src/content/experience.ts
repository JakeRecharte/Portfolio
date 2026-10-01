export type Role = {
  org: string;
  title: string;
  period: string;
  bullets: string[];
};

// TODO: replace with real roles. Non-tech jobs count — frame the transferable
// parts. Bullets should be outcomes, not duties.
export const experience: Role[] = [
  {
    org: "Company or Lab Name",
    title: "Software Engineering Intern",
    period: "Summer 2027",
    bullets: [
      "What you built and what it did for the team or the users.",
      "A number if you have one: latency, throughput, users, hours saved.",
    ],
  },
  {
    org: "SDSU",
    title: "Relevant Coursework",
    period: "2024 - Present",
    bullets: [
      "Data Structures, Algorithms, Operating Systems, Databases.",
      "Swap in the courses that actually back up the projects above.",
    ],
  },
];
