"use client";

import { useEffect, useState } from "react";
import { deviations, symptoms, useCases } from "@/data/usecase";
import { diagnose } from "@/lib/certainty";
import type { ReviewStatus } from "@/types";

interface MockScreenProps {
  index: number;
  status: ReviewStatus;
  onPick: (index: number) => void;
  onStatusChange: (status: ReviewStatus) => void;
}

function Who({ index }: { index: number }) {
  return <span className="who">Dipakai oleh: {useCases[index].actors.join(", ")}</span>;
}

/** Bar persentase tumbuh dari 0 setelah layar tampil. */
function DiagnosisScreen({ selected, onSave }: { selected: number[]; onSave: () => void }) {
  const [ready, setReady] = useState(false);
  // Certainty Factor dihitung dari gejala yang dipilih (nilai CF pengguna tetap 1)
  const results = diagnose(selected.map((i) => symptoms[i]));

  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  return (
    <>
      <h4>Hasil diagnosa</h4>
      <Who index={1} />
      {results.map((result, i) => (
        <div key={result.target} className={`dv${i === 0 ? " top" : ""}`}>
          <span className="dn">
            <b>#{i + 1}</b>
            {deviations[result.target]}
            {i === 0 && (
              <>
                {" "}
                <span className="pill ok">Terpilih</span>
              </>
            )}
          </span>
          <span className="dp">{Math.round(result.cf * 100)}%</span>
          <div className="pb">
            <i style={{ width: ready ? `${Math.round(result.cf * 100)}%` : 0 }} />
          </div>
        </div>
      ))}
      <button className="mbtn" type="button" onClick={onSave}>
        Simpan
      </button>
    </>
  );
}

export function MockScreen({ index, status, onPick, onStatusChange }: MockScreenProps) {
  const [selected, setSelected] = useState<number[]>([0, 1, 2]);
  const toggle = (i: number) =>
    setSelected((current) => (current.includes(i) ? current.filter((n) => n !== i) : [...current, i].sort()));

  if (index === 0) {
    return (
      <>
        <h4>Pemeriksaan penemuan</h4>
        <Who index={0} />
        <div className="fld">
          <em>Produk</em>
          <span>Komponen cor aluminium</span>
        </div>
        <div className="row2" role="group" aria-label="Penyimpangan yang ditemukan">
          {symptoms.map(({ name }, i) => (
            <button
              key={name}
              className="pill chk"
              type="button"
              aria-pressed={selected.includes(i)}
              onClick={() => toggle(i)}
            >
              {selected.includes(i) ? "☑" : "☐"} {name}
            </button>
          ))}
        </div>
        <button className="mbtn" type="button" disabled={!selected.length} onClick={() => onPick(1)}>
          Periksa
        </button>
        {!selected.length && <span className="who">Pilih minimal satu penyimpangan.</span>}
      </>
    );
  }

  if (index === 1) return <DiagnosisScreen selected={selected} onSave={() => onPick(2)} />;

  if (index === 2) {
    return (
      <>
        <h4>Laporan penyimpangan</h4>
        <Who index={2} />
        <table className="mt">
          <tbody>
            <tr>
              <td>PNY-001</td>
              <td>Goresan</td>
              <td>
                <span className="pill">Menunggu</span>
              </td>
            </tr>
            <tr>
              <td>PNY-002</td>
              <td>Dimensi</td>
              <td>
                <span className="pill ok">Terverifikasi</span>
              </td>
            </tr>
          </tbody>
        </table>
        <button className="mbtn alt" type="button" onClick={() => onPick(3)}>
          Kirim laporan
        </button>
      </>
    );
  }

  const statusClass = status === "Disetujui" ? " ok" : status === "Ditolak" ? " no" : "";
  return (
    <>
      <h4>Verifikasi laporan</h4>
      <Who index={3} />
      <div className="fld">
        <em>PNY-001</em>
        <span className={`pill${statusClass}`}>{status}</span>
      </div>
      <div className="row2">
        <button className="mbtn" type="button" onClick={() => onStatusChange("Disetujui")}>
          Setujui
        </button>
        <button className="mbtn alt" type="button" onClick={() => onStatusChange("Ditolak")}>
          Tolak
        </button>
      </div>
    </>
  );
}
