import type { Stat } from "@/types";

export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <ul className="band" aria-label="Ringkasan">
      {stats.map((stat, i) => (
        <li key={`${stat.label}-${i}`}>
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
