"use client";

import { useGallery } from "@/components/gallery/GalleryProvider";
import type { TimelineItem, TimelineKind } from "@/types";
import { useState } from "react";

const KINDS: { kind: TimelineKind; label: string }[] = [
  { kind: "magang", label: "Magang" },
  { kind: "kerja", label: "Kerja" },
  { kind: "studi", label: "Pendidikan" },
];

/** Kolom kiri bagian "Pengalaman": garis waktu magang, kerja, dan pendidikan. */
export function TimelineColumn({ timeline }: { timeline: TimelineItem[] }) {
  const { openGallery } = useGallery();
  const [filter, setFilter] = useState<"all" | TimelineKind>("all");
  // tab hanya muncul untuk jenis yang memang ada isinya
  const tabs = KINDS.map((k) => ({ ...k, count: timeline.filter((item) => item.kind === k.kind).length })).filter((k) => k.count > 0);

  return (
    <div>
      <div className="sec-head">
        <p className="eyebrow">Jalur</p>
        <h2>Pengalaman dan pendidikan</h2>
      </div>
      <div className="filter-bar" role="group" aria-label="Filter pengalaman dan pendidikan">
        <button type="button" className="ftab" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>Semua <span>{timeline.length}</span></button>
        {tabs.map((tab) => (
          <button key={tab.kind} type="button" className="ftab" aria-pressed={filter === tab.kind} onClick={() => setFilter(tab.kind)}>
            {tab.label} <span>{tab.count}</span>
          </button>
        ))}
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
                  {item.proofUrl && (
                    <a className="btn sm ghost" href={item.proofUrl} target="_blank" rel="noopener noreferrer">
                      Lihat dokumen ↗
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
