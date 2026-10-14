import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jake Recharte — CS Student @ SDSU",
  description:
    "CS student at San Diego State. A language published on PyPI, a climbing app on Supabase, an ML model at 82% accuracy.",
  openGraph: {
    title: "Jake Recharte — CS Student @ SDSU",
    description:
      "CS student at San Diego State. A language published on PyPI, a climbing app on Supabase, an ML model at 82% accuracy.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
