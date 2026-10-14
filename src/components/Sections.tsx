import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { tools } from "@/content/tools";
import SectionHeading from "./SectionHeading";
import ArrowLink from "./ArrowLink";
import Reveal from "./Reveal";

export function Hero() {
  return (
    <section>
      <Reveal>
        <h2 className="text-6xl leading-[0.85] font-black tracking-tighter uppercase sm:text-7xl lg:text-8xl">
          <span className="block text-white">{site.headline[0]}</span>
          <span className="block text-white/20">{site.headline[1]}</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
          {site.tagline}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-8">
          {site.stats.map((stat) => (
            <div key={stat.label.join(" ")}>
              <dt className="sr-only">{stat.label.join(" ")}</dt>
              <dd>
                <span className="block text-5xl font-black tracking-tighter text-white tabular-nums sm:text-6xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-xs tracking-widest text-white/45 uppercase">
                  {stat.label[0]}
                  <br />
                  {stat.label[1]}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24">
      <Reveal>
        <SectionHeading lines={["RECENT", "PROJECTS"]} />
      </Reveal>
      <ul className="mt-12 divide-y divide-white/10 border-t border-white/10">
        {projects.map((p, i) => {
          const href = p.liveUrl ?? p.repoUrl;
          return (
            <Reveal key={p.slug} delay={i * 0.06}>
              <li>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-6 py-7 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        {p.title}
                      </h3>
                      <span className="font-mono text-xs text-white/35">
                        {p.year}
                      </span>
                    </div>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">
                      {p.blurb}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/55"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ArrowLink className="mt-1.5 text-accent" />
                </a>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24">
      <Reveal>
        <SectionHeading lines={["RELEVANT", "EXPERIENCE"]} />
      </Reveal>
      <ol className="mt-12 divide-y divide-white/10 border-t border-white/10">
        {experience.map((role, i) => (
          <Reveal key={role.org + role.title} delay={i * 0.06}>
            <li className="py-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {role.org}
                </h3>
                <span className="font-mono text-xs text-white/35">
                  {role.period}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-accent">
                {role.title}
              </p>
              <ul className="mt-3 max-w-lg space-y-1.5">
                {role.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative pl-4 text-sm leading-relaxed text-white/55 before:absolute before:top-2.5 before:left-0 before:size-1 before:rounded-full before:bg-white/30"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Tools() {
  return (
    <section id="tools" className="scroll-mt-24">
      <Reveal>
        <SectionHeading lines={["THE", "TOOLKIT"]} />
      </Reveal>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tools.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.04}>
            <li className="h-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/25 hover:bg-white/[0.07]">
              <span className="block text-sm font-semibold text-white">
                {t.name}
              </span>
              <span className="mt-0.5 block text-xs text-white/45">
                {t.kind}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function Contact() {
  const links = [
    { label: "Email", href: `mailto:${site.email}`, value: site.email },
    { label: "GitHub", href: site.links.github, value: "@JakeRecharte" },
    { label: "LinkedIn", href: site.links.linkedin, value: "/in/jakerecharte" },
    { label: "Resume", href: site.links.resume, value: "PDF" },
  ];
  return (
    <section id="contact" className="scroll-mt-24">
      <Reveal>
        <SectionHeading lines={["GET IN", "TOUCH"]} />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-white/65">
          Open to summer 2027 internships. The fastest way to reach me is email.
        </p>
      </Reveal>
      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {links.map((l, i) => (
          <Reveal key={l.label} delay={i * 0.06}>
            <li>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-white/[0.03]"
              >
                <span className="text-lg font-semibold text-white sm:text-xl">
                  {l.label}
                </span>
                <span className="flex items-center gap-3 text-sm text-white/45 group-hover:text-white/70">
                  <span className="hidden sm:inline">{l.value}</span>
                  <ArrowLink className="text-accent" />
                </span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
