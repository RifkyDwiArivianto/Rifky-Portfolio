"use client";

import { useState } from "react";
import { useCases } from "@/data/usecase";
import type { ReviewStatus } from "@/types";
import { MockScreen } from "./MockScreen";
import { UseCaseDiagram } from "./UseCaseDiagram";

type View = "rancang" | "bangun";

const VIEWS: { value: View; label: string }[] = [
  { value: "rancang", label: "Rancang" },
  { value: "bangun", label: "Bangun" },
];

/**
 * Kartu "Dari rancangan ke halaman": diagram use case yang menghidupkan layar tiruan di sebelahnya.
 * Di HP (≤ 700px) kedua panel tidak muat berdampingan, jadi dipilih lewat toggle Rancang/Bangun.
 */
export function UseCasePanel() {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<ReviewStatus>("Menunggu");
  const [view, setView] = useState<View>("rancang");

  // memilih use case di diagram di HP langsung memindahkan ke layar hasilnya
  const pickFromDiagram = (index: number) => {
    setActive(index);
    if (window.matchMedia("(max-width: 700px)").matches) setView("bangun");
  };

  return (
    <aside className="dual" data-view={view} aria-labelledby="dual-t">
      <div className="dual-head">
        <div className="dual-title-wrap">
          <h2 id="dual-t">Dari rancangan ke halaman</h2>
          <span className="badge">simulasi interaktif</span>
        </div>
        <div className="seg" role="group" aria-label="Pilih tampilan">
          {VIEWS.map((item) => (
            <button key={item.value} type="button" aria-pressed={view === item.value} onClick={() => setView(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dual-body">
        <div className="pane" data-pane="rancang">
          <p className="pane-label">Rancang · Enterprise Architect</p>
          <UseCaseDiagram active={active} onPick={pickFromDiagram} />
          <p className="hint">Klik atau ketuk use case untuk langsung melihat layarnya.</p>
        </div>
        <div className="dual-divider" aria-hidden="true" />
        <div className="pane" data-pane="bangun">
          <p className="pane-label">Bangun · Laravel, MySQL, VS Code</p>
          <div className="browser">
            <div className="bar">
              <i />
              <i />
              <i />
              <span>diagnosa.test/{useCases[active].url}</span>
            </div>
            <div className="scr" aria-live="polite">
              <MockScreen index={active} status={status} onPick={setActive} onStatusChange={setStatus} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
