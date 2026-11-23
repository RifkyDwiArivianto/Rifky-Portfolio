"use client";

import { useEffect, useState } from "react";

interface AnimatedStatProps {
  value: number;
  decimals?: number;
}

const format = (value: number, decimals: number) =>
  decimals ? value.toFixed(decimals).replace(".", ",") : String(Math.round(value));

/** Angka menghitung naik saat dimuat. HTML dari server sudah berisi angka akhir. */
export function AnimatedStat({ value, decimals = 0 }: AnimatedStatProps) {
  const [text, setText] = useState(() => format(value, decimals));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const from = value > 1000 ? value - 40 : 0;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - progress, 3);
      setText(format(from + (value - from) * eased, decimals));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, decimals]);

  return <b>{text}</b>;
}
