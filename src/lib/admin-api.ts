import { missingEnv } from "./auth";
import { isAdmin } from "./admin-session";

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

/** Permintaan harus berasal dari halaman situs ini sendiri (lapisan tambahan di atas cookie SameSite=Strict). */
export function sameOrigin(req: Request): boolean {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  return req.headers.get("sec-fetch-site") === "same-origin";
}

/** Pemeriksaan umum untuk semua API admin yang mengubah data. Mengembalikan Response bila ditolak. */
export async function guard(req: Request): Promise<Response | null> {
  if (missingEnv().length) return json({ error: "Mode admin belum dikonfigurasi di server." }, 503);
  if (!sameOrigin(req)) return json({ error: "Permintaan ditolak." }, 403);
  if (!(await isAdmin())) return json({ error: "Sesi berakhir. Masuk lagi." }, 401);
  return null;
}

// Pembatas percobaan login per alamat IP. Disimpan di memori instance, jadi hanya perlindungan dasar.
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

export function loginBlocked(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordLoginFailure(ip: string) {
  const entry = attempts.get(ip);
  if (!entry || Date.now() - entry.first > WINDOW_MS) attempts.set(ip, { count: 1, first: Date.now() });
  else entry.count += 1;
}

export const clearLoginFailures = (ip: string) => attempts.delete(ip);
