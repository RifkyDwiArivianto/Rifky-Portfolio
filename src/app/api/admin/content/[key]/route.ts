import { revalidatePath } from "next/cache";
import { guard, json } from "@/lib/admin-api";
import { resetSection, saveSection } from "@/lib/content";
import { DEFAULTS, isContentKey, sanitizeSection } from "@/lib/content-schema";

type RouteContext = { params: Promise<{ key: string }> };

// satu bagian konten jauh di bawah ini; batas ini mencegah permintaan raksasa
const MAX_BODY = 1_000_000;

/** Simpan satu bagian. Data divalidasi ketat; yang tersimpan adalah versi yang sudah dibersihkan. */
export async function PUT(req: Request, { params }: RouteContext) {
  const denied = await guard(req);
  if (denied) return denied;

  const { key } = await params;
  if (!isContentKey(key)) return json({ error: "Bagian tidak dikenal." }, 404);

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: "Data terlalu besar." }, 413);
    raw = (JSON.parse(text) as { value?: unknown } | null)?.value;
  } catch {
    return json({ error: "Data tidak valid." }, 400);
  }

  const result = sanitizeSection(key, raw, false);
  if (result.errors.length) return json({ errors: result.errors }, 400);

  try {
    await saveSection(key, result.value);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Gagal menyimpan." }, 502);
  }
  revalidatePath("/", "layout");
  return json({ value: result.value });
}

/** Kembalikan satu bagian ke isi bawaan (menghapus barisnya di database). */
export async function DELETE(req: Request, { params }: RouteContext) {
  const denied = await guard(req);
  if (denied) return denied;

  const { key } = await params;
  if (!isContentKey(key)) return json({ error: "Bagian tidak dikenal." }, 404);

  try {
    await resetSection(key);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Gagal mengembalikan." }, 502);
  }
  revalidatePath("/", "layout");
  return json({ value: DEFAULTS[key] });
}
