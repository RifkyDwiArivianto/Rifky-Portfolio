import { GalleryProvider } from "@/components/gallery/GalleryProvider";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";

export default function HomePage() {
  return (
    <GalleryProvider>
      <ScrollProgress />
      <div className="wrap" id="top">
        <Navbar />
        <main>
          <Hero />
          <ProjectsSection />
          <TimelineSection />
          <SkillsSection />
          <CertificatesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </GalleryProvider>
  );
}
