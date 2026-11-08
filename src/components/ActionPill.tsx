/**
 * The "Live Demo" / "See More" label on a featured card and a board tile.
 * It replaced the `ArrowLink` there because both surfaces open the project
 * dialog, and a word says what the click will show where an arrow only said
 * "somewhere" (DESIGN.md §3).
 *
 * It is a `span`, not a button: it sits inside the dialog trigger, which is
 * already the anchor or button (DESIGN.md §4 rule 3), and nesting one
 * interactive element in another is invalid. The trigger carries `group`, so
 * hovering anywhere on the card lifts the pill.
 *
 * Geometry is the About button's pill recipe (§2.3); colour is the accent the
 * arrow used, outlined at the kind chip's `/40` and never filled (§2.1).
 */
export default function ActionPill({
  demo,
  className = "",
}: {
  demo: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-lg border border-accent/40 bg-white/[0.03] text-accent transition group-hover:border-accent group-hover:bg-white/[0.07] ${className}`}
    >
      {demo ? "Live Demo" : "See More"}
    </span>
  );
}
