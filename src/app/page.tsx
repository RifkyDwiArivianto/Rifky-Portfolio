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
import { getContent } from "@/lib/content";

export default async function HomePage() {
  const { site, stats, projects, timeline, skills, certificates } = await getContent();
  const galleryProjects = projects.map(({ id, title, gallery }) => ({ id, title, gallery }));

  return (
    <GalleryProvider projects={galleryProjects}>
      <ScrollProgress />
      <div className="wrap" id="top">
        <Navbar shortName={site.shortName} />
        <main>
          <Hero site={site} />
          <StatsBand stats={stats} />
          <ProjectsSection projects={projects} />
          <PathSection timeline={timeline} skillGroups={skills} />
          <CertificatesSection certificates={certificates} />
          <ContactSection site={site} />
        </main>
        <Footer site={site} />
      </div>
    </GalleryProvider>
  );
}
