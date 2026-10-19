"use client";

import { useState } from "react";
import Icon from "../Icon";

/**
 * Clearline: the team's own dispatch board, replaying the Palisades Fire.
 *
 * Not a reimplementation: this is the `web/` app from the USC Dual Hacks repo,
 * built from the latest commit on main by `scripts/build-usc-dual-hacks.sh`. The
 * board, its map and the scenario engine that drives it are the team's code.
 *
 * The real app is a Next.js server with a database and a phone line behind it,
 * and this site runs no servers, so the build is a static export with the
 * board's data source swapped for the household list it would have been
 * streamed. It opens on the board's Scenario mode, which is a layer over that
 * list and writes nothing anywhere. Everything the board shows in it is
 * simulated, says so in a banner it won't let you close, and the demo's `note`
 * says so again.
 *
 * Two things still come from outside this repo, and both degrade rather than
 * break: the basemap tiles and glyphs (OpenFreeMap, keyless) and the board's
 * two typefaces (Google Fonts). With the network down the perimeter, the
 * households and the fire still draw, because they come from local data.
 *
 * The project is Clearline. The repo and the board's own header still say Line,
 * which is the team's code and is left as it was.
 *
 * The board is a dashboard, so it needs room. At the dialog's full width it is
 * past the 1024px its desktop layout starts at; on a phone it falls back to
 * its own stacked layout, which works but is not the one to judge it by. The
 * poster says so before the click rather than after, and the frame goes
 * portrait below `sm:` because a stacked page scrolls down, not across: at 4:3
 * a phone gets a 307x230 window onto it.
 */

/** The team's own build, from `scripts/build-usc-dual-hacks.sh`. */
const APP_URL = "/demos/usc-dual-hacks";

export default function ClearlineDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:aspect-[4/3]">
      {open ? (
        <iframe
          src={APP_URL}
          title="Clearline, the dispatch board replaying the Palisades Fire"
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex h-full w-full flex-col items-center justify-center gap-3 p-6 transition-colors hover:bg-white/[0.07]"
        >
          <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white transition group-hover:border-white/25 group-hover:bg-white/[0.07]">
            <Icon name="Play" className="size-4 text-accent" />
            Open the dispatch board
          </span>
          <span className="max-w-sm text-center font-mono text-xs text-white/35">
            About 3MB, mostly map tiles · built for a laptop screen
          </span>
          <span className="max-w-sm text-center font-mono text-[10px] text-white/25">
            Real map, simulated fire, calls and people
          </span>
        </button>
      )}
    </div>
  );
}
