import data from "@/content/contributions.json";
import { site } from "@/content/site";
import ArrowLink from "./ArrowLink";

/** Level 0-4 as GitHub grades it, recolored to the site's accent. */
const levelClass = [
  "bg-white/[0.07]",
  "bg-accent/35",
  "bg-accent/55",
  "bg-accent/80",
  "bg-accent",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * How much history the header shows. The JSON holds a full year, so widening
 * this back out is a one-line change — no re-fetch.
 */
const MONTHS_SHOWN = 6;

/**
 * Grid metrics, in px. Shared by the cells and the month labels so the two
 * can't drift apart — `PITCH` is one column plus its gap.
 */
const CELL = 17;
const GAP = 3;
const GUTTER = 26;
const PITCH = CELL + GAP;

/** Parsed as UTC so the weekday never shifts with the viewer's timezone. */
function utc(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

/**
 * The trailing `MONTHS_SHOWN` months, snapped back to the Sunday that starts
 * the week — otherwise the first column would be a part-week stub.
 */
function recentDays(days: typeof data.days) {
  const cutoff = utc(days[days.length - 1].date);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - MONTHS_SHOWN);
  cutoff.setUTCDate(cutoff.getUTCDate() - cutoff.getUTCDay());

  const from = cutoff.toISOString().slice(0, 10);
  return days.filter((d) => d.date >= from);
}

type Cell = { date: string; level: number; count: number } | null;

/**
 * Splits the flat day list into Sunday-first columns, padding the first week so
 * the opening day lands on its real weekday row.
 */
function toWeeks(days: typeof data.days): Cell[][] {
  const weeks: Cell[][] = [];
  let week: Cell[] = Array<Cell>(utc(days[0].date).getUTCDay()).fill(null);

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    weeks.push([...week, ...Array<Cell>(7 - week.length).fill(null)]);
  }
  return weeks;
}

/**
 * One label per month, placed on the first week that month appears in. The
 * label spans to the next month's column so it sits over its own block.
 */
function monthLabels(weeks: Cell[][]) {
  const labels: { week: number; label: string }[] = [];
  let last = -1;

  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = utc(first.date).getUTCMonth();
    // Skip a stub first column — its label would collide with the next one.
    if (month !== last && (i > 0 || week[0])) {
      labels.push({ week: i, label: MONTHS[month] });
      last = month;
    }
  });
  return labels;
}

/**
 * Jake's real public contribution calendar, scraped at author time by
 * `npm run contributions` into `src/content/contributions.json`. Rendered on
 * the server — no client JS, no GitHub request from the visitor's browser.
 */
export default function ContributionGraph() {
  const days = recentDays(data.days);
  const weeks = toWeeks(days);
  const labels = monthLabels(weeks);
  // Counted over the window actually drawn, not the full year in the JSON.
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const since = utc(days[0].date);
  const caption = `${total} GitHub contributions since ${MONTHS[since.getUTCMonth()]} ${since.getUTCFullYear()}`;

  return (
    <figure className="m-0">
      {/* The whole graph is one link to the profile it was scraped from. The
          anchor carries the accessible name, so everything inside it — the
          grid and the visible caption — is hidden from the a11y tree to keep
          the caption from being announced twice. */}
      <a
        href={site.links.github}
        target="_blank"
        rel="noreferrer"
        aria-label={`${caption}. View the profile on GitHub.`}
        className="group block"
      >
        <div
          className="[scrollbar-width:none] overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-hidden="true"
        >
          <div className="w-max">
            {/* Month labels sit above the cell area, so they clear the gutter.
              Offset in px off the same PITCH the grid uses — a percentage
              would drift, since the grid is its own intrinsic width. */}
            <div
              className="relative mb-1 h-[10px]"
              style={{ marginLeft: GUTTER + GAP }}
            >
              {labels.map(({ week, label }) => (
                <span
                  key={label + week}
                  className="absolute top-0 text-[9px] leading-[10px] text-white/35"
                  style={{ left: week * PITCH }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* One grid for the weekday gutter and the cells, so the Mon/Wed/Fri
              labels stay on their rows. Column-major fill: the 7 labels form
              the first column, then a column per week. */}
            <div
              className="grid grid-flow-col grid-rows-7"
              style={{
                gap: GAP,
                gridTemplateColumns: `${GUTTER}px repeat(${weeks.length}, ${CELL}px)`,
              }}
            >
              {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                <span
                  key={`day-${i}`}
                  className="self-center text-[9px] leading-[10px] text-white/35"
                >
                  {d}
                </span>
              ))}

              {weeks
                .flat()
                .map((cell, i) =>
                  cell ? (
                    <span
                      key={cell.date}
                      title={`${cell.count} on ${cell.date}`}
                      className={`aspect-square w-full rounded-[2px] ${levelClass[cell.level]}`}
                    />
                  ) : (
                    <span key={`pad-${i}`} className="aspect-square w-full" />
                  ),
                )}
            </div>
          </div>
        </div>

        <figcaption
          className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35 transition-colors group-hover:text-white"
          aria-hidden="true"
        >
          {caption}
          <ArrowLink className="size-3.5 text-accent" />
        </figcaption>
      </a>
    </figure>
  );
}
