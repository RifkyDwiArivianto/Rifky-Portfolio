"use client";

import { navLinks, site } from "@/data/site";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const sectionIds = navLinks.map((link) => link.id);

export function Navbar() {
  const active = useScrollSpy(sectionIds);

  return (
    <nav className="nav" aria-label="Navigasi utama">
      <strong>
        {site.shortName}
        <span className="nav-dot">.</span>
      </strong>
      <ul>
        {navLinks.map((link, i) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={active === i ? "on" : undefined}
              aria-current={active === i ? "location" : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </nav>
  );
}
