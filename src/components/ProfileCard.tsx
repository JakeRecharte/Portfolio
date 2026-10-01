import { site } from "@/content/site";

const socials = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Email", href: `mailto:${site.email}` },
  { label: "Resume", href: site.links.resume },
];

/**
 * Sticky identity card. The reference uses a solid white card; on the fog a
 * translucent panel lets the background through instead of punching a hole
 * in it.
 */
export default function ProfileCard() {
  return (
    <aside className="lg:sticky lg:top-12 lg:self-start">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
        {/* Monogram stands in until there's a real photo. */}
        <div className="mx-auto flex aspect-square w-full max-w-56 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/90 to-orange-600/90 text-6xl font-black tracking-tighter text-neutral-950 select-none">
          JR
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {site.name}
        </h1>
        <p className="mt-1 text-center text-sm font-medium text-accent">
          {site.role}
        </p>

        <p className="mt-5 text-center text-sm leading-relaxed text-white/60">
          {site.bio}
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                className="block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-sm text-white/80 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <dl className="mt-6 border-t border-white/10 pt-5 text-center">
          <dt className="sr-only">Education</dt>
          <dd className="text-sm font-medium text-white/80">
            {site.education.degree}
          </dd>
          <dd className="mt-0.5 text-xs text-white/45">
            {site.education.school} &middot; {site.education.graduation}
          </dd>
        </dl>
      </div>
    </aside>
  );
}
