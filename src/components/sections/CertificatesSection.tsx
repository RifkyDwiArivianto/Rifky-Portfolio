import { SectionHead } from "@/components/ui/SectionHead";
import { certificates } from "@/data/certificates";

export function CertificatesSection() {
  return (
    <section id="sertifikat">
      <SectionHead eyebrow="Sertifikat" title="Sertifikat belajar" intro="Klik kartu untuk membuka dokumen sertifikat." />
      <div className="certs">
        {certificates.map((cert) => (
          <a key={cert.mark} className="cert" href={cert.url} target="_blank" rel="noopener noreferrer">
            <div className="cert-top">
              <span className="no">{cert.mark}</span>
              {cert.category && <span className="cat">{cert.category}</span>}
            </div>
            <div className="meta">
              <b>{cert.title}</b>
              {cert.issuer && <span>{cert.issuer}</span>}
            </div>
            <span className="go">Buka sertifikat ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
