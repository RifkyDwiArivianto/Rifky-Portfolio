"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_LABEL = "Salin email";

export function ContactActions({ email }: { email: string }) {
  const emailRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [label, setLabel] = useState(DEFAULT_LABEL);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (message: string, ms: number) => {
    setLabel(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLabel(DEFAULT_LABEL), ms);
  };

  // cadangan bila Clipboard API tidak tersedia: pilih teksnya agar bisa disalin manual
  const selectEmail = () => {
    const el = emailRef.current;
    const selection = window.getSelection();
    if (!el || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
    flash("Teks terpilih, tekan salin", 3000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      flash("Tersalin ✓", 1800);
    } catch {
      selectEmail();
    }
  };

  return (
    <div className="mail">
      <code ref={emailRef}>{email}</code>
      <button className="btn primary" type="button" onClick={copy}>
        {label}
      </button>
      <a className="btn" href={`mailto:${email}`}>
        Buka aplikasi email
      </a>
    </div>
  );
}
