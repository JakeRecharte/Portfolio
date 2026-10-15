export const site = {
  name: "Jake Recharte",
  /**
   * The hero splits this across two lines, second line muted, so the pair has
   * to read as one phrase. "COMPUTER / SCIENCE" was here first and said
   * nothing the rest of the page doesn't, since a portfolio full of code
   * already establishes the major. This says the thing that's actually rare in a
   * student portfolio: the projects are done, published, and running.
   */
  headline: ["ACTUALLY", "FINISHED"] as const,
  role: "CS Student @ SDSU",
  /**
   * The three examples are descriptions, not metrics. "an ML model at 82%
   * accuracy" was here until 2026-10-14 and broke the same rule the stats row
   * does now: one project's number can't summarize the work (CONTENT.md §3).
   * They also cover three different kinds of building (tooling, an app with
   * a backend, hardware) which a list of three software projects wouldn't.
   */
  tagline:
    "CS student at San Diego State. I build things end to end and actually get them out the door: a language published on PyPI, a climbing app on Supabase, a hackathon car wired by hand.",
  bio: "CS student at SDSU, focused on software engineering. Looking for a summer 2027 internship.",
  /**
   * The header's About dialog: Jake's own draft, supplied 2026-10-14, cut to
   * length rather than added to (CONTENT.md §6, and §8 Q12, which this
   * closes). Every fact here traces to that draft; the facts are folded into
   * CONTENT.md §2.7 so a later edit has a source to check against.
   *
   * Two sections because the draft had two, and they do different jobs: the
   * first is why he writes code, the second is the thing underneath it. The
   * art link is last because it leaves the dialog.
   *
   * "Rancho Campana" is spelled out from the draft's "ranch Campana", the
   * STEM academy high school in Camarillo. Flagged for confirmation in §8.
   */
  about: {
    sections: [
      {
        heading: "The code",
        paragraphs: [
          "Tech found me in middle school, right as 3D printers were becoming something you could buy. That's what sent me to Rancho Campana, a STEM academy high school with industry-level laser cutters, CNC machines, and my first coding class. What got me was the puzzle: a problem is either solved or it isn't.",
          "Right now it's UNIX and 3D game design. Lower-division coursework had turned into real burnout, and those two classes are what broke through it.",
        ],
      },
      {
        heading: "Outside the code",
        paragraphs: [
          "Grew up in Ventura County, jumping hobby to hobby and sport to sport: soldering to wakeboarding and most things in between. What drove it was wanting to make something, which is what made picking between computer science and architecture hard. No regrets about how that went.",
          "These days it's rock climbing and board sports.",
        ],
      },
    ],
    /**
     * Internal route, so no `target="_blank"` (DESIGN.md §3). The draft wrote
     * it as `jakerecharte.com/art`; the site serves it at `/art`, and a
     * same-site absolute URL would cost a full reload for nothing.
     */
    art: { label: "Art portfolio", href: "/art" },
  },
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
   * Career-level only. A single project's metric (82% accuracy, 330,000
   * parcels) is evidence on the tile that earned it and an assertion up
   * here, which is the same reason the toolkit grid came off (DESIGN.md
   * §2.3). Each of these spans the whole body of work instead.
   *
   * `2/2` rather than `2`: a count says he placed twice, the fraction says he
   * has placed in every hackathon he has entered. It is only true while that
   * stays the case, since a third hackathon without a placement makes it a lie
   * (CONTENT.md §8).
   *
   * The project count is Jake's, set 2026-10-14. CONTENT.md §2.4 lists seven
   * builds and can't decide on its own which are "finished" (CWG is
   * published but ongoing, BoulderBuddy shipped but stale) so the number is
   * his call, not an arithmetic result.
   */
  stats: [
    { value: "2/2", label: ["HACKATHONS", "PLACED"] },
    { value: "7", label: ["PROJECTS", "FINISHED"] },
    { value: "1", label: ["PUBLISHED", "PACKAGE"] },
  ],
} as const;
