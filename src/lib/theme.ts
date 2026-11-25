export const THEME_STORAGE_KEY = "rda-theme";

/** Ganti tema terang/gelap. Mulai dari tema yang sedang tampil (pilihan tersimpan atau setelan sistem). */
export function toggleTheme() {
  const root = document.documentElement;
  const explicit = root.getAttribute("data-theme");
  const isDark = explicit ? explicit === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next = isDark ? "light" : "dark";
  root.classList.add("tx");
  window.setTimeout(() => root.classList.remove("tx"), 300);
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* penyimpanan tidak tersedia, tema tetap berlaku untuk sesi ini */
  }
}
