import { site } from "@/data/site";
import { stats } from "@/data/stats";
import { AnimatedStat } from "./AnimatedStat";
import { UseCasePanel } from "./UseCasePanel";

export function Hero() {
  const [first, ...rest] = site.name.split(" ");

  return (
    <header className="hero">
      <div>
        <h1>
          <span className="hl">{first}</span>
          {rest.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </h1>
        <p className="role">{site.role}</p>
        <p className="lead lead--tight">{site.description}</p>

        <p className="eyebrow eyebrow--sm">Tools yang saya pakai</p>
        <ul className="tags tags--flush">
          {site.heroTools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>

        <ul className="stats">
          {stats.map((stat) => (
            <li key={stat.label}>
              <AnimatedStat value={stat.value} decimals={stat.decimals} />
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>

        <div className="cta">
          <a className="btn primary" href="#kontak">
            Ajak kerja sama →
          </a>
          <a className="btn ghost" href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </div>
      </div>

      <UseCasePanel />
    </header>
  );
}
