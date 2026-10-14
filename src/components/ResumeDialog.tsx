"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { site } from "@/content/site";

/**
 * Opens `/resume.pdf` in a modal instead of navigating. The trigger is
 * `children` plus a class rather than markup baked in here, which is what let
 * one dialog serve the nav bar's Resume pill and the Contact section's resume
 * row; that section is gone, so the pill is the only call site left.
 *
 * `"use client"` because it needs `<dialog>.showModal()`: that is what buys
 * the Escape key, the focus trap, and the inert background for free. The
 * trigger stays a real anchor to the PDF (DESIGN.md §4, rule 3), so without JS
 * it still opens the file; the handler only intercepts a plain left click.
 */
export default function ResumeDialog({
  children,
  triggerClassName,
}: {
  children: ReactNode;
  triggerClassName: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // `showModal()` doesn't stop the page behind it from scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function openDialog(e: React.MouseEvent<HTMLAnchorElement>) {
    // Leave modified clicks alone — cmd-click should still open the raw PDF.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
      return;
    e.preventDefault();
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <a
        href={site.links.resume}
        onClick={openDialog}
        aria-haspopup="dialog"
        className={triggerClassName}
      >
        {children}
      </a>

      <dialog
        ref={dialogRef}
        aria-label={`${site.name} resume`}
        onClose={() => setOpen(false)}
        // Clicking the backdrop lands on the dialog element itself; every
        // click on the content stops at a child.
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
        className="m-auto h-[90dvh] w-[92vw] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 p-0 backdrop-blur-xl backdrop:bg-black/70 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
          <h2 className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
            Resume
          </h2>
          <div className="flex items-center gap-2">
            <a
              href={site.links.resume}
              download="Jake-Recharte-Resume.pdf"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/75 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
            >
              Download
            </a>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close resume"
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
        </div>

        {/* Mounted only while open so a visitor who never asks for the resume
            never downloads it. */}
        {open && (
          <iframe
            src={`${site.links.resume}#view=FitH`}
            title={`${site.name} resume`}
            className="min-h-0 w-full flex-1 bg-white"
          />
        )}
      </dialog>
    </>
  );
}
