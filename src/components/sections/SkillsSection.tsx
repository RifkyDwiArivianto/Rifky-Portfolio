"use client";

import { useState } from "react";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { SectionHead } from "@/components/ui/SectionHead";
import { skillGroups } from "@/data/skills";
import type { SkillGroupId } from "@/types";

type Filter = "all" | SkillGroupId;

const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "ah", label: "Keahlian" },
  { value: "al", label: "Peralatan" },
] as const satisfies readonly { value: Filter; label: string }[];

export function SkillsSection() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <section id="kemampuan">
      <SectionHead eyebrow="Kemampuan" title="Keahlian dan peralatan">
        <FilterTabs label="Filter keahlian dan peralatan" options={FILTERS} value={filter} onChange={setFilter} />
      </SectionHead>

      <div className="skills skills--wide">
        {skillGroups.map((group) => (
          <div key={group.id} className={`sk${filter !== "all" && filter !== group.id ? " dim" : ""}`}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li
                  key={item.label}
                  className={`chip${item.learning ? " learn" : ""}`}
                  title={item.learning ? "Sedang dipelajari" : undefined}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
