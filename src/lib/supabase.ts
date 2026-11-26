// Akses Supabase lewat REST dengan service role key. Hanya dipakai di server; kunci ini
// tidak boleh pernah sampai ke browser (jangan beri awalan NEXT_PUBLIC_).

export const BUCKET = "portfolio";

export interface SupabaseEnv {
  url: string;
  key: string;
}

export function supabaseEnv(): SupabaseEnv | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

export const authHeaders = (env: SupabaseEnv) => ({ apikey: env.key, Authorization: `Bearer ${env.key}` });

export const publicObjectUrl = (env: SupabaseEnv, path: string) => `${env.url}/storage/v1/object/public/${BUCKET}/${path}`;
