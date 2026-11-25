import { SkillsColumn } from "./SkillsSection";
import { TimelineColumn } from "./TimelineSection";

export function PathSection() {
  return (
    <section id="jalur">
      <div className="duo">
        <TimelineColumn />
        <SkillsColumn />
      </div>
    </section>
  );
}
