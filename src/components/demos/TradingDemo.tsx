"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * The AI Trading Model, running in the visitor's browser.
 *
 * `scripts/export-trading-demo.py` retrains the repo's random forest (same
 * universe, same five features, same 21-day horizon, same seed) and writes it
 * out as flat arrays. Walking 200 depth-8 trees is a few million operations,
 * which is milliseconds of JavaScript, so there is no Python host here, no API
 * key and no cold start: two static JSON files and a `while` loop.
 *
 * Both files are fetched on mount rather than imported, so the ~2MB forest
 * stays out of the page bundle and is only paid for by a visitor who opens
 * this dialog.
 */

type Tree = {
  /** Split feature per node; negative marks a leaf. */
  f: number[];
  /** Split threshold per node. */
  t: number[];
  /** Right child per node. The left child is always `i + 1` (see the export). */
  r: number[];
  /** Leaf mean per node. */
  v: number[];
};

type Forest = {
  features: string[];
  horizon: number;
  topK: number;
  windows: { short: number; mid: number; long: number };
  trees: Tree[];
};

type Prices = {
  dates: string[];
  tickers: string[];
  /** One close series per ticker, aligned to `dates`. */
  closes: number[][];
  firstTestDate: string;
  leadIn: number;
  backtest: {
    strategy: number;
    universe: number;
    edge: number;
    horizons: number;
  };
};

type Pick = { ticker: string; predicted: number; realized: number };

type Day = {
  date: string;
  picks: Pick[];
  /** Mean realized return of the top-K picks. */
  strategy: number;
  /** Mean realized return of the whole universe, the thing to beat. */
  universe: number;
};

/** Dates evaluated per chunk, so the progress bar actually moves. */
const CHUNK = 40;

/**
 * One tree walk. sklearn's rule is `x[feature] <= threshold → left`, and
 * because the exporter asserts the tree is stored depth-first, "left" is the
 * next node in the array.
 */
function walk(tree: Tree, x: number[]): number {
  let i = 0;
  while (tree.f[i] >= 0) {
    i = x[tree.f[i]] <= tree.t[i] ? i + 1 : tree.r[i];
  }
  return tree.v[i];
}

function predict(forest: Forest, x: number[]): number {
  let sum = 0;
  for (const tree of forest.trees) sum += walk(tree, x);
  return sum / forest.trees.length;
}

/**
 * `features.make_features`, in TypeScript: three momentum returns, a rolling
 * volatility and price over its own long moving average. Built by name off
 * `forest.features` so the vector can never fall out of the order the model
 * was trained on.
 */
function featuresAt(
  closes: number[],
  d: number,
  names: string[],
  w: Forest["windows"],
): number[] {
  const ret = (n: number) => closes[d] / closes[d - n] - 1;

  // Sample standard deviation of the last `w.mid` daily returns, ddof=1 to
  // match pandas' `rolling().std()`.
  let mean = 0;
  for (let k = d - w.mid + 1; k <= d; k++)
    mean += closes[k] / closes[k - 1] - 1;
  mean /= w.mid;
  let sq = 0;
  for (let k = d - w.mid + 1; k <= d; k++) {
    const r = closes[k] / closes[k - 1] - 1 - mean;
    sq += r * r;
  }
  const vol = Math.sqrt(sq / (w.mid - 1));

  let sum = 0;
  for (let k = d - w.long + 1; k <= d; k++) sum += closes[k];

  const byName: Record<string, number> = {
    ret_5d: ret(w.short),
    ret_21d: ret(w.mid),
    ret_63d: ret(w.long),
    vol21d: vol,
    ma_ratio_63d: closes[d] / (sum / w.long),
  };
  return names.map((n) => byName[n]);
}

/** Every ticker ranked at one date, with what the picks actually went on to do. */
function evaluate(forest: Forest, prices: Prices, d: number): Day {
  const h = forest.horizon;
  const rows: Pick[] = prices.tickers.map((ticker, c) => {
    const closes = prices.closes[c];
    return {
      ticker,
      predicted: predict(
        forest,
        featuresAt(closes, d, forest.features, forest.windows),
      ),
      realized: closes[d + h] / closes[d] - 1,
    };
  });

  const ranked = [...rows].sort((a, b) => b.predicted - a.predicted);
  const picks = ranked.slice(0, forest.topK);
  const mean = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / xs.length;

  return {
    date: prices.dates[d],
    picks,
    strategy: mean(picks.map((p) => p.realized)),
    universe: mean(rows.map((r) => r.realized)),
  };
}

const pct = (v: number) =>
  `${v >= 0 ? "+" : "−"}${Math.abs(v * 100).toFixed(2)}%`;

export default function TradingDemo() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [at, setAt] = useState(0);
  /** The horizon the forest was trained on, kept for the caption. */
  const [horizon, setHorizon] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    async function run() {
      let forest: Forest;
      let prices: Prices;
      try {
        const [f, p] = await Promise.all([
          fetch("/demos/trading-forest.json"),
          fetch("/demos/trading-prices.json"),
        ]);
        if (!f.ok || !p.ok) throw new Error("fetch failed");
        [forest, prices] = (await Promise.all([f.json(), p.json()])) as [
          Forest,
          Prices,
        ];
      } catch {
        if (!cancelled) setError("The model files could not be loaded.");
        return;
      }
      if (cancelled) return;

      // The window carries `leadIn` days of history so the first date has its
      // 63-day features, and `horizon` days of tail so the last one has a
      // realized return to compare against.
      const first = prices.leadIn;
      const last = prices.dates.length - 1 - forest.horizon;
      const out: Day[] = [];

      // Chunked so the whole backtest, a few hundred million operations,
      // never blocks the dialog for more than a frame at a time. `setTimeout`
      // rather than `requestAnimationFrame`: rAF stops entirely while a tab is
      // in the background, which would strand the run at whatever percent it
      // had reached when the visitor switched away.
      function step() {
        if (cancelled) return;
        const until = Math.min(first + out.length + CHUNK, last + 1);
        for (let d = first + out.length; d < until; d++) {
          out.push(evaluate(forest, prices, d));
        }
        setProgress((out.length / (last + 1 - first)) * 100);
        if (first + out.length <= last) {
          timer = window.setTimeout(step, 0);
        } else {
          setDays(out);
          setHorizon(forest.horizon);
          setAt(out.length - 1);
        }
      }
      timer = window.setTimeout(step, 0);
    }

    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const summary = useMemo(() => {
    if (!days) return null;
    const mean = (pick: (d: Day) => number) =>
      days.reduce((s, d) => s + pick(d), 0) / days.length;
    const strategy = mean((d) => d.strategy);
    const universe = mean((d) => d.universe);
    const wins = days.filter((d) => d.strategy > d.universe).length;
    return { strategy, universe, edge: strategy - universe, wins };
  }, [days]);

  const chart = useMemo(() => {
    if (!days) return null;
    const values = days.flatMap((d) => [d.strategy, d.universe]);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const x = (i: number) => (i / (days.length - 1)) * 600;
    const y = (v: number) => 180 - ((v - lo) / (hi - lo)) * 180;
    const path = (pick: (d: Day) => number) =>
      days
        .map(
          (d, i) =>
            `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(pick(d)).toFixed(1)}`,
        )
        .join("");
    return {
      lo,
      hi,
      zero: lo < 0 && hi > 0 ? y(0) : null,
      strategy: path((d) => d.strategy),
      universe: path((d) => d.universe),
    };
  }, [days]);

  if (error) {
    return (
      <p className="text-sm leading-relaxed text-white/55">
        {error} The model and the pipeline it came from are in the repo below.
      </p>
    );
  }

  if (!days || !summary || !chart) {
    return (
      <div>
        <p className="font-mono text-xs text-white/35">
          {progress > 0
            ? `Running the forest over the test set… ${Math.round(progress)}%`
            : "Loading the trained forest…"}
        </p>
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full bg-accent transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  const day = days[at];

  return (
    <div>
      {/* Legend: two series, so identity is carried by a named swatch rather
          than by color alone (and the readout below names them again). */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/35">
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-3 rounded-[2px] bg-accent" />
          Model picks
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-3 rounded-[2px] bg-white/55" />
          Universe average
        </li>
      </ul>

      {/* The y labels are HTML, not SVG text: the plot is stretched to the
          container with `preserveAspectRatio="none"`, which would skew any
          glyph inside it. The strokes survive it via `non-scaling-stroke`. */}
      <figure className="m-0 mt-3">
        {/* The axis labels live in a left gutter rather than over the plot:
            at `left-0` on the figure itself they landed on the first data
            points and on the caption. */}
        <div className="relative pl-12">
          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="h-40 w-full sm:h-48"
          >
            {chart.zero !== null && (
              <line
                x1="0"
                x2="600"
                y1={chart.zero}
                y2={chart.zero}
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="text-white/10"
              />
            )}
            <line
              x1={(at / (days.length - 1)) * 600}
              x2={(at / (days.length - 1)) * 600}
              y1="0"
              y2="180"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="text-white/25"
            />
            <path
              d={chart.universe}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="text-white/55"
            />
            <path
              d={chart.strategy}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="text-accent"
            />
          </svg>
          <span className="absolute top-0 left-0 font-mono text-[9px] text-white/35">
            {pct(chart.hi)}
          </span>
          <span className="absolute bottom-0 left-0 font-mono text-[9px] text-white/35">
            {pct(chart.lo)}
          </span>
        </div>
        <figcaption className="mt-2 text-[11px] text-white/35">
          Realized {horizon}-day return at each of the {days.length} dates in
          the test set.
        </figcaption>
      </figure>

      <label className="mt-5 block">
        <span className="flex items-baseline justify-between gap-3 font-mono text-xs text-white/35">
          Prediction date
          <span className="text-white">{day.date}</span>
        </span>
        <input
          type="range"
          min={0}
          max={days.length - 1}
          value={at}
          aria-label="Prediction date"
          aria-valuetext={day.date}
          onChange={(e) => {
            setAt(Number(e.target.value));
          }}
          className="mt-2 w-full accent-accent"
        />
      </label>

      {/* Rows, not boxes (DESIGN.md §2.3). Sign and the explicit +/− carry
          direction, since the palette has one accent and no red/green
          pair. */}
      <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
        <li className="flex items-center gap-3 py-2 font-mono text-[10px] tracking-wider text-white/35 uppercase">
          <span className="flex-1">Pick</span>
          <span className="w-20 text-right">Predicted</span>
          <span className="w-20 text-right">Realized</span>
        </li>
        {day.picks.map((p) => (
          <li
            key={p.ticker}
            className="flex items-center gap-3 py-2 font-mono text-xs"
          >
            <span className="flex-1 text-white">{p.ticker}</span>
            <span className="w-20 text-right text-white/55">
              {pct(p.predicted)}
            </span>
            <span className="w-20 text-right text-white">
              {pct(p.realized)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        {[
          { label: "Picks, this date", value: pct(day.strategy) },
          { label: "Universe, this date", value: pct(day.universe) },
          { label: "Edge, averaged", value: pct(summary.edge) },
          {
            label: "Dates it won",
            value: `${summary.wins} of ${days.length}`,
          },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="text-[11px] tracking-widest text-white/45 uppercase">
              {stat.label}
            </dt>
            <dd className="mt-1 font-mono text-sm text-white tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
