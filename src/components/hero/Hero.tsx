import { site } from "@/data/site";
import { UseCasePanel } from "./UseCasePanel";

export function Hero() {
  const [first, second, ...rest] = site.name.split(" ");

  return (
    <header className="hero">
      <div className="hero-text">
        <h1>
          <span>
            <em>{first}</em> {second}
          </span>
          <span>{rest.join(" ")}</span>
        </h1>
        <p className="role">{site.role}</p>
        <ul className="tags hero-tags">
          {site.heroTools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <p className="lead">{site.description}</p>
        <div className="cta">
          <a className="btn primary" href="#kontak">
            Hubungi saya
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
