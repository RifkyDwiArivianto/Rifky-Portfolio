"use client";

import { useEffect, useRef, type RefObject } from "react";
import { navLinks, site } from "@/data/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  active: number;
  /** tombol hamburger, dipakai untuk mengembalikan fokus saat menu ditutup lewat Esc/✕ */
  openerRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Menu layar penuh untuk layar ≤ 860px. Dirender di luar <nav> karena backdrop-filter pada nav mengunci elemen fixed. */
export function MobileMenu({ open, active, openerRef, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // fokus ke tombol tutup + kunci scroll halaman selama menu terbuka
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.documentElement.classList.add("lock");
    return () => document.documentElement.classList.remove("lock");
  }, [open]);

  // Esc menutup, Tab berputar di dalam menu
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        openerRef.current?.focus({ preventScroll: true });
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = menuRef.current?.querySelectorAll<HTMLElement>("a,button");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, openerRef]);

  // layar dilebarkan ke desktop: tutup otomatis
  useEffect(() => {
    const query = window.matchMedia("(min-width: 861px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`menu${open ? " open" : ""}`}
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
    >
      <div className="menu-head">
        <strong>
          {site.shortName}
          <span className="nav-dot">.</span>
        </strong>
        <button
          ref={closeRef}
          className="icon-btn"
          type="button"
          aria-label="Tutup menu"
          onClick={() => {
            onClose();
            openerRef.current?.focus({ preventScroll: true });
          }}
        >
          ✕
        </button>
      </div>
      <nav className="menu-links" aria-label="Navigasi menu">
        {navLinks.map((link, i) => (
          <a key={link.id} href={`#${link.id}`} className={active === i ? "on" : undefined} onClick={onClose}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="menu-foot">
        <ThemeToggle variant="menu" />
      </div>
    </div>
  );
}
