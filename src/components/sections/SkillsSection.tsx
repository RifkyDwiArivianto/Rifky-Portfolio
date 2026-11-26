import type { SkillGroup } from "@/types";

/** Kolom kanan bagian "Pengalaman": keahlian dan alat. Tingginya mengikuti kolom garis waktu. */
export function SkillsColumn({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <div id="kemampuan">
      <div className="sec-head">
        <p className="eyebrow">Kemampuan</p>
        <h2>Keahlian dan alat</h2>
        <p className="intro">Ketuk salah satu chip untuk menyorot proyek &amp; pengalaman terkait.</p>
      </div>
      <div className="skills">
        {skillGroups.map((group) => (
          <div key={group.id} className="sk">
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item, i) => (
                <li key={`${item.label}-${i}`}>
                  <button
                    type="button"
                    className={`chip${item.learning ? " learn" : ""}`}
                    aria-pressed="false"
                    title={item.learning ? "Sedang dipelajari" : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
