"use client";

import type { DemoKey } from "@/content/projects";
import TradingDemo from "./TradingDemo";

/**
 * Maps a project's `demo` key to the thing that runs. One case per key in
 * `DemoKey`, so adding a demo is a content change plus a case here — the
 * dialog in [ProjectBoard](../ProjectBoard.tsx) doesn't need to know what any
 * particular demo is.
 */
export default function ProjectDemo({ demo }: { demo: DemoKey }) {
  if (demo === "ai-trading-model") return <TradingDemo />;
  return null;
}
