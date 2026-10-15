#!/usr/bin/env bash
#
# Build the Permit Paragons frontend into public/demos/permit-paragons/.
#
# This is the team's own application, not a reimplementation: their
# `frontend/` built from the commit below. It is pinned to the state at the
# end of the hackathon, before the October restyle moved the app onto a
# teammate's warm-paper editorial theme. That restyle is his and belongs on
# his site; this is the version the judges saw, the one Jake's commits are
# in, and the one whose dark palette suits this site.
#
# Self-hosting it rather than framing their CloudFront means the demo does
# not die if that distribution is torn down. Two things still come from the
# team's AWS and cannot be vendored sensibly:
#
#   * the 77MB PMTiles archive of real parcel geometry, streamed a viewport
#     at a time over range requests, and served Access-Control-Allow-Origin: *
#   * the parcel API, which sends no CORS header and is therefore proxied
#     server-side in next.config.ts rather than called cross-origin
#
# Three patches are applied to their source, all deployment concerns rather
# than changes to the work:
#
#   1. `--base` so the bundle's assets resolve under /demos/permit-paragons/
#   2. a router `basename`, because react-router otherwise matches no route
#      when the app is served from a subpath (BASE_URL's trailing slash does
#      not work here, but the literal path does)
#   3. the basemap, because CARTO's keyless tiles are now gated and render
#      "API KEY REQUIRED" across the map. This takes the one change the
#      project itself made in October, OpenFreeMap, and nothing else from
#      that commit.
#
#   ./scripts/build-permit-paragons.sh
#
# Requires node and network. Takes a couple of minutes, mostly npm install.

set -euo pipefail

REPO="https://github.com/BrandonGarate177/BFFG-SD-HACKS.git"
COMMIT="ed392b20b"          # 2026-08-21, last commit before the restyle
BASE="/demos/permit-paragons"
TILES="https://d1xtsrdl1l82x1.cloudfront.net/tiles/parcels.pmtiles"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public${BASE}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "Cloning $REPO at $COMMIT"
git clone -q --filter=blob:none "$REPO" "$WORK/src"
git -C "$WORK/src" checkout -q "$COMMIT"

APP="$WORK/src/frontend/src/app/App.tsx"
MAP="$WORK/src/frontend/src/features/map/lib/map.ts"

# 2. Router basename.
if ! grep -q '<BrowserRouter>' "$APP"; then
  echo "App.tsx no longer has a bare <BrowserRouter>, check the patch" >&2
  exit 1
fi
sed -i '' "s|<BrowserRouter>|<BrowserRouter basename=\"$BASE\">|" "$APP"

# 3. Basemap.
if ! grep -q 'basemaps.cartocdn.com' "$MAP"; then
  echo "map.ts no longer points at CARTO, check the patch" >&2
  exit 1
fi
sed -i '' 's|    style: BASE_STYLE,|    style: "https://tiles.openfreemap.org/styles/dark",|' "$MAP"
sed -i '' 's|^const BASE_STYLE: StyleSpecification = {|export const BASE_STYLE: StyleSpecification = {|' "$MAP"

echo "Installing and building"
cd "$WORK/src/frontend"
npm install --silent
VITE_TILES_URL="$TILES" VITE_API_BASE="$BASE/api" npx vite build --base="$BASE/"

rm -rf "$OUT"
mkdir -p "$OUT"
cp -R dist/. "$OUT/"

# Their repo ships a 73MB parcels.pmtiles in frontend/public for local dev.
# The build points at the hosted archive, so this copy is dead weight.
rm -f "$OUT/parcels.pmtiles"

echo
echo "Built -> $OUT  ($(du -sh "$OUT" | cut -f1))"
echo "Serving needs the rewrites in next.config.ts (API proxy + SPA entry)."
