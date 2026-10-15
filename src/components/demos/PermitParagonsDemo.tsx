"use client";

import { useState } from "react";
import Icon from "../Icon";

/**
 * Permit Paragons: the team's own frontend, as it stood at the hackathon.
 *
 * Not a reimplementation: this is their `frontend/` built from commit
 * `ed392b2` (2026-08-21), the last before the October restyle that moved the
 * app onto a teammate's warm-paper editorial theme. That restyle is a fine
 * piece of work and belongs on his site; this is the version the judges saw
 * and the one Jake's own commits are in, and its dark CartoDB basemap is the
 * one that belongs here.
 *
 * Self-hosted rather than framed from their CloudFront, so the demo no longer
 * dies if that distribution is torn down. Two things still come from the
 * team's AWS: the 77MB PMTiles archive of real parcel geometry (streamed a
 * viewport at a time over range requests, and served
 * `Access-Control-Allow-Origin: *`) and the parcel API, which sends no CORS
 * header and is therefore proxied server-side in `next.config.ts`.
 *
 * One thing had to change to make the old version work at all: CARTO's
 * keyless basemap tiles are now gated and print "API KEY REQUIRED" across
 * the map. `scripts/build-permit-paragons.sh` swaps in OpenFreeMap, the same
 * basemap the project itself moved to in October, and takes nothing else
 * from that commit.
 *
 * The RAG chat does not work here: it runs over a WebSocket, which the proxy
 * does not forward. The map, the filters and the parcel dashboard do.
 */

/** Their own build, from `scripts/build-permit-paragons.sh`. */
const APP_URL = "/demos/permit-paragons";

/** The team's live deployment, which is the restyled version. */
const UPSTREAM_URL = "https://d1xtsrdl1l82x1.cloudfront.net";

export default function PermitParagonsDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {open ? (
          <iframe
            src={APP_URL}
            title="Permit Paragons, the live application"
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
              Open the live map
            </span>
            <span className="max-w-sm text-center font-mono text-xs text-white/35">
              393,755 real parcels, streamed a viewport at a time
            </span>
            <span className="max-w-sm text-center font-mono text-[10px] text-white/25">
              The hackathon build, not the team&rsquo;s current site
            </span>
          </button>
        )}
      </div>

      <a
        href={UPSTREAM_URL}
        target="_blank"
        rel="noreferrer"
        className="group mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:border-white/25 hover:bg-white/[0.07]"
      >
        Open the team&rsquo;s current version
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-4 shrink-0 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </a>
    </div>
  );
}
