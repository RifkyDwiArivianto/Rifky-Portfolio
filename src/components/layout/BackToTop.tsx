"use client";

export function BackToTop() {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      Kembali ke atas ↑
    </a>
  );
}
