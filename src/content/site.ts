export const site = {
  name: "Jake Recharte",
  // The hero splits this across two lines, second line muted.
  headline: ["COMPUTER", "SCIENCE"] as const,
  role: "CS Student @ SDSU",
  tagline:
    "Computer Science student at San Diego State University. I like building things that are fast, legible, and actually finished.",
  bio: "A CS student at SDSU focused on software engineering. Currently looking for a summer 2027 internship.",
  email: "jakerecharte@gmail.com",
  links: {
    github: "https://github.com/JakeRecharte",
    linkedin: "https://linkedin.com/in/jakerecharte",
    resume: "/resume.pdf",
  },
  education: {
    school: "San Diego State University",
    degree: "B.S. Computer Science",
    graduation: "Expected May 2028",
  },
  // TODO: replace with real numbers once there's something true to put here.
  stats: [
    { value: "6", label: ["PROJECTS", "SHIPPED"] },
    { value: "3", label: ["YEARS", "CODING"] },
    { value: "8", label: ["LANGUAGES", "USED"] },
  ],
} as const;
