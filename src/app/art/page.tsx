import type { Metadata } from "next";
import { art } from "@/content/art";
import ArtGallery from "@/components/ArtGallery";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

/**
 * Per-route metadata. The root layout sets a `title.template`, so this only
 * has to name the page — "Art" comes out as "Art · Jake Recharte" in the tab
 * and in a link preview.
 *
 * The description is deliberately one short clause. Everything a longer one
 * would say — the medium, the tools, how long he has been at it — is in
 * CONTENT.md §8 Q24 and not yet known, and a meta description is the last
 * place to start guessing: it is what a search result and a pasted link show.
 */
export const metadata: Metadata = {
  title: "Art",
  description: "Art by Jake Recharte.",
  openGraph: {
    title: "Art — Jake Recharte",
    description: "Art by Jake Recharte.",
  },
};

/**
 * `/art` — the gallery.
 *
 * The fog, the nav bar and the footer are not here: they are in the root
 * layout, so both routes share one copy (`src/app/layout.tsx`). What is left
 * is the page shell — the same `max-w-6xl` measure and the same top and bottom
 * padding as the homepage, because a second page at a different width would
 * read as a different site.
 *
 * The heading is the display heading at `hero` size and as an `<h1>`: this
 * page has no `Header`, so its title is the document's one top-level heading
 * (DESIGN.md §3).
 */
export default function Art() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-12 pb-28 lg:px-8 lg:pt-16">
      <main className="min-w-0">
        <Reveal>
          <SectionHeading lines={art.headline} size="hero" as="h1" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            {art.intro}
          </p>
        </Reveal>

        <ArtGallery />
      </main>
    </div>
  );
}
