import { site } from "@/content/site";
import { now } from "@/content/now";
import ContributionGraph from "./ContributionGraph";
import Icon from "./Icon";

// Profiles only. Resume and email are deliberately absent: since the Contact
// section came off the page, both live in the nav bar's pills — Resume opens
// the PDF in a modal (ResumeDialog) and Contact opens the email and LinkedIn
// rows (ContactDialog).
const socials = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
] as const;

/**
 * One chip style for every kind, shared in spirit with the `kind` chip in
 * `Work`. The amber outline marks it as a kind label, not a status — the badge
 * still says what a thing is, never whether it's current, and "ongoing" is
 * carried by the period reading "… - Now" (DESIGN.md §2.1).
 */
const badgeClass = "border-accent/40 text-white/55";

/**
 * Full-width identity header: who he is on the left, what he's doing right now
 * on the right. Replaces the sticky side card — the same facts read faster as
 * one block above the fold than as a rail you scroll past.
 */
export default function Header() {
  return (
    <header
      id="top"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    >
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[16rem_1fr] md:gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
        <div className="md:border-r md:border-white/10 md:pr-10 lg:pr-12">
          {/* Monogram stands in until there's a real photo (CONTENT.md §8). */}
          <div className="flex aspect-square w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/90 to-orange-600/90 text-4xl font-black tracking-tighter text-neutral-950 select-none sm:w-36 sm:text-5xl">
            JR
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
            {site.name}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {site.education.location}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {socials.map((s) => {
              const external = s.href.startsWith("http");
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/75 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
                  >
                    {/* Explicit accent beats the pill's hover:text-white. */}
                    <Icon name={s.label} className="size-4 text-accent" />
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <dl className="mt-6 border-t border-white/10 pt-5">
            <dt className="sr-only">Education</dt>
            <dd className="text-sm font-medium text-white/80">
              {site.education.degree}
            </dd>
            <dd className="mt-0.5 text-xs text-white/45">
              {site.education.school} &middot; {site.education.graduation}
            </dd>
          </dl>
        </div>

        <div className="min-w-0">
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
            Now and recently
          </h2>

          <ul className="mt-5 divide-y divide-white/10 border-t border-white/10">
            {now.map((entry) => (
              <li
                key={`${entry.org}-${entry.title}`}
                className="flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-center sm:gap-x-4"
              >
                <p className="min-w-0 flex-1 text-[15px] text-white">
                  <span className="font-semibold">{entry.org}</span>
                  <span className="text-white/35"> &middot; </span>
                  <span className="text-white/65">{entry.title}</span>
                </p>
                {/* Date and badge stay on one line of their own so a long
                    title never wraps around them. */}
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs whitespace-nowrap text-white/45">
                    {entry.period}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wider ${badgeClass}`}
                  >
                    {entry.badge}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <ContributionGraph />
          </div>
        </div>
      </div>
    </header>
  );
}
