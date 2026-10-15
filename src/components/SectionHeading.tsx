/**
 * Two-tone display heading: first line solid, second line dropped back so it
 * reads as depth rather than as a second sentence.
 *
 * Two sizes, because there are two jobs (DESIGN.md §2.5). `hero` is the one
 * step larger that a page's own title gets (the homepage's `ACTUALLY
 * FINISHED` and the art page's), and `section` is every heading inside a page.
 * They were hand-rolled copies of each other until 2026-10-14, which is the
 * drift DESIGN.md §6 had open: one of them was always going to be edited
 * without the other.
 *
 * `as` exists for the same reason. A section heading is an `<h2>`; a page that
 * has no `Header` above it, which is to say the art page, needs its display
 * heading to be the document's one `<h1>` instead (DESIGN.md §3, "Semantics
 * are part of the design").
 */
const sizes = {
  hero: "text-6xl sm:text-7xl lg:text-8xl",
  section: "text-5xl sm:text-6xl lg:text-7xl",
} as const;

export default function SectionHeading({
  lines,
  id,
  size = "section",
  as: Tag = "h2",
}: {
  lines: readonly [string, string];
  id?: string;
  size?: keyof typeof sizes;
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      id={id}
      className={`${sizes[size]} leading-[0.85] font-black tracking-tighter uppercase`}
    >
      <span className="block text-white">{lines[0]}</span>
      <span className="block text-white/20">{lines[1]}</span>
    </Tag>
  );
}
