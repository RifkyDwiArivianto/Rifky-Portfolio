"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { GalleryImage } from "@/types";
import { Lightbox } from "./Lightbox";

/** Hanya data yang dibutuhkan galeri, supaya tidak mengirim seluruh data proyek dua kali ke browser. */
export interface GalleryProject {
  id: string;
  title: string;
  gallery: GalleryImage[];
}

interface GalleryContextValue {
  /** Buka galeri proyek. `opener` dipakai untuk mengembalikan fokus saat galeri ditutup. */
  openGallery: (projectId: string, opener?: HTMLElement | null) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ projects, children }: { projects: GalleryProject[]; children: ReactNode }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const openGallery = useCallback((id: string, opener?: HTMLElement | null) => {
    openerRef.current = opener ?? null;
    setProjectId(id);
  }, []);

  const close = useCallback(() => {
    setProjectId(null);
    openerRef.current?.focus();
  }, []);

  const value = useMemo(() => ({ openGallery }), [openGallery]);
  const project = projectId ? projects.find((p) => p.id === projectId) : undefined;

  return (
    <GalleryContext.Provider value={value}>
      {children}
      {project && <Lightbox key={project.id} title={project.title} images={project.gallery} onClose={close} />}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) throw new Error("useGallery harus dipakai di dalam <GalleryProvider>");
  return context;
}
