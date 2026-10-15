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
  /**
   * The three examples are descriptions, not metrics. "an ML model at 82%
   * accuracy" was here until 2026-10-14 and broke the same rule the stats row
   * does now: one project's number can't summarize the work (CONTENT.md §3).
   * They also cover three different kinds of building — tooling, an app with
   * a backend, hardware — which a list of three software projects wouldn't.
   */
  tagline:
    "CS student at San Diego State. I build things end to end and get them out the door — a language published on PyPI, a climbing app on Supabase, a hackathon car wired by hand.",
  bio: "A CS student at SDSU focused on software engineering. Currently looking for a summer 2027 internship.",
  /**
   * The header's About dialog, one string per paragraph.
   *
   * TODO: placeholder. Jake is supplying the real copy himself ("a script"),
   * so this is deliberately obvious filler rather than a plausible bio — a
   * subtly-fake About would read as his voice when it isn't (CONTENT.md §9.3,
   * and the hard rule at the top of that file). It is the same ask as §8 Q12,
   * so whatever lands here closes both.
   *
   * The dialog caps measure at `max-w-lg` (DESIGN.md §2.5) and scrolls past
   * about 90dvh, so there is no hard paragraph limit — but the first one is
   * the only one guaranteed to be read.
   */
  about: [
    "PLACEHOLDER — Jake's own words go here. Replace this array with the script he supplies; one string per paragraph.",
    "PLACEHOLDER — second paragraph, so the spacing between paragraphs is visible while this is still filler.",
  ],
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
  /**
   * Career-level only. A single project's metric — 82% accuracy, 330,000
   * parcels — is evidence on the tile that earned it and an assertion up
   * here, which is the same reason the toolkit grid came off (DESIGN.md
   * §2.3). Each of these spans the whole body of work instead.
   *
   * `2/2` rather than `2`: a count says he placed twice, the fraction says he
   * has placed in every hackathon he has entered. It is only true while that
   * stays the case — a third hackathon without a placement makes it a lie
   * (CONTENT.md §8).
   *
   * The project count is Jake's, set 2026-10-14. CONTENT.md §2.4 lists seven
   * builds and can't decide on its own which are "finished" — CWG is
   * published but ongoing, BoulderBuddy shipped but stale — so the number is
   * his call, not an arithmetic result.
   */
  stats: [
    { value: "2/2", label: ["HACKATHONS", "PLACED"] },
    { value: "7", label: ["PROJECTS", "FINISHED"] },
    { value: "1", label: ["PUBLISHED", "PACKAGE"] },
  ],
} as const;
