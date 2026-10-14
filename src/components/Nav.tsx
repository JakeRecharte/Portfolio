import { site } from "@/content/site";
import ContactDialog from "./ContactDialog";
import ResumeDialog from "./ResumeDialog";

/**
 * Page order, which is also priority order: work, then projects. There is no
 * `#contact` entry — the Contact section came off the page, and the pill on the
 * right is now the only way to reach that content.
 */
const links = [
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
];

const pillClass =
  "rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/75 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white";

/**
 * Sticky top bar: wordmark left, section anchors center, the two things a
 * recruiter actually wants right. It replaced the floating pill — a bar can
 * hold the Contact and Resume actions, which a pill of three anchors could
 * not, and `sticky` keeps it in flow so nothing has to be padded around it.
 *
 * The anchors are real anchors, so the bar works without JS; only the two
 * pills need it, and both degrade (Resume to the raw PDF, Contact to a
 * `mailto:` — see `ContactDialog`).
 */
export default function Nav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
        <a
          href="#top"
          className="text-sm font-bold tracking-tight whitespace-nowrap text-white"
        >
          {site.name}
        </a>

        {/* Hidden on phones, where the two pills are the whole point of the
            bar and the sections are a short scroll apart anyway. */}
        <ul className="hidden items-center gap-7 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ContactDialog triggerClassName={pillClass} />
          <ResumeDialog triggerClassName={pillClass}>Resume</ResumeDialog>
        </div>
      </div>
    </nav>
  );
}
