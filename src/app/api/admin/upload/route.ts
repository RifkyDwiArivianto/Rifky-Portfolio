import { randomUUID } from "node:crypto";
import { guard, json } from "@/lib/admin-api";
import { BUCKET, authHeaders, publicObjectUrl, supabaseEnv } from "@/lib/supabase";

const TYPES: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
// batas isi permintaan di Vercel sekitar 4,5 MB; browser sudah mengecilkan gambar sebelum unggah
const MAX_BYTES = 4_000_000;

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const env = supabaseEnv();
  if (!env) return json({ error: "Supabase belum diatur." }, 503);

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return json({ error: "Berkas tidak terbaca." }, 400);
  }
  if (!(file instanceof File)) return json({ error: "Tidak ada berkas." }, 400);

  const ext = TYPES[file.type];
  if (!ext) return json({ error: "Format harus WebP, JPG, atau PNG." }, 415);
  if (file.size > MAX_BYTES) return json({ error: "Gambar terlalu besar (maksimal 4 MB)." }, 413);

  const path = `projects/${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${ext}`;
  const res = await fetch(`${env.url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...authHeaders(env), "Content-Type": file.type, "Cache-Control": "max-age=31536000", "x-upsert": "false" },
    body: await file.arrayBuffer(),
    cache: "no-store",
  });
  if (!res.ok) return json({ error: `Unggahan ditolak Supabase (${res.status}). Pastikan bucket "${BUCKET}" sudah dibuat.` }, 502);

  return json({ url: publicObjectUrl(env, path) });
}
