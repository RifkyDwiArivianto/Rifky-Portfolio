"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { useGallery } from "@/components/gallery/GalleryProvider";
import type { Project } from "@/types";

/** Panel pratinjau proyek: sorotan mengikuti kursor, klik membuka galeri. */
export function ProjectStage({ project }: { project: Project }) {
  const { openGallery } = useGallery();
  const previews = project.gallery.slice(0, project.previewImages);

  const trackPointer = (e: PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <button
      type="button"
      className="stage"
      aria-label={`Buka galeri proyek ${project.title}`}
      onPointerMove={trackPointer}
      onClick={(e) => openGallery(project.id, e.currentTarget)}
    >
      {project.preview === "wide" ? (
        <span className="shot-wide">
          <Image
            src={previews[0].src}
            alt={previews[0].alt}
            width={previews[0].width}
            height={previews[0].height}
            sizes="(max-width: 860px) 100vw, 640px"
          />
        </span>
      ) : (
        <span className="phones">
          {previews.map((image) => (
            <Image
              key={image.src}
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              sizes="(max-width: 860px) 30vw, 180px"
            />
          ))}
        </span>
      )}
      <span className="open">Buka galeri · {project.gallery.length} gambar</span>
    </button>
  );
}
