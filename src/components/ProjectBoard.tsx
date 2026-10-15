import type { Project } from "@/content/projects";
import ArrowLink from "./ArrowLink";
import Reveal from "./Reveal";
import ProjectDialog from "./ProjectDialog";

/**
 * The additional projects, as a checkerboard: square tiles three across,
 * alternating between a filled cell and one left open to the fog, divided by
 * the same hairline as every other list on the site.
 *
 * This stays a server component: each tile hands its markup to
 * [ProjectDialog](./ProjectDialog.tsx) as a trigger, and that client
 * component owns the dialog (DESIGN.md §4, rule 4). The content stays in
 * `src/content/projects.ts`; this file only arranges it.
 *
 * Three columns is what makes the checker work: with an odd column count,
 * `i % 2` alone alternates both across a row and between rows, so no row/column
 * arithmetic is needed. Changing to an even column count would turn the board
 * into vertical stripes.
 *
 * A square grid only reads as a board if the board is full, so the last row is
 * padded with inert cells that carry the pattern and nothing else.
 *
 * The tile carries the blurb and the tech chips from `sm:` up (DESIGN.md §2.3)
 * so the board is readable without opening anything. The dialog is therefore
 * not a way to see the same facts again. It is where the demo, the longer
 * write-up and the guide live.
 */
const COLUMNS = 3;

export default function ProjectBoard({ projects }: { projects: Project[] }) {
  const filler = (COLUMNS - (projects.length % COLUMNS)) % COLUMNS;

  return (
    /* The grid draws its own top and left edge; every cell draws its right
       and bottom. Collapsing them this way keeps each rule 1px instead of
       the 2px a `gap` plus per-cell borders would give, and leaves the
       unfilled cells genuinely transparent so the fog shows through. */
    <ul className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border-t border-l border-white/10">
      {projects.map((p, i) => (
        <Reveal key={p.slug} delay={i * 0.04} className="aspect-square">
          <li
            className={`h-full border-r border-b border-white/10 ${
              i % 2 === 0 ? "bg-white/[0.04]" : ""
            }`}
          >
            <Tile project={p} />
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
  );
}

/**
 * One square. It is an anchor to the project's own URL wherever there is one,
 * with the click intercepted (DESIGN.md §4, rule 3) so the dialog is an
 * enhancement rather than the only way in: middle-click, cmd-click and a
 * visitor without JS all still reach the repo. A project with no public link
 * has no honest destination, so there it falls back to a button.
 *
 * The anchor takes an explicit `aria-label` because its contents are now a
 * paragraph and a chip list: left to compute its own name it would announce
 * the whole tile as one 200-character link.
 */
function Tile({ project }: { project: Project }) {
  const shell =
    "group flex h-full w-full flex-col justify-between p-3 text-left transition-colors hover:bg-white/[0.07] sm:p-5";

  return (
    <ProjectDialog
      project={project}
      className={shell}
      label={`${project.title}, ${project.period}. Open details${
        project.demo ? " and demo" : ""
      }.`}
    >
      <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-white/35 sm:text-xs">
        {project.period}
        {/* One chip per tile, and it is always `kind`: the chip says what the
            thing *is*, never where it is in its life. That is the same axis
            rule the header's "Now" rail follows (CONTENT.md §5), and mixing
            the two is what made a hackathon read as "UPCOMING" rather than a
            hackathon. Nothing is lost on the tile, because `period` already
            carries the state in words: "Upcoming", "Sep 2026 - Now". The
            dialog shows both chips. The chip needs more width than a third of
            a phone screen has, so below `lg:` it is `period` alone. */}
        <span className="hidden rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/55 lg:inline-block">
          {project.kind}
        </span>
      </p>

      {/* The wrapper owns the hiding and the paragraph owns the clamp on
          purpose: `hidden` and `line-clamp-*` both set `display`, so on one
          element which wins depends on stylesheet order. A third of a phone
          screen is about 100px, too narrow for prose at any clamp, so the
          blurb starts at `sm:`, three lines of it, and opens up to five once
          a cell is wide enough to fit ~50 characters a line. */}
      <div className="mt-3 hidden min-h-0 flex-1 sm:block">
        <p className="line-clamp-3 text-xs leading-relaxed text-white/55 lg:line-clamp-5 lg:text-sm">
          {project.blurb}
        </p>
      </div>

      {project.tech && (
        <ul className="mt-3 hidden flex-wrap gap-2 lg:flex">
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

      <span className="mt-3 flex items-end justify-between gap-2">
        <span className="text-sm leading-tight font-bold text-white sm:text-base lg:text-lg">
          {project.title}
        </span>
        <ArrowLink className="size-4 text-accent sm:size-5" />
      </span>
    </ProjectDialog>
  );
}
