export const site = {
  name: "Jake Recharte",
  /**
   * The hero splits this across two lines, second line muted, so the pair has
   * to read as one phrase. "COMPUTER / SCIENCE" was here first and said
   * nothing the rest of the page doesn't — a portfolio full of code already
   * establishes the major. This says the thing that's actually rare in a
   * student portfolio: the projects are done, published, and running.
   */
  headline: ["ACTUALLY", "FINISHED"] as const,
  role: "CS Student @ SDSU",
  tagline:
    "CS student at San Diego State. I build things end to end and get them out the door — a language published on PyPI, a climbing app on Supabase, an ML model at 82% accuracy.",
  bio: "A CS student at SDSU focused on software engineering. Currently looking for a summer 2027 internship.",
  email: "jakerecharte@gmail.com",
  links: {
    github: "https://github.com/JakeRecharte",
    linkedin: "https://www.linkedin.com/in/jake-recharte-8a3470377/",
    resume: "/resume.pdf",
  },
  education: {
    location: "San Diego, CA",
    school: "San Diego State University",
    degree: "B.S. Computer Science",
    graduation: "Expected May 2028",
  },
  // Every one of these traces to CONTENT.md §2.3 / §2.4. Concrete numbers
  // beat countable-but-soft ones ("years coding" has no source at all).
  stats: [
    { value: "82", label: ["PERCENT", "ACCURACY"] },
    { value: "330K", label: ["PARCELS", "MAPPED"] },
    { value: "2", label: ["HACKATHON", "PLACEMENTS"] },
  ],
} as const;
