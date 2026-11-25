"use client";

import { useState } from "react";

interface ContactActionsProps {
  email: string;
  whatsapp: { href: string; label: string };
  linkedin: string;
}

export function ContactActions({ email, whatsapp }: ContactActionsProps) {
  const topics = [
    ["Peluang Kerja", "Peluang Kerja - Web Developer / System Analyst"],
    ["Proyek Web", "Diskusi Proyek Web"],
    ["Sapa / Diskusi", "Halo Rifky - Salam Kenal"],
  ] as const;
  type Topic = (typeof topics)[number][1];
  const [topic, setTopic] = useState<Topic>(topics[0][1]);
  const [note, setNote] = useState("");
  const message = `${topic}${note ? `\n\n${note}` : ""}`;
  const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(topic)}&body=${encodeURIComponent(note)}`;
  const whatsappUrl = `${whatsapp.href}?text=${encodeURIComponent(message)}`;

  return (
    <div className="msg-box">
      <h3>Susun pesan cepat</h3>
      <div className="topic-row" role="group" aria-label="Pilih topik pesan">
        {topics.map(([label, value]) => (
          <button key={value} type="button" className="topic-btn" aria-pressed={topic === value} onClick={() => setTopic(value)}>
            {label}
          </button>
        ))}
      </div>
      <p className="msg-hint">Topik dan catatan akan disiapkan di Gmail atau WhatsApp sebelum dikirim.</p>
      <textarea className="msg-input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Tambahkan catatan singkat (opsional)..." aria-label="Isi pesan" />
      <a className="btn primary" href={emailUrl} target="_blank" rel="noopener noreferrer">Kirim via Gmail ↗</a>
      <a className="btn primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Kirim via WhatsApp ↗</a>
    </div>
  );
}
