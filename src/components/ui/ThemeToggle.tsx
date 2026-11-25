"use client";

import { toggleTheme } from "@/lib/theme";

interface ThemeToggleProps {
  /** "icon" = tombol bulat di navbar (desktop), "menu" = tombol lebar di menu layar penuh */
  variant?: "icon" | "menu";
}

export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  if (variant === "menu") {
    return (
      <button className="btn ghost" type="button" onClick={toggleTheme}>
        Ganti tema ◐
      </button>
    );
  }

  return (
    <button
      className="icon-btn theme-btn"
      type="button"
      aria-label="Ganti tema terang atau gelap"
      onClick={toggleTheme}
    >
      ◐
    </button>
  );
}
