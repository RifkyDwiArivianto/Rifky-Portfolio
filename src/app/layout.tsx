import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Unbounded } from "next/font/google";
import { site } from "@/data/site";

// Urutan impor CSS = urutan cascade. Jangan diacak.
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/navbar.css";
import "@/styles/hero.css";
import "@/styles/projects.css";
import "@/styles/timeline.css";
import "@/styles/skills.css";
import "@/styles/certificates.css";
import "@/styles/contact.css";
import "@/styles/lightbox.css";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-unbounded", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-hanken", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Menerapkan tema tersimpan sebelum halaman dicat, supaya tidak berkedip.
const themeScript = `try{var t=localStorage.getItem("rda-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${unbounded.variable} ${hanken.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
