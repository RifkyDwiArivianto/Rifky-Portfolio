// Pastikan isi berkas benar-benar gambar PNG/JPEG/WebP, bukan sekadar berlabel demikian.
// Jenis yang dikembalikan dipakai sebagai Content-Type saat unggah, bukan label dari browser.

export type SniffedImage = "image/png" | "image/jpeg" | "image/webp";

const startsWith = (bytes: Uint8Array, sig: number[], offset = 0) => sig.every((b, i) => bytes[offset + i] === b);

export function sniffImage(bytes: Uint8Array): SniffedImage | null {
  if (bytes.length < 12) return null;
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  // WebP: "RIFF" + 4 byte ukuran + "WEBP"
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  return null;
}

export const EXTENSION: Record<SniffedImage, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
