/**
 * The art page (`/art`), which is the site's only route other than the
 * homepage.
 *
 * **Everything in here is a placeholder as of 2026-10-14.** CONTENT.md's hard
 * rule is that nothing about Jake gets invented, and the fact sheet has no §2
 * entry for his art at all — not the medium, not a title, not a year, not one
 * image file. So every string below starts `PLACEHOLDER` and every piece has
 * `src: null`, which renders an empty labelled frame instead of an image. That
 * is deliberately ugly: a plausible-sounding fake title is worse than a blank,
 * because a blank cannot end up in front of someone who asks about it
 * (CONTENT.md §9.3). The open ask is CONTENT.md §8 Q24.
 *
 * To make it real: replace `headline` and `intro`, drop the files into
 * `public/art/`, and rewrite `artPieces` — one entry per piece, newest first.
 * Nothing in `ArtGallery` or `src/app/art/page.tsx` needs to change.
 */

export type ArtPiece = {
  /** kebab-case and stable; it is the React key and a future deep-link slug. */
  slug: string;
  /** ≤ 40 chars — it sits under the piece at `text-sm` and wraps past that. */
  title: string;
  /** A year (`2026`) or a span (`2025 - 2026`). Mono, like every other date. */
  year: string;
  /** What it is made of: "Graphite on paper", "Digital", "Oil on canvas". */
  medium: string;
  /**
   * Path under `public/` — so `public/art/foo.jpg` is `"/art/foo.jpg"` — or
   * `null` while the piece has no file yet, which draws the placeholder frame.
   */
  src: string | null;
  /**
   * The file's real pixel dimensions. `next/image` needs them to reserve space
   * before the image loads, and the gallery needs the ratio to size the frame.
   * Read them off the file (`sips -g pixelWidth -g pixelHeight <file>` on a
   * Mac) rather than guessing — a wrong ratio makes the image jump on load.
   *
   * These are data, not design values, so they are exempt from DESIGN.md's
   * no-new-values rule for the same reason the Apple Picker poster's
   * `aspect-[8/5]` is (DESIGN.md §3).
   */
  width: number;
  height: number;
  /**
   * Real alt text, written as content and not `"artwork"` (CONTENT.md §7).
   * Describe what is in the picture, for someone who cannot see it.
   */
  alt: string;
};

/**
 * The page's own hero copy. Two lines, each ≤ 10 chars, rendered two-tone at
 * hero size — the same rules as `site.headline` (CONTENT.md §5).
 *
 * TODO: `ART`/`PORTFOLIO` restates the nav link that got the visitor here,
 * which DESIGN.md §2.5 says a heading this large has to beat. It is a
 * stand-in until Jake writes one.
 */
export const art = {
  headline: ["ART", "PORTFOLIO"] as const,
  intro:
    "PLACEHOLDER — one or two sentences about the work: what Jake makes, what he makes it with, and how long he has been at it. Same length as the homepage tagline, ~150-220 characters.",
} as const;

/**
 * Newest first. Six placeholders at six different aspect ratios, so the
 * masonry columns visibly stagger while the page is still empty — a set of
 * identical squares would hide the one thing this layout is for.
 */
export const artPieces: ArtPiece[] = [
  {
    slug: "placeholder-one",
    title: "PLACEHOLDER — first piece",
    year: "20XX",
    medium: "PLACEHOLDER",
    src: null,
    width: 4,
    height: 5,
    alt: "PLACEHOLDER — no image yet.",
  },
  {
    slug: "placeholder-two",
    title: "PLACEHOLDER — second piece",
    year: "20XX",
    medium: "PLACEHOLDER",
    src: null,
    width: 1,
    height: 1,
    alt: "PLACEHOLDER — no image yet.",
  },
  {
    slug: "placeholder-three",
    title: "PLACEHOLDER — third piece",
    year: "20XX",
    medium: "PLACEHOLDER",
    src: null,
    width: 3,
    height: 4,
    alt: "PLACEHOLDER — no image yet.",
  },
  {
    slug: "placeholder-four",
    title: "PLACEHOLDER — fourth piece",
    year: "20XX",
    medium: "PLACEHOLDER",
    src: null,
    width: 4,
    height: 3,
    alt: "PLACEHOLDER — no image yet.",
  },
  {
    slug: "placeholder-five",
    title: "PLACEHOLDER — fifth piece",
    year: "20XX",
    medium: "PLACEHOLDER",
    src: null,
    width: 2,
    height: 3,
    alt: "PLACEHOLDER — no image yet.",
  },
  {
    slug: "placeholder-six",
    title: "PLACEHOLDER — sixth piece",
    year: "20XX",
    medium: "PLACEHOLDER",
    src: null,
    width: 1,
    height: 1,
    alt: "PLACEHOLDER — no image yet.",
  },
];
