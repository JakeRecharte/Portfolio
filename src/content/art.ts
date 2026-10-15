/**
 * The art page (`/art`), which is the site's only route other than the
 * homepage.
 *
 * **Source of record: the files themselves.** Jake supplied
 * `iCloud Drive/Projects/Art/Jake finals/Better Items` on 2026-10-14 and said
 * to use all of it: eight pieces, copied into `public/art/` and renamed to
 * kebab-case. `Moon` arrived as a TIFF, which no browser renders, and was
 * converted to PNG (5.7 MB → 362 KB); the other seven are byte-identical
 * copies. The originals in iCloud were not touched.
 *
 * Everything below either comes off the file or is marked as not known:
 *
 * - **`title`** is Jake's own filename, de-underscored. His naming, not mine.
 * - **`alt`** is written from looking at each piece, which CONTENT.md §7
 *   requires and §2.4 has precedent for (Apple Picker's copy is read off the
 *   repo because there was no other source).
 * - **`medium`** is read off the work the same way: uniform black linework,
 *   flat fills, no paper or canvas texture. Flagged for confirmation.
 * - **`year` is deliberately absent on every piece.** The file dates are
 *   export dates, not creation dates, and there is proof: `Cradled_Fortress`
 *   and `Oni` are dated June 2024 here, while the TIFF originals one folder
 *   up are dated November 2023 and September 2023. Putting an export date on
 *   a wall label would be wrong, so there is no wall label until Jake says.
 *   See CONTENT.md §8 Q24.
 *
 * Order is **not** chronological, because the dates to sort by don't exist
 * yet. It is the export batches, newest batch first, which is the only
 * ordering signal the files carry. Jake's call to re-rank.
 */

export type ArtPiece = {
  /** kebab-case and stable; it is the React key and a future deep-link slug. */
  slug: string;
  /** ≤ 40 chars. It sits under the piece at `text-sm` and wraps past that. */
  title: string;
  /**
   * A year (`2026`) or a span (`2025 - 2026`). **Optional, and currently
   * unset on everything**, see the note above. The caption line only renders
   * when this or `medium` exists.
   */
  year?: string;
  /** What it is made of. ≤ 24 chars; it shares one caption line with `year`. */
  medium?: string;
  /**
   * Path under `public/`, so `public/art/foo.jpg` is `"/art/foo.jpg"`, or
   * `null` while the piece has no file yet, which draws a placeholder frame.
   */
  src: string | null;
  /**
   * The file's real pixel dimensions. `next/image` needs them to reserve space
   * before the image loads, and the gallery needs the ratio to size the frame.
   * Read them off the file (`sips -g pixelWidth -g pixelHeight <file>` on a
   * Mac) rather than guessing, since a wrong ratio makes the image jump.
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
 * hero size, the same rules as `site.headline` (CONTENT.md §5).
 *
 * TODO: `ART`/`PORTFOLIO` restates the nav link that got the visitor here,
 * which DESIGN.md §2.5 says a heading this large has to beat. It is a
 * stand-in until Jake writes one.
 *
 * `intro` is `null` rather than placeholder prose. The pieces are real now, so
 * a paragraph of obvious filler above them would be the one dishonest thing on
 * the page; the page simply runs heading-straight-into-gallery until Jake
 * supplies two sentences (CONTENT.md §8 Q24).
 */
export const art = {
  headline: ["ART", "PORTFOLIO"] as const,
  intro: null as string | null,
} as const;

/**
 * Cradled Fortress, which does double duty: the sixth piece in the gallery
 * below, and the profile picture in the site header. Jake's call on
 * 2026-10-14. It replaces the `JR` monogram, which answers CONTENT.md §8 Q10
 * with his own art instead of a photo.
 *
 * It is lifted out of the array and referenced back into it so the piece still
 * exists once. The header needs the real pixel dimensions and the `alt` string
 * for the same reasons the gallery does, and a re-export or a corrected
 * caption should never have to be made in two places.
 *
 * Why this piece can be a square avatar at all: it is 2160 × 2160, so the
 * frame crops nothing, which is the loss the whole gallery is built to avoid
 * (DESIGN.md §2.3). Any of the four tall pieces would have been cropped to
 * fit, which is why the choice is not interchangeable with them.
 *
 * `satisfies` rather than `: ArtPiece`, so `src` keeps its string literal
 * type. Annotating it widens `src` to `string | null` and `next/image` will
 * not take a nullable src.
 */
const cradledFortress = {
  slug: "cradled-fortress",
  title: "Cradled Fortress",
  medium: "Digital illustration",
  src: "/art/cradled-fortress.png",
  width: 2160,
  height: 2160,
  alt: "A pale yellow crescent moon, melting and dripping at its edges, holding a purple city in the curve of its arc: towers, arches, a flag and a crane reaching out over empty space. Four-pointed stars sit in the blue-grey background.",
} satisfies ArtPiece;

/** What `Header.tsx` renders as Jake's profile picture. */
export const profilePicture = cradledFortress;

/**
 * Eight pieces, newest export batch first. Aspect ratios run 1:1, 3:4, 4:3 and
 * a 2984×3824, which is what makes the masonry columns stagger.
 */
export const artPieces: ArtPiece[] = [
  {
    slug: "garden",
    title: "Garden",
    medium: "Digital illustration",
    src: "/art/garden.jpg",
    width: 3024,
    height: 4032,
    alt: "A dense tangled garden in deep purple, blue and magenta, drawn entirely in heavy black outline. Two giant hands reach in from the edges, one with an eye opening in its palm. A rope bridge carries a snail across the middle, and mushrooms, berries and flowers crowd the foreground.",
  },
  {
    slug: "hells-trip",
    title: "Hell's Trip",
    medium: "Digital illustration",
    src: "/art/hells-trip.jpg",
    width: 3024,
    height: 4032,
    alt: "A house built from a stack of grinning skulls under a blue mushroom cap, against a sky of banded purple cloud. A small red devil looks out of the wooden door, water pours from the eye sockets, and a zipper runs up the hillside below, open and spilling flowers and pills.",
  },
  {
    slug: "skulls",
    title: "Skulls",
    medium: "Digital illustration",
    src: "/art/skulls.jpg",
    width: 2984,
    height: 3824,
    alt: "An isometric diorama inside a glass display case. Two cube-shaped skulls sit on a grey base, one leaking red from its crown, the other topped by a grey frog, joined by a tongue stretched between them. A small brass plaque on the plinth reads 'But What If?'.",
  },
  {
    slug: "the-watcher",
    title: "The Watcher",
    medium: "Digital illustration",
    src: "/art/the-watcher.jpg",
    width: 2732,
    height: 2048,
    alt: "A crowned skull leaning over the top of a split planet, long fingers curled around both halves. In the gap between them is an orange sun with a wide grin and three eyes stitched shut with pale thread.",
  },
  {
    slug: "all-seeing",
    title: "All Seeing",
    medium: "Digital illustration",
    src: "/art/all-seeing.png",
    width: 2160,
    height: 2160,
    alt: "A symmetrical face filling the whole square in lilac, cornflower blue and black. A single round eye high on the forehead weeps dark streaks down over two more weeping eyes, a blue teardrop hangs over bared square teeth, and a pale hand enters from the top right corner.",
  },
  cradledFortress,
  {
    slug: "oni",
    title: "Oni",
    medium: "Digital illustration",
    src: "/art/oni.png",
    width: 2160,
    height: 2160,
    alt: "A grinning oni mask filling the square: three yellow eyes, pale curved horns, a long red nose and a wide coral-pink mouth full of uneven fangs, against a sage green background.",
  },
  {
    slug: "moon",
    title: "Moon",
    medium: "Digital illustration",
    src: "/art/moon.png",
    width: 2732,
    height: 2048,
    alt: "A pale blue cratered crescent moon wearing oversized black sunglasses that hang down off its face, with a long hooked nose and a small open mouth.",
  },
];
