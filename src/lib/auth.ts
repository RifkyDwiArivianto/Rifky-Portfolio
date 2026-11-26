// Sesi admin: kata sandi dari env + cookie bertanda tangan HMAC. Tanpa dependensi tambahan.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "rda_admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

const sha = (value: string) => createHash("sha256").update(value).digest();

/** Daftar pengaturan yang belum diisi (hanya nama, tidak pernah nilainya). */
export function missingEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.SUPABASE_URL?.trim()) missing.push("SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if ((process.env.ADMIN_PASSWORD ?? "").length < 8) missing.push("ADMIN_PASSWORD (minimal 8 karakter)");
  if ((process.env.ADMIN_SESSION_SECRET ?? "").length < 16) missing.push("ADMIN_SESSION_SECRET (minimal 16 karakter)");
  return missing;
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (expected.length < 8) return false;
  return timingSafeEqual(sha(input), sha(expected));
}

const sign = (payload: string) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(payload).digest("base64url");

export function createSessionToken(now = Date.now()): string {
  const payload = `v1.${Math.floor(now / 1000) + SESSION_SECONDS}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token || (process.env.ADMIN_SESSION_SECRET ?? "").length < 16) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires * 1000 < now) return false;
  const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`));
  const given = Buffer.from(parts[2]);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
