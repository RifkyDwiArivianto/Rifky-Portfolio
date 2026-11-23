"use client";

import { useEffect, useState } from "react";
import { diagnosisResults, useCases } from "@/data/usecase";
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
function DiagnosisScreen() {
  const [ready, setReady] = useState(false);

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
      {diagnosisResults.map((result, i) => (
        <div key={result.name} className={`dv${i === 0 ? " top" : ""}`}>
          <span className="dn">
            <b>#{i + 1}</b>
            {result.name}
            {i === 0 && (
              <>
                {" "}
                <span className="pill ok">Terpilih</span>
              </>
            )}
          </span>
          <span className="dp">{result.percent}%</span>
          <div className="pb">
            <i style={{ width: ready ? `${result.percent}%` : 0 }} />
          </div>
        </div>
      ))}
    </>
  );
}

export function MockScreen({ index, status, onPick, onStatusChange }: MockScreenProps) {
  if (index === 0) {
    return (
      <>
        <h4>Pemeriksaan penemuan</h4>
        <Who index={0} />
        <div className="fld">
          <em>Produk</em>
          <span>Komponen cor aluminium</span>
        </div>
        <div className="row2">
          <span className="pill">☑ Permukaan tergores</span>
          <span className="pill">☑ Dimensi di luar toleransi</span>
          <span className="pill">☐ Warna tidak merata</span>
        </div>
        <button className="mbtn" type="button" onClick={() => onPick(1)}>
          Periksa
        </button>
      </>
    );
  }

  if (index === 1) return <DiagnosisScreen />;

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
