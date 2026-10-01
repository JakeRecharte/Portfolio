/**
 * Two-tone display heading: first line solid, second line dropped back so it
 * reads as depth rather than as a second sentence.
 */
export default function SectionHeading({
  lines,
  id,
}: {
  lines: readonly [string, string];
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="text-5xl leading-[0.85] font-black tracking-tighter uppercase sm:text-6xl lg:text-7xl"
    >
      <span className="block text-white">{lines[0]}</span>
      <span className="block text-white/20">{lines[1]}</span>
    </h2>
  );
}
