import { SectionHead } from "@/components/ui/SectionHead";
import type { Certificate } from "@/types";

export function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section id="sertifikat">
      <SectionHead eyebrow="Sertifikat" title="Sertifikat belajar" intro="Klik kartu untuk membuka dokumen sertifikat." />
      <div className="certs">
        {certificates.map((cert, i) => (
          <a key={`${cert.mark}-${i}`} className="cert" href={cert.url} target="_blank" rel="noopener noreferrer">
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
