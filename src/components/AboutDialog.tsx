"use client";

import { useRef } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import ArrowLink from "./ArrowLink";

/**
 * The header's About trigger: a modal holding Jake's own words about himself,
 * sitting under the degree line because that is where a reader is already
 * looking at "who is this" rather than "what has he shipped".
 *
 * Size is the project dialog's write-up-only size: half the demo dialog's
 * `max-w-6xl` by `90dvh`, so `w-[min(92vw,36rem)]` and `min-h-[45dvh]`
 * (DESIGN.md §2.3), with `max-h-` so a long script scrolls instead of
 * overflowing. It reuses that shell wholesale: `p-0 open:flex open:flex-col`,
 * a pinned header bar, one scrolling body.
 *
 * **This is the one modal trigger that is a `<button>`, not an anchor**
 * (DESIGN.md §4, rule 3, and the exception written there). Resume degrades to
 * the PDF and Contact to `mailto:` because both have a real destination; this
 * copy has no URL of its own, and inventing `#about` for a section that does
 * not exist would be a worse lie than a button. It stays keyboard reachable
 * and announces itself with `aria-haspopup="dialog"`.
 */
export default function AboutDialog({
  triggerClassName,
}: {
  triggerClassName: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className={triggerClassName}
      >
        About
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="about-dialog-title"
        // Clicking the backdrop lands on the dialog element itself; every
        // click on the content stops at a child.
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-[90dvh] min-h-[45dvh] w-[min(92vw,36rem)] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 p-0 backdrop-blur-xl backdrop:bg-black/70 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
          <h2
            id="about-dialog-title"
            className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase"
          >
            About
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-white/75 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Measure is carried by the prose, not the dialog: the panel's
              36rem less `sm:` padding is exactly §2.5's `max-w-lg`, and the
              cap holds it there on any wider screen. */}
          <div className="max-w-lg space-y-8">
            {site.about.sections.map((section) => (
              <section key={section.heading}>
                {/* Eyebrow geometry at heading alpha. The pinned bar above is
                    the same mono eyebrow at `/40`, so these have to sit a step
                    brighter or the dialog title and its subsections read as
                    one flat level (DESIGN.md §2.2). */}
                <h3 className="font-mono text-xs tracking-[0.2em] text-white uppercase">
                  {section.heading}
                </h3>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/55">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            {/* The one thing in here that leads somewhere, so it takes the row
                recipe: `group`, a hover tint, and the amber arrow at the far
                right (DESIGN.md §3). `next/link` for the soft nav, since a
                full load would restart the fog GIF, which is why `Nav` uses
                it. */}
            <Link
              href={site.about.art.href}
              onClick={() => dialogRef.current?.close()}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              <span className="text-sm text-white">{site.about.art.label}</span>
              <ArrowLink className="size-4 text-accent" />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
