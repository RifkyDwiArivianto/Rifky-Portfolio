"use client";

import { useGallery } from "@/components/gallery/GalleryProvider";
import { timeline } from "@/data/timeline";
import { useState } from "react";

/** Kolom kiri bagian "Pengalaman": garis waktu kerja dan pendidikan. */
export function TimelineColumn() {
  const { openGallery } = useGallery();
  const [filter, setFilter] = useState<"all" | "kerja" | "studi">("all");

  return (
    <div>
      <div className="sec-head">
        <p className="eyebrow">Jalur</p>
        <h2>Pengalaman dan pendidikan</h2>
      </div>
      <div className="filter-bar" role="group" aria-label="Filter pengalaman dan pendidikan">
        <button type="button" className="ftab" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>Semua <span>3</span></button>
        <button type="button" className="ftab" aria-pressed={filter === "kerja"} onClick={() => setFilter("kerja")}>Kerja &amp; Magang <span>2</span></button>
        <button type="button" className="ftab" aria-pressed={filter === "studi"} onClick={() => setFilter("studi")}>Pendidikan <span>1</span></button>
      </div>
      <ol className="tl">
        {timeline.map((item) => {
          const { projectId } = item;
          if (filter !== "all" && item.kind !== filter) return null;
          return (
            <li key={item.id} data-k={item.kind}>
              <div className="tcard">
                <time>{item.period}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.org}</p>
                </div>
                <div className="acts">
                  {projectId && (
                    <button className="btn sm ghost" type="button" onClick={(e) => openGallery(projectId, e.currentTarget)}>
                      Lihat proyek
                    </button>
                  )}
                  <a className="btn sm ghost" href={item.proofUrl} target="_blank" rel="noopener noreferrer">
                    Lihat dokumen ↗
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
