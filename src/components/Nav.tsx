import Link from "next/link";
import { site } from "@/content/site";
import ContactDialog from "./ContactDialog";
import ResumeDialog from "./ResumeDialog";

/**
 * Page order, which is also priority order: work, then projects. There is no
 * `#contact` entry, because the Contact section came off the page and the
 * pill on the right is now the only way to reach that content.
 *
 * **There is deliberately no `/art` entry** (Jake, 2026-10-14). The art is
 * reached from the row at the bottom of the header's About modal and nowhere
 * else, which keeps the bar answering the one question it is for: can he write
 * code. A third link would have put a gallery at the same level as the work.
 *
 * **These links are `/#work`, not `#work`.** A bare fragment is relative to
 * whatever page you are on, so from `/art` it resolved to `/art#work` and did
 * nothing. Rooting them fixes that in both directions, and it still matters
 * with Art out of the bar, because this bar also renders *on* `/art` and is
 * how a visitor gets back. On the homepage the browser still treats a
 * same-path fragment as a scroll rather than a navigation, so nothing about
 * that behaviour changed.
 */
const links = [
  { href: "/#work", label: "Work" },
  { href: "/#projects", label: "Projects" },
];

const pillClass =
  "rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/75 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white";

/**
 * Sticky top bar: wordmark left, section anchors center, the two things a
 * recruiter actually wants right. It replaced the floating pill, because a
 * bar can hold the Contact and Resume actions, which a pill of three anchors
 * could not, and `sticky` keeps it in flow so nothing has to be padded
 * around it.
 *
 * The anchors are real anchors, so the bar works without JS; only the two
 * pills need it, and both degrade (Resume to the raw PDF, Contact to a
 * `mailto:`, see `ContactDialog`).
 *
 * They are `next/link` rather than plain `<a>` now that there are two routes
 * to move between: it swaps the page without a reload, which matters here for
 * one specific reason: a full load restarts the fog GIF from frame one, and
 * the bar you clicked would flash out and back in.
 */
export default function Nav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight whitespace-nowrap text-white"
        >
          {site.name}
        </Link>

        {/* Hidden on phones, where the two pills are the whole point of the
            bar and the sections are a short scroll apart anyway. */}
        <ul className="hidden items-center gap-7 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
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
