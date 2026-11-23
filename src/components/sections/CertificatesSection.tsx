import { SectionHead } from "@/components/ui/SectionHead";
import { certificates } from "@/data/certificates";

export function CertificatesSection() {
  return (
    <section id="sertifikat">
      <SectionHead eyebrow="Sertifikat" title="Sertifikat belajar" />
      <div className="certs">
        {certificates.map((cert) => (
          <a key={cert.mark} className="cert" href={cert.url} target="_blank" rel="noopener noreferrer">
            <span className="no">{cert.mark}</span>
            <div>
              <b>{cert.title}</b>
              <span>{cert.issuer}</span>
            </div>
            <span className="go">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
