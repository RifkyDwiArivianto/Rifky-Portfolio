import { GalleryProvider } from "@/components/gallery/GalleryProvider";
import { Hero } from "@/components/hero/Hero";
import { StatsBand } from "@/components/hero/StatsBand";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PathSection } from "@/components/sections/PathSection";

export default function HomePage() {
  return (
    <GalleryProvider>
      <ScrollProgress />
      <div className="wrap" id="top">
        <Navbar />
        <main>
          <Hero />
          <StatsBand />
          <ProjectsSection />
          <PathSection />
          <CertificatesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </GalleryProvider>
  );
}
