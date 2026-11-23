import { site } from "@/data/site";
import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer>
      <span>
        {site.name} · {site.year}
      </span>
      <BackToTop />
    </footer>
  );
}
