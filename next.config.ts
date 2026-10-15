import type { NextConfig } from "next";

/**
 * The Permit Paragons demo is the team's own frontend, built from the commit
 * before its October restyle and served from `public/demos/permit-paragons/`.
 * Its parcel dashboard calls the team's API, which answers fine but sends no
 * `Access-Control-Allow-Origin`, so the browser would block it cross-origin.
 *
 * Proxying it keeps the call same-origin from the browser's point of view and
 * lets the server do the cross-origin fetch, where CORS does not apply. The
 * vector tiles need no proxy, since that bucket already sends
 * `Access-Control-Allow-Origin: *` and answers range requests, which is what
 * PMTiles needs to stream 77MB of parcels a viewport at a time.
 *
 * This does not proxy WebSockets, so the demo's RAG chat does not work here;
 * the map, the filters and the parcel dashboard do.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/demos/permit-paragons/api/:path*",
        destination: "https://d1xtsrdl1l82x1.cloudfront.net/api/:path*",
      },
      // `public/` serves files, not directory indexes, so the app's entry
      // and its client-side routes both have to be pointed at index.html.
      // Only these exact shapes, since a catch-all here would swallow the
      // bundle's own asset requests.
      {
        source: "/demos/permit-paragons",
        destination: "/demos/permit-paragons/index.html",
      },
      {
        source: "/demos/permit-paragons/parcel/:path*",
        destination: "/demos/permit-paragons/index.html",
      },
    ];
  },
};

export default nextConfig;
