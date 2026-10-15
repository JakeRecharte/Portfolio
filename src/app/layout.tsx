import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import FogBackground from "@/components/FogBackground";
import Nav from "@/components/Nav";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

/**
 * One string, used three times — the page description, the OG description and
 * nothing else. It was written out twice and drifted from the hero when the
 * tagline changed, which is the drift CONTENT.md §1 warns about.
 *
 * It is the hero tagline minus the "I build things end to end" clause, because
 * a search result has less room than the page does. Change the tagline in
 * `site.ts` and this needs the same edit — it is a shorter variant by hand,
 * not a slice of it.
 */
const title = "Jake Recharte — CS Student @ SDSU";
const description =
  "CS student at San Diego State. A language published on PyPI, a climbing app on Supabase, a hackathon car wired by hand.";

/**
 * `title.default` is the homepage's, unchanged. `title.template` is what every
 * other route gets: a route exports `title: "Art"` and the tab reads
 * "Art · Jake Recharte", so no page has to repeat the name.
 */
export const metadata: Metadata = {
  title: { default: title, template: "%s · Jake Recharte" },
  description,
  openGraph: { title, description, type: "website" },
};

/**
 * The root layout wraps every route, so the three things that are the same on
 * all of them live here rather than in each page: the fog, the sticky nav and
 * the footer. They were in `page.tsx` while the homepage was the only route;
 * leaving them there and copying them into `/art` would have been two bars to
 * keep in step, and the fog GIF would have restarted on every navigation
 * instead of staying put across it.
 *
 * What stays in a page is its own shell — the `max-w-6xl` measure and the
 * padding — because that is the one thing a future route might want to differ
 * on.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <FogBackground />
        <Nav />
        {children}
        <footer className="pb-10 text-center text-xs text-white/30">
          Built with Next.js &middot; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
