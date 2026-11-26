// Akses Supabase lewat REST dengan service role key. Hanya dipakai di server; kunci ini
// tidak boleh pernah sampai ke browser (jangan beri awalan NEXT_PUBLIC_).

export const BUCKET = "portfolio";

export interface SupabaseEnv {
  url: string;
  key: string;
}

/** Alamat proyek. Integrasi Vercel membuat SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_URL; keduanya boleh. */
export const supabaseUrl = () =>
  (process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "").replace(/\/+$/, "");

/**
 * Kunci server: service_role lama (JWT) atau secret key baru (sb_secret_...); keduanya melewati RLS.
 * Bila dua-duanya ada, yang lama dipakai karena jalurnya paling teruji di semua layanan (termasuk Storage).
 */
export const supabaseKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim() || "";

export function supabaseEnv(): SupabaseEnv | null {
  const url = supabaseUrl();
  const key = supabaseKey();
  return url && key ? { url, key } : null;
}

/**
 * Kunci baru (sb_secret_...) bukan JWT dan hanya boleh dikirim lewat header apikey.
 * Kunci lama (service_role, berupa JWT) tetap dikirim juga sebagai Bearer seperti biasa.
 */
export const authHeaders = (env: SupabaseEnv): Record<string, string> =>
  env.key.startsWith("sb_") ? { apikey: env.key } : { apikey: env.key, Authorization: `Bearer ${env.key}` };

export const publicObjectUrl = (env: SupabaseEnv, path: string) => `${env.url}/storage/v1/object/public/${BUCKET}/${path}`;
