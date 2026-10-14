/**
 * Scrapes the public contribution calendar for site.links.github and writes it
 * to src/content/contributions.json.
 *
 * The JSON is committed so `next build` never depends on the network and the
 * page stays static. Re-run with `npm run contributions` to refresh it.
 *
 * GitHub ships no public API for the calendar — the GraphQL one needs a token,
 * so this reads the same HTML fragment the profile page renders.
 */
import { writeFile } from "node:fs/promises";

const USER = process.argv[2] ?? "JakeRecharte";
const OUT = new URL("../src/content/contributions.json", import.meta.url);

const res = await fetch(`https://github.com/users/${USER}/contributions`, {
  headers: { "x-requested-with": "XMLHttpRequest" },
});
if (!res.ok) {
  throw new Error(`GitHub returned ${res.status} for ${USER}`);
}
const html = await res.text();

// Each day is a <td> carrying its date and 0-4 intensity level. The count only
// exists in the matching <tool-tip>, keyed by the cell's id.
const counts = new Map();
for (const m of html.matchAll(
  /<tool-tip[^>]*\sfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g,
)) {
  const n = /^(\d+) contribution/.exec(m[2].trim());
  counts.set(m[1], n ? Number(n[1]) : 0);
}

const days = [];
for (const m of html.matchAll(
  /<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g,
)) {
  const tag = m[0];
  const date = /data-date="([^"]+)"/.exec(tag)?.[1];
  const level = /data-level="(\d)"/.exec(tag)?.[1];
  const id = /\sid="([^"]+)"/.exec(tag)?.[1];
  // Trailing cells past today carry no date; skip them.
  if (!date || level === undefined) continue;
  days.push({ date, level: Number(level), count: counts.get(id) ?? 0 });
}
days.sort((a, b) => a.date.localeCompare(b.date));

if (days.length === 0) {
  throw new Error("Parsed zero days — GitHub's markup probably changed.");
}

const data = {
  user: USER,
  fetchedAt: new Date().toISOString().slice(0, 10),
  total: days.reduce((sum, d) => sum + d.count, 0),
  days,
};
await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(
  `${days.length} days, ${data.total} contributions, ${days[0].date} to ${days.at(-1).date}`,
);
