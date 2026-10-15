"use client";

import { useState } from "react";
import Icon from "../Icon";

/**
 * Apple Picker, the actual Unity project, compiled to WebAssembly.
 *
 * `scripts/build-apple-picker.sh` drives Unity in batch mode and drops the
 * build in `public/demos/apple-picker/`, so the site serves it as plain static
 * files — no Unity hosting, no account, nothing to keep alive.
 *
 * **It does not load until asked.** The build is tens of megabytes, and
 * starting that download just because a visitor opened the dialog would be
 * rude on a phone and wasteful on a laptop. So the pane is a poster with a
 * play control, and the `<iframe>` is only mounted on the click — which also
 * means the game cannot start making noise or eating a frame budget behind a
 * dialog nobody is looking at.
 */

/** `defaultScreenWidthWeb` / `defaultScreenHeightWeb` in the Unity project. */
const ASPECT = "aspect-[8/5]";

/** Transfer size of the build, from `scripts/build-apple-picker.sh`. */
const DOWNLOAD = "16 MB";

export default function ApplePickerDemo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`${ASPECT} w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]`}
    >
      {playing ? (
        <iframe
          src="/demos/apple-picker/index.html"
          title="Apple Picker, playable"
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group flex h-full w-full flex-col items-center justify-center gap-3 p-6 transition-colors hover:bg-white/[0.07]"
        >
          <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white transition group-hover:border-white/25 group-hover:bg-white/[0.07]">
            <Icon name="Play" className="size-4 text-accent" />
            Play it here
          </span>
          {/* Said up front rather than discovered: this is a real download,
              and on a phone there is nothing to aim the baskets with. */}
          <span className="text-center font-mono text-xs text-white/35">
            {DOWNLOAD} Unity build · needs a mouse or trackpad
          </span>
        </button>
      )}
    </div>
  );
}
