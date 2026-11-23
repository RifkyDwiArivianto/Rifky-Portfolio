"use client";

import { useState } from "react";
import { useCases } from "@/data/usecase";
import type { ReviewStatus } from "@/types";
import { MockScreen } from "./MockScreen";
import { UseCaseDiagram } from "./UseCaseDiagram";

/** Panel "Dari rancangan ke halaman": diagram use case yang menghidupkan layar tiruan di bawahnya. */
export function UseCasePanel() {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<ReviewStatus>("Menunggu");

  return (
    <aside className="dual" aria-labelledby="dual-t">
      <header>
        <h2 id="dual-t">Dari rancangan ke halaman</h2>
      </header>
      <p className="tagline tagline--tight">
        Use case sistem pakar diagnosa saya, dan layar yang lahir darinya (ilustrasi sebagai contoh).
      </p>

      <UseCaseDiagram active={active} onPick={setActive} />

      <div className="bridge">
        dibangun dengan <b>Laravel</b> + <b>MySQL</b>
      </div>

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
      <p className="toolsline">Enterprise Architect (rancang) → VS Code (tulis kode)</p>
    </aside>
  );
}
