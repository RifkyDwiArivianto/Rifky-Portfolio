"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import type { GalleryImage } from "@/types";

interface LightboxProps {
  title: string;
  images: GalleryImage[];
  onClose: () => void;
}

export function Lightbox({ title, images, onClose }: LightboxProps) {
  const [index, setIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const multi = images.length > 1;
  const current = images[index];

  const step = useCallback(
    (direction: number) => setIndex((i) => (i + direction + images.length) % images.length),
    [images.length],
  );

  // fokus ke tombol tutup + kunci scroll halaman selama galeri terbuka
  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // keyboard: Esc, panah kiri/kanan, dan perangkap fokus dengan Tab
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (multi && e.key === "ArrowLeft") return step(-1);
      if (multi && e.key === "ArrowRight") return step(1);
      if (e.key !== "Tab") return;

      const focusable = Array.from(overlayRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []).filter(
        (button) => button.offsetParent !== null,
      );
      if (!focusable.length) return;
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
  }, [multi, onClose, step]);

  // klik di area kosong (bukan di gambar/tombol) menutup galeri
  const closeOnBackdrop = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="lb"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Galeri proyek"
      onClick={closeOnBackdrop}
    >
      <div className="lb-top">
        <div>
          <b>{title}</b>
          <small>
            Gambar {index + 1} dari {images.length}
          </small>
        </div>
        <button ref={closeRef} className="x" type="button" aria-label="Tutup galeri" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="lb-main" onClick={closeOnBackdrop}>
        {multi && (
          <button className="nv prev" type="button" aria-label="Gambar sebelumnya" onClick={() => step(-1)}>
            ←
          </button>
        )}
        <figure onClick={closeOnBackdrop}>
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="100vw"
            priority
          />
        </figure>
        {multi && (
          <button className="nv next" type="button" aria-label="Gambar berikutnya" onClick={() => step(1)}>
            →
          </button>
        )}
      </div>

      {multi && (
        <div className="lb-thumbs">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Gambar ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            >
              <Image src={image.src} alt="" width={image.width} height={image.height} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
