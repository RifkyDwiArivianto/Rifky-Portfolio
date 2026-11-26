import type { SkillGroup, TimelineItem } from "@/types";
import { SkillsColumn } from "./SkillsSection";
import { TimelineColumn } from "./TimelineSection";

export function PathSection({ timeline, skillGroups }: { timeline: TimelineItem[]; skillGroups: SkillGroup[] }) {
  return (
    <section id="jalur">
      <div className="duo">
        <TimelineColumn timeline={timeline} />
        <SkillsColumn skillGroups={skillGroups} />
      </div>
    </section>
  );
}
