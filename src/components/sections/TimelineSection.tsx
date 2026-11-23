"use client";

import { useState } from "react";
import { useGallery } from "@/components/gallery/GalleryProvider";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { SectionHead } from "@/components/ui/SectionHead";
import { timeline } from "@/data/timeline";
import type { TimelineKind } from "@/types";

type Filter = "all" | TimelineKind;

const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "kerja", label: "Kerja" },
  { value: "studi", label: "Pendidikan" },
] as const satisfies readonly { value: Filter; label: string }[];

export function TimelineSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const { openGallery } = useGallery();
  const items = filter === "all" ? timeline : timeline.filter((item) => item.kind === filter);

  return (
    <section id="jalur">
      <SectionHead eyebrow="Jalur" title="Pengalaman dan pendidikan">
        <FilterTabs label="Filter jalur" options={FILTERS} value={filter} onChange={setFilter} />
      </SectionHead>

      <ol className="tl">
        {items.map((item) => {
          const { projectId } = item;
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
                    <button
                      className="btn sm ghost"
                      type="button"
                      onClick={(e) => openGallery(projectId, e.currentTarget)}
                    >
                      Lihat proyek
                    </button>
                  )}
                  <a className="btn sm ghost" href={item.proofUrl} target="_blank" rel="noopener noreferrer">
                    Bukti ↗
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
