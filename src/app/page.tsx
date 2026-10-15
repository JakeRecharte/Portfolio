import Header from "@/components/Header";
import {
  Hero,
  FeaturedProjects,
  AdditionalProjects,
  Experience,
} from "@/components/Sections";

/**
 * `/`, the homepage.
 *
 * The fog, the nav bar and the footer moved to the root layout on 2026-10-14
 * when `/art` was added, since both routes carry all three
 * (`src/app/layout.tsx`). What is left here is this page's own shell and its
 * sections.
 */
export default function Home() {
  return (
    /* `pt-12` not `pt-24`: the sticky bar is in flow and already spaces the
       header off the top of the viewport. */
    <div className="mx-auto w-full max-w-6xl px-5 pt-12 pb-28 lg:px-8 lg:pt-16">
      <Header />
      <main className="mt-20 min-w-0 space-y-28 lg:mt-28 lg:space-y-36">
        <Hero />
        <Experience />
        {/* The featured three and the rest are one section to a reader, so
            they share one wrapper: the inner gap is the subsection gap, not
            the between-section rhythm, and the wrapper keeps `main`'s
            `space-y` from overriding it. */}
        <div>
          <FeaturedProjects />
          <AdditionalProjects />
        </div>
      </main>
    </div>
  );
}
