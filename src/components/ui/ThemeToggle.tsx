"use client";

const STORAGE_KEY = "rda-theme";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const explicit = root.getAttribute("data-theme");
    const isDark = explicit ? explicit === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* penyimpanan tidak tersedia, tema tetap berlaku untuk sesi ini */
    }
  };

  return (
    <button className="icon-btn" type="button" aria-label="Ganti tema terang atau gelap" onClick={toggle}>
      ◐
    </button>
  );
}
