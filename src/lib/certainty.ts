/** Perhitungan Certainty Factor (CF). Fungsi murni, tidak bergantung pada React. */

export interface Finding {
  /** Nilai CF pakar, 0 sampai 1. */
  expert: number;
  /** Indeks penyimpangan yang ditunjuk gejala ini. */
  target: number;
}

export interface CfResult {
  target: number;
  /** Nilai CF akhir, 0 sampai 1. */
  cf: number;
  /** Langkah perhitungan: CF tiap gejala (pakar × pengguna). */
  parts: number[];
}

/** Nilai CF pengguna ditetapkan 1, jadi CF satu gejala sama dengan CF pakar. */
export const USER_CF = 1;

/** CF satu gejala = CF pakar × CF pengguna. */
export const singleCf = (expert: number, user: number = USER_CF) => expert * user;

/** CF kombinasi dua nilai positif: CF1 + CF2 × (1 − CF1). */
export const combineCf = (a: number, b: number) => a + b * (1 - a);

/**
 * Menghitung CF tiap penyimpangan dari gejala yang dipilih. Gejala untuk penyimpangan yang sama
 * digabung berurutan dengan combineCf. Hasil diurutkan dari CF tertinggi.
 */
export function diagnose(findings: Finding[]): CfResult[] {
  const byTarget = new Map<number, number[]>();
  for (const f of findings) {
    const list = byTarget.get(f.target) ?? [];
    list.push(singleCf(f.expert));
    byTarget.set(f.target, list);
  }
  return [...byTarget.entries()]
    .map(([target, parts]) => ({ target, parts, cf: parts.reduce((acc, p) => combineCf(acc, p)) }))
    .sort((a, b) => b.cf - a.cf || a.target - b.target);
}
