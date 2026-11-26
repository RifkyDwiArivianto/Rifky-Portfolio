import type { SiteInfo } from "@/types";
import { ContactActions } from "./ContactActions";

export function ContactSection({ site }: { site: SiteInfo }) {
  return (
    <section id="kontak" className="contact">
      <p className="eyebrow">Kontak</p>
      <div className="contact-grid">
        <div>
          <h2>
            Mari <em>ngobrol</em>.
          </h2>
          <p className="desc">
            {site.contactNote}
          </p>
          <div className="mail">
            <a className="mail-link" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`} target="_blank" rel="noopener noreferrer">
              {site.email}
            </a>
          </div>
          <div className="mail">
            <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
        <ContactActions email={site.email} whatsapp={site.whatsapp} linkedin={site.linkedin} />
      </div>
    </section>
  );
}
