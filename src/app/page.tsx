import FogBackground from "@/components/FogBackground";
import Nav from "@/components/Nav";
import ProfileCard from "@/components/ProfileCard";
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
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-24 pb-28 lg:grid-cols-[21rem_1fr] lg:gap-16 lg:px-8 lg:pt-28">
        <ProfileCard />
        <main className="min-w-0 space-y-28 lg:space-y-36">
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
