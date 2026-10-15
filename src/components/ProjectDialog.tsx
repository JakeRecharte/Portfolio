"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Project } from "@/content/projects";
import ArrowLink from "./ArrowLink";
import ProjectDemo from "./demos/ProjectDemo";

/**
 * One project's dialog, plus the trigger that opens it.
 *
 * The trigger is `children` and a class rather than markup baked in here,
 * the pattern DESIGN.md §4 rule 4 sets for `ResumeDialog` and `ContactDialog`.
 * That is what lets one component serve both the checkerboard tiles
 * ([ProjectBoard](./ProjectBoard.tsx)) and the featured cards
 * ([Sections](./Sections.tsx)) without either of them becoming a client
 * component or duplicating the write-up markup.
 *
 * The trigger stays a real anchor to wherever the project lives, with the
 * handler intercepting only a plain left click, so middle-click, cmd-click
 * and a visitor without JS all still get somewhere. A project with no public
 * link has no honest destination and falls back to a button.
 */
export default function ProjectDialog({
  project,
  className,
  children,
  label,
}: {
  project: Project;
  className: string;
  children: ReactNode;
  /** Accessible name for the trigger; its contents are too long to serve. */
  label: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // `showModal()` doesn't stop the page behind it from scrolling, and a demo
  // dialog is tall enough that the page moving underneath it is obvious.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const href = project.liveUrl ?? project.devpostUrl ?? project.repoUrl;

  function openDialog() {
    setOpen(true);
    // The content has to be in the DOM before `showModal`, or the dialog
    // opens empty for a frame.
    requestAnimationFrame(() => dialogRef.current?.showModal());
  }

  const trigger = href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-haspopup="dialog"
      aria-label={label}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        openDialog();
      }}
      className={className}
    >
      {children}
    </a>
  ) : (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={label}
      onClick={openDialog}
      className={className}
    >
      {children}
    </button>
  );

  // A demo needs the resume viewer's full-bleed size; a write-up sizes to its
  // own content at the narrower width (DESIGN.md §2.3).
  const size = project.demo
    ? "h-[90dvh] w-[92vw] max-w-6xl"
    : "max-h-[90dvh] w-[min(92vw,32rem)]";

  return (
    <>
      {trigger}
      <dialog
        ref={dialogRef}
        aria-labelledby={`project-dialog-${project.slug}`}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className={`m-auto overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 p-0 backdrop-blur-xl backdrop:bg-black/70 open:flex open:flex-col ${size}`}
      >
        {/* Mounted only while open, so a demo never boots behind a closed
            dialog and five tiles don't each hold a live Pyodide. */}
        {open && (
          <Detail
            project={project}
            onClose={() => dialogRef.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}

/**
 * The dialog's contents. A pinned header bar on the resume viewer's recipe,
 * then one scrolling body: the demo takes two of three columns at `lg:` and
 * the write-up rides alongside it, or the write-up is the whole thing for a
 * project with nothing to run.
 */
function Detail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const links = [
    project.liveUrl && { label: "View it live", href: project.liveUrl },
    project.devpostUrl && {
      label: "Read the Devpost",
      href: project.devpostUrl,
    },
    project.repoUrl && { label: "View the repo", href: project.repoUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l));

  const demo = project.demo;
  // Every board project has `detail`; the fallback keeps a new one from
  // opening an empty dialog before its write-up is written.
  const paragraphs = project.detail ?? [project.blurb];

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
        <h2
          id={`project-dialog-${project.slug}`}
          className="truncate text-lg font-bold text-white sm:text-xl"
        >
          {project.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-white/75 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
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

      <div
        className={`min-h-0 flex-1 overflow-y-auto p-6 sm:p-8 ${
          demo && !demo.wide ? "lg:grid lg:grid-cols-3 lg:gap-8" : ""
        }`}
      >
        {demo && (
          <section className={demo.wide ? "" : "lg:col-span-2"}>
            <h3 className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
              {demo.label}
            </h3>
            <div className="mt-5">
              <ProjectDemo demo={demo.key} />
            </div>
          </section>
        )}

        <div className={demo ? (demo.wide ? "mt-10" : "mt-10 lg:mt-0") : ""}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-white/35">
            {project.period}
            <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/55">
              {project.kind}
            </span>
            {project.status && (
              <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/55">
                {project.status}
              </span>
            )}
          </p>

          <div className="mt-5 max-w-lg space-y-4">
            {paragraphs.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-white/55">
                {p}
              </p>
            ))}
          </div>

          {project.tech && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/55"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          {demo && (
            <section className="mt-10">
              <h3 className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
                How to read it
              </h3>
              <ol className="mt-5 max-w-lg space-y-2">
                {demo.guide.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm leading-relaxed text-white/55"
                  >
                    <span className="shrink-0 font-mono text-xs text-white/35">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              {demo.note && (
                <p className="mt-5 max-w-lg text-xs leading-relaxed text-white/35">
                  {demo.note}
                </p>
              )}
            </section>
          )}

          {links.length > 0 ? (
            <ul className="mt-6 space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:border-white/25 hover:bg-white/[0.07]"
                  >
                    {l.label}
                    <ArrowLink className="text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            // CONTENT.md §4: no public repo was found for this one. Saying so is
            // better than a dead link or a tile that quietly does nothing.
            <p className="mt-6 font-mono text-xs text-white/35">
              No public repo.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
