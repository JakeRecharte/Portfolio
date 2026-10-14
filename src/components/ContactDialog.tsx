"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import Icon from "./Icon";
import type { IconName } from "./Icon";

/**
 * The nav bar's Contact pill: a modal holding the two ways to actually
 * reach him, email first. Email is a copy button rather than a `mailto:` because a
 * recruiter on a desktop without a mail client gets nothing from `mailto:`;
 * the address stays selectable text either way.
 *
 * No phone row — `CONTENT.md` §2.1 keeps the number off the public site. No
 * GitHub row either: it's where you read his code, not a way to reach him. It
 * stays in the header pills.
 *
 * This modal is the *only* contact surface on the site now that the Contact
 * section is gone, which is why its no-JS fallback had to change (below).
 */
const channels: {
  name: IconName;
  label: string;
  value: string;
  href: string;
}[] = [
  {
    name: "Email",
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    name: "LinkedIn",
    label: "LinkedIn",
    value: "/in/jakerecharte",
    href: site.links.linkedin,
  },
];

export default function ContactDialog({
  triggerClassName,
}: {
  triggerClassName: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Clear the "Copied" flag a couple of seconds after the last copy.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(null), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
    } catch {
      // Clipboard can be blocked (insecure context, denied permission). The
      // value is on screen and selectable, so there's nothing to recover.
    }
  }

  return (
    <>
      {/* An anchor, not a button (DESIGN.md §4, rule 3). It used to fall back
          to `#contact`; with that section gone the only honest target left is
          the address itself. `mailto:` is a poor primary — which is why the row
          inside the modal copies instead — but it is a real destination for a
          visitor without JS, and `#contact` no longer is. */}
      <a
        href={`mailto:${site.email}`}
        aria-haspopup="dialog"
        onClick={(e) => {
          if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
          )
            return;
          e.preventDefault();
          dialogRef.current?.showModal();
        }}
        className={triggerClassName}
      >
        Contact
      </a>

      <dialog
        ref={dialogRef}
        aria-labelledby="contact-dialog-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-white/10 bg-neutral-950/80 p-6 backdrop-blur-xl backdrop:bg-black/70 open:block sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="contact-dialog-title"
            className="text-xl font-bold text-white sm:text-2xl"
          >
            Get in touch
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

        <ul className="mt-6 space-y-2">
          {channels.map((c) => (
            <li key={c.label}>
              {c.name === "Email" ? (
                <button
                  type="button"
                  onClick={() => copy(c.value)}
                  className="group flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <Icon name={c.name} className="size-5 text-accent" />
                  <span className="min-w-0">
                    <span className="block text-xs text-white/45">
                      {c.label}
                    </span>
                    <span className="block truncate text-sm text-white">
                      {c.value}
                    </span>
                  </span>
                </button>
              ) : (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <Icon name={c.name} className="size-5 text-accent" />
                  <span className="min-w-0">
                    <span className="block text-xs text-white/45">
                      {c.label}
                    </span>
                    <span className="block truncate text-sm text-white">
                      {c.value}
                    </span>
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>

        <p
          aria-live="polite"
          className="mt-4 text-center text-xs text-white/45"
        >
          {copied ? "Copied to clipboard." : "Click the email to copy it."}
        </p>
      </dialog>
    </>
  );
}
