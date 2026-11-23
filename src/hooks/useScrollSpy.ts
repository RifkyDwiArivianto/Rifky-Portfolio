"use client";

import { useEffect, useState } from "react";

/**
 * Mengembalikan indeks section yang sedang aktif (-1 jika belum ada).
 * Section dianggap aktif saat tepi atasnya melewati 40% tinggi viewport.
 */
export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState(-1);
  const key = ids.join("|");

  useEffect(() => {
    const elements = key.split("|").map((id) => document.getElementById(id));

    const update = () => {
      let current = -1;
      elements.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = i;
      });
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key]);

  return active;
}
