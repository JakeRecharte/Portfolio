import FogBackground from "@/components/FogBackground";

export default function Home() {
  return (
    <>
      <FogBackground />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {/* min-w-0 lets this shrink below max-content; without it the flex
            item refuses to wrap and pushes the document wider than the
            viewport on narrow screens. */}
        <div className="w-full max-w-2xl min-w-0 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance drop-shadow-lg sm:text-5xl">
            Jake Recharte
          </h1>
          <p className="mt-3 text-base text-balance text-neutral-300 sm:text-lg">
            Computer Science &middot; San Diego State University
          </p>
          <p className="mt-8 font-mono text-sm text-neutral-400">
            Portfolio in progress.
          </p>
        </div>
      </main>
    </>
  );
}
