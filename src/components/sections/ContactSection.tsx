import { site } from "@/data/site";
import { ContactActions } from "./ContactActions";

export function ContactSection() {
  return (
    <section id="kontak" className="contact">
      <p className="eyebrow">Kontak</p>
      <h2>
        Mari <em>ngobrol</em>.
      </h2>
      <p>
        Sedang terbuka untuk peran yang membangun aplikasi web, menganalisis kebutuhan sistem, dan mengelola basis
        data.
      </p>
      <ContactActions email={site.email} />
    </section>
  );
}
