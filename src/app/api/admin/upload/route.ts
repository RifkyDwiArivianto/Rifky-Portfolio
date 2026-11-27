import { randomUUID } from "node:crypto";
import { guard, json } from "@/lib/admin-api";
import { EXTENSION, sniffImage } from "@/lib/image-sniff";
import { BUCKET, authHeaders, publicObjectUrl, supabaseEnv } from "@/lib/supabase";

// batas isi permintaan di Vercel sekitar 4,5 MB; browser sudah mengecilkan gambar sebelum unggah
const MAX_BYTES = 4_000_000;

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const env = supabaseEnv();
  if (!env) return json({ error: "Supabase belum diatur." }, 503);

  // tolak lebih awal bila ukuran yang diumumkan sudah melebihi batas (sebelum body dibaca ke memori)
  if (Number(req.headers.get("content-length")) > MAX_BYTES + 100_000) return json({ error: "Gambar terlalu besar (maksimal 4 MB)." }, 413);

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return json({ error: "Berkas tidak terbaca." }, 400);
  }
  if (!(file instanceof File)) return json({ error: "Tidak ada berkas." }, 400);

  if (file.size > MAX_BYTES) return json({ error: "Gambar terlalu besar (maksimal 4 MB)." }, 413);

  // jenis ditentukan dari isi berkas, bukan dari label yang dikirim browser
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return json({ error: "Isi berkas bukan gambar WebP, JPG, atau PNG yang valid." }, 415);

  const path = `projects/${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${EXTENSION[type]}`;
  const res = await fetch(`${env.url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...authHeaders(env), "Content-Type": type, "Cache-Control": "max-age=31536000", "x-upsert": "false" },
    body: bytes,
    cache: "no-store",
  });
  if (!res.ok) return json({ error: `Unggahan ditolak Supabase (${res.status}). Pastikan bucket "${BUCKET}" sudah dibuat.` }, 502);

  return json({ url: publicObjectUrl(env, path) });
}
