"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/data/site";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const sectionIds = navLinks.map((link) => link.id);

export function Navbar() {
  const active = useScrollSpy(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // di layar kecil, navbar bersembunyi saat scroll turun dan muncul lagi saat scroll naik
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last + 6 && y > 120 && !menuOpen) setHidden(true);
      else if (y < last - 6 || y <= 120) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <>
      <nav className={`nav${hidden ? " hide" : ""}`} aria-label="Navigasi utama" onFocus={() => setHidden(false)}>
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
        <div className="nav-right">
          <ThemeToggle />
          <button
            ref={menuBtnRef}
            className="icon-btn menu-btn"
            type="button"
            aria-label="Buka menu"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 8h16M4 16h10" />
            </svg>
          </button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} active={active} openerRef={menuBtnRef} onClose={closeMenu} />
    </>
  );
}
