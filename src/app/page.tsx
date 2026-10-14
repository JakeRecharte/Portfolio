import FogBackground from "@/components/FogBackground";
import Nav from "@/components/Nav";
import Header from "@/components/Header";
import {
  Hero,
  Projects,
  Experience,
  Tools,
  Contact,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <FogBackground />
      <Nav />
      <div className="mx-auto w-full max-w-6xl px-5 pt-24 pb-28 lg:px-8 lg:pt-28">
        <Header />
        <main className="mt-20 min-w-0 space-y-28 lg:mt-28 lg:space-y-36">
          <Hero />
          <Projects />
          <Experience />
          <Tools />
          <Contact />
        </main>
      </div>
      <footer className="pb-10 text-center text-xs text-white/30">
        Built with Next.js &middot; {new Date().getFullYear()}
      </footer>
    </>
  );
}
