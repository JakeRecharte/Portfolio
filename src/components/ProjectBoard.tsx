"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import ArrowLink from "./ArrowLink";
import Reveal from "./Reveal";

/**
 * The additional projects, as a checkerboard: square tiles three across,
 * alternating between a filled cell and one left open to the fog, divided by
 * the same hairline as every other list on the site.
 *
 * `"use client"` (DESIGN.md §4, rule 4) because a tile opens a detail dialog
 * and the dialog needs to know which tile was clicked. The content stays in
 * `src/content/projects.ts`; this file only arranges it.
 *
 * Three columns is what makes the checker work: with an odd column count,
 * `i % 2` alone alternates both across a row and between rows, so no row/column
 * arithmetic is needed. Changing to an even column count would turn the board
 * into vertical stripes.
 *
 * A square grid only reads as a board if the board is full, so the last row is
 * padded with inert cells that carry the pattern and nothing else.
 */
const COLUMNS = 3;

export default function ProjectBoard({ projects }: { projects: Project[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  // `showModal()` has to run after the content is in the DOM, or the dialog
  // opens on the previous project for a frame.
  useEffect(() => {
    if (active) dialogRef.current?.showModal();
  }, [active]);

  const filler = (COLUMNS - (projects.length % COLUMNS)) % COLUMNS;

  return (
    <>
      {/* The grid draws its own top and left edge; every cell draws its right
          and bottom. Collapsing them this way keeps each rule 1px instead of
          the 2px a `gap` plus per-cell borders would give, and leaves the
          unfilled cells genuinely transparent so the fog shows through. */}
      <ul className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border-t border-l border-white/10">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.04} className="aspect-square">
            <li
              className={`h-full border-r border-b border-white/10 ${
                i % 2 === 0 ? "bg-white/[0.04]" : ""
              }`}
            >
              <Tile project={p} onOpen={() => setActive(p)} />
            </li>
          </Reveal>
        ))}

        {Array.from({ length: filler }, (_, n) => {
          const i = projects.length + n;
          return (
            <li
              key={`filler-${i}`}
              aria-hidden="true"
              className={`aspect-square border-r border-b border-white/10 ${
                i % 2 === 0 ? "bg-white/[0.04]" : ""
              }`}
            />
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="project-dialog-title"
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[min(92vw,32rem)] rounded-3xl border border-white/10 bg-neutral-950/80 p-6 backdrop-blur-xl backdrop:bg-black/70 open:block sm:p-8"
      >
        {active && (
          <Detail project={active} onClose={() => dialogRef.current?.close()} />
        )}
      </dialog>
    </>
  );
}

/**
 * One square. It is an anchor to the project's own URL wherever there is one,
 * with the click intercepted (DESIGN.md §4, rule 3) so the dialog is an
 * enhancement rather than the only way in — middle-click, cmd-click and a
 * visitor without JS all still reach the repo. A project with no public link
 * has no honest destination, so there it falls back to a button.
 */
function Tile({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const href = project.liveUrl ?? project.repoUrl;
  const shell =
    "group flex h-full w-full flex-col justify-between p-3 text-left transition-colors hover:bg-white/[0.07] sm:p-5";

  const body = (
    <>
      <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-white/35 sm:text-xs">
        {project.period}
        {/* The chip needs more width than a third of a phone screen has; the
            dialog carries it at every size. */}
        <span className="hidden rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/55 lg:inline-block">
          {project.kind}
        </span>
      </p>
      <span className="flex items-end justify-between gap-2">
        <span className="text-sm leading-tight font-bold text-white sm:text-base lg:text-lg">
          {project.title}
        </span>
        <ArrowLink className="size-4 text-accent sm:size-5" />
      </span>
    </>
  );

  // The handler is on both branches; only the anchor needs to suppress a
  // navigation first.
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-haspopup="dialog"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        onOpen();
      }}
      className={shell}
    >
      {body}
    </a>
  ) : (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onOpen}
      className={shell}
    >
      {body}
    </button>
  );
}

/** The dialog's contents: the full row that the square had no room for. */
function Detail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const links = [
    project.repoUrl && { label: "View the repo", href: project.repoUrl },
    project.liveUrl && { label: "View it live", href: project.liveUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l));

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="project-dialog-title"
            className="text-xl font-bold text-white sm:text-2xl"
          >
            {project.title}
          </h2>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-white/35">
            {project.period}
            <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/55">
              {project.kind}
            </span>
          </p>
        </div>
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

      <p className="mt-5 text-sm leading-relaxed text-white/55">
        {project.blurb}
      </p>

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
        <p className="mt-6 font-mono text-xs text-white/35">No public repo.</p>
      )}
    </>
  );
}
