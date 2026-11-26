import type { SiteInfo } from "@/types";
import { BackToTop } from "./BackToTop";

export function Footer({ site }: { site: Pick<SiteInfo, "name" | "year"> }) {
  return (
    <footer>
      <span>
        {site.name} · {site.year}
      </span>
      <BackToTop />
    </footer>
  );
}
