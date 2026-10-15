import { site } from "@/content/site";
import { featuredProjects, otherProjects } from "@/content/projects";
import { experience } from "@/content/experience";
import SectionHeading from "./SectionHeading";
import ArrowLink from "./ArrowLink";
import Reveal from "./Reveal";
import ProjectBoard from "./ProjectBoard";
import ProjectDialog from "./ProjectDialog";

export function Hero() {
  return (
    <section>
      <Reveal>
        {/* `size="hero"` is the one step up from a section heading. It used to
            be a hand-rolled copy of `SectionHeading`'s markup, which DESIGN.md
            §6 flagged as drift waiting to happen. */}
        <SectionHeading lines={site.headline} size="hero" />
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

/**
 * The top three, as cards stacked one per row. Three things given room read as
 * a claim; the same three in a row list read as inventory, which is what the
 * additional-projects rows below are for. Order is Jake's ranking, not
 * chronological.
 *
 * Cards are the exception to "rows beat boxes" (DESIGN.md §2.3) and the only
 * ones on the page, which is the whole reason the featured set looks
 * featured.
 * They stack at every breakpoint: a full-width card is the widest surface on
 * the page, which is the claim, and it leaves the three-across shape to the
 * checkerboard below so the two don't compete.
 *
 * A stacked card is wider than its prose should ever be, so the blurb keeps
 * DESIGN.md §2.5's `max-w-lg` measure itself rather than inheriting a cap from
 * the column it used to sit in.
 */
export function FeaturedProjects() {
  return (
    <section id="projects" className="scroll-mt-24">
      <Reveal>
        <SectionHeading lines={["FEATURED", "PROJECTS"]} />
      </Reveal>
      <ul className="mt-12 flex flex-col gap-4">
        {featuredProjects.map((p, i) => {
          const destination = p.liveUrl ?? p.devpostUrl ?? p.repoUrl;
          const body = (
            <>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                {destination && (
                  <ArrowLink className="mt-1 shrink-0 text-accent" />
                )}
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-white/35">
                {p.period}
                <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/55">
                  {p.kind}
                </span>
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
                {p.blurb}
              </p>
              {p.tech && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/55"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </>
          );
          const shell =
            "group flex w-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-white/25 hover:bg-white/[0.07]";
          return (
            <Reveal key={p.slug} delay={i * 0.06}>
              <li>
                {/* A featured card opens the same dialog a board tile does:
                    it is where the write-up and any live demo live, and CWG's
                    demo would otherwise have nowhere to go. */}
                <ProjectDialog
                  project={p}
                  className={shell}
                  label={`${p.title}, ${p.period}. Open details${
                    p.demo ? " and demo" : ""
                  }.`}
                >
                  {body}
                </ProjectDialog>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Everything else that's real, as a checkerboard of squares. This is a
 * subsection of `Projects`, not a section of its own: it takes the eyebrow
 * (DESIGN.md §2.5) rather than a display heading, so `FEATURED PROJECTS` stays
 * the only projects title on the page and these tiles read as the rest of that
 * list. The `mt-16` is the subsection gap, and it only works because
 * page.tsx wraps the pair in a plain div, outside `main`'s `space-y`.
 *
 * The board itself is [ProjectBoard](./ProjectBoard.tsx), which is a client
 * component; this stays on the server and hands it the content.
 */
export function AdditionalProjects() {
  return (
    <section className="mt-16 lg:mt-20">
      <Reveal>
        <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
          Additional projects
        </h2>
      </Reveal>
      <ProjectBoard projects={otherProjects} />
    </section>
  );
}

/**
 * Work: the internship, the program, the job. The `kind` chip is load-bearing
 * here: a program is not employment, and the copy must not imply it is
 * (CONTENT.md §2.3).
 */
export function Experience() {
  return (
    <section id="work" className="scroll-mt-24">
      <Reveal>
        <SectionHeading lines={["WORK", "EXPERIENCE"]} />
      </Reveal>
      <ol className="mt-12 divide-y divide-white/10 border-t border-white/10">
        {experience.map((role, i) => (
          <Reveal key={role.slug} delay={i * 0.06}>
            <li className="py-7">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {role.org}
                </h3>
                <span className="font-mono text-xs text-white/35">
                  {role.period}
                </span>
                {/* Kind chip: accent outline per DESIGN.md §2.3. */}
                <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/55">
                  {role.kind}
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
              {role.tech && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {role.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/55"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
