import Image from "next/image";
import { artPieces } from "@/content/art";
import Reveal from "./Reveal";

/**
 * The art page's gallery: uncropped masonry, two columns on a phone and three
 * from `lg:` up (DESIGN.md §2.3).
 *
 * **Why columns and not a grid.** Every other collection on this site is
 * square — the project board crops nothing because it holds text, not
 * pictures. Art is the one kind of content where the frame cropping the
 * subject is a real loss, so each piece keeps its own aspect ratio and the
 * columns stagger around them. That is also why the frame is the plain tile
 * recipe and nothing more: the picture is the content, so the chrome around it
 * stays a hairline.
 *
 * It renders no client JS of its own — `Reveal` is the only client component
 * in here, same as every section on the homepage.
 */
export default function ArtGallery() {
  return (
    /*
      CSS multi-column, so `gap` is the horizontal gutter only and each item
      carries its own `mb-4` for the vertical one. `break-inside-avoid` keeps a
      piece from being sliced across a column boundary, and it has to sit on
      the direct child of the column box — which is why `Reveal` is *inside*
      the `<li>` here, the one place on the site where it isn't wrapped around
      it. A `<Reveal>` outside would become the column item and take the class
      with it, and `ul > div` is invalid markup anyway.
    */
    <ul className="mt-12 columns-2 gap-4 lg:columns-3">
      {artPieces.map((piece, i) => (
        <li key={piece.slug} className="mb-4 break-inside-avoid">
          {/* `i * 0.04` is the grid-tile stagger, not the row one (§2.7). */}
          <Reveal delay={i * 0.04}>
            <figure>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                {piece.src ? (
                  <Image
                    src={piece.src}
                    alt={piece.alt}
                    width={piece.width}
                    height={piece.height}
                    /*
                      The column count, told to the optimizer so it doesn't
                      ship a 1600px file into a 300px column. Keep this in step
                      with the `columns-*` classes above.
                    */
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="block h-auto w-full"
                  />
                ) : (
                  /*
                    No file yet. The frame still reserves the piece's real
                    ratio so the layout is the one it will be, and says what it
                    is rather than showing a broken image. Inline ratio because
                    it comes from the content, not the design (see `art.ts`).
                  */
                  <div
                    className="grid place-items-center p-4"
                    style={{ aspectRatio: `${piece.width} / ${piece.height}` }}
                  >
                    <span className="font-mono text-[10px] tracking-wider text-white/35 uppercase">
                      No image yet
                    </span>
                  </div>
                )}
              </div>
              <figcaption className="mt-3">
                <span className="block text-sm font-medium text-white">
                  {piece.title}
                </span>
                <span className="mt-1 block font-mono text-xs text-white/35">
                  {piece.year} &middot; {piece.medium}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
