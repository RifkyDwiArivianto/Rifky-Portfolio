"use client";

import type { KeyboardEvent } from "react";
import { useCaseActors, useCases } from "@/data/usecase";

interface UseCaseDiagramProps {
  active: number;
  onPick: (index: number) => void;
}

const ACTOR_NAMES = new Map(useCaseActors.map((actor) => [actor.name, actor]));

export function UseCaseDiagram({ active, onPick }: UseCaseDiagramProps) {
  const activeActors = useCases[active].actors;

  const onKeyDown = (e: KeyboardEvent<SVGGElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick(index);
    }
  };

  return (
    <svg
      className="uc"
      viewBox="0 0 480 412"
      role="group"
      aria-label="Diagram use case sistem diagnosa penyimpangan produk"
    >
      {/* garis penghubung aktor ke use case */}
      {useCases.flatMap((useCase, caseIndex) =>
        useCase.actors.map((name) => {
          const actor = ACTOR_NAMES.get(name);
          if (!actor) return null;
          const onLeft = actor.x < 200;
          return (
            <line
              key={`${caseIndex}-${name}`}
              x1={onLeft ? actor.x + 16 : actor.x - 18}
              y1={actor.y}
              x2={onLeft ? 150 : 310}
              y2={useCase.y}
              className={`ln${caseIndex === active ? " on" : ""}`}
            />
          );
        }),
      )}

      {/* aktor (figur stik) */}
      {useCaseActors.map((actor) => {
        const cls = `act${activeActors.includes(actor.name) ? " on" : ""}`;
        return (
          <g key={actor.name}>
            <circle cx={actor.x} cy={actor.y - 22} r={8} className={cls} />
            <line x1={actor.x} y1={actor.y - 14} x2={actor.x} y2={actor.y + 10} className={cls} />
            <line x1={actor.x - 14} y1={actor.y - 6} x2={actor.x + 14} y2={actor.y - 6} className={cls} />
            <line x1={actor.x} y1={actor.y + 10} x2={actor.x - 12} y2={actor.y + 28} className={cls} />
            <line x1={actor.x} y1={actor.y + 10} x2={actor.x + 12} y2={actor.y + 28} className={cls} />
            {actor.label.map((line, i) => (
              <text key={line} x={actor.x} y={actor.y + 52 + i * 19} className="act-t">
                {line}
              </text>
            ))}
          </g>
        );
      })}

      {/* use case (elips, bisa diklik) */}
      {useCases.map((useCase, i) => {
        const textY = useCase.y + (useCase.title.length > 1 ? -3 : 6);
        return (
          <g
            key={useCase.url}
            className={`case${i === active ? " on" : ""}`}
            tabIndex={0}
            role="button"
            aria-label={useCase.title.join(" ")}
            aria-pressed={i === active}
            onClick={() => onPick(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <ellipse cx={230} cy={useCase.y} rx={80} ry={30} className="el" />
            {useCase.title.map((line, k) => (
              <text key={line} x={230} y={textY + k * 20}>
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
