import { stats } from "@/data/stats";

export function StatsBand() {
  return (
    <ul className="band" aria-label="Ringkasan">
      {stats.map((stat) => (
        <li key={stat.label}>
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
