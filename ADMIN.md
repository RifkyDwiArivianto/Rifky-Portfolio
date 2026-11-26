# Mode admin

Halaman `/admin` untuk mengubah isi website tanpa menyentuh kode: profil dan kontak, statistik,
proyek (termasuk unggah gambar galeri), pengalaman, keahlian, dan sertifikat.

Perubahan disimpan di Supabase dan langsung tampil di situs, tanpa deploy ulang.
Kalau Supabase belum diatur atau sedang bermasalah, situs otomatis memakai isi bawaan di `src/data/`,
jadi halaman publik tidak pernah rusak.

## Pengaturan sekali di awal

1. **Buat proyek Supabase** (gratis) di https://supabase.com.
2. Buka **SQL Editor → New query**, tempel isi `supabase/schema.sql`, lalu **Run**.
   Ini membuat tabel `site_content` dan bucket gambar `portfolio`.
3. Ambil **Project URL** dan **service_role key** di *Project Settings → API*.
   Kunci `service_role` itu rahasia: hanya taruh di environment variable Vercel, jangan di kode atau chat.
4. Di Vercel: **Settings → Environment Variables**, tambahkan empat nilai
   (contohnya ada di `.env.example`):

   | Nama | Isi |
   | --- | --- |
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
   | `ADMIN_PASSWORD` | kata sandi pilihanmu (minimal 8 karakter) |
   | `ADMIN_SESSION_SECRET` | teks acak minimal 16 karakter |

5. **Deploy ulang** (Deployments → Redeploy). Ini wajib, karena alamat Supabase dipakai saat build
   untuk mengizinkan gambar yang kamu unggah.
6. Buka `https://rifkyportfolio.vercel.app/admin` dan masuk dengan kata sandi tadi.

## Cara pakai

- Pilih bagian di baris tab, ubah isinya, lalu tekan **Simpan perubahan**. Titik ● di tab berarti
  bagian itu punya perubahan yang belum disimpan.
- Daftar (proyek, pengalaman, sertifikat, dan sebagainya) bisa ditambah, dihapus, dan diurutkan dengan
  tombol **↑ Naik / ↓ Turun**. Ketuk satu entri untuk membuka isinya.
- **Gambar proyek**: pilih berkas PNG/JPG/WebP. Gambar otomatis dikecilkan (maks. 1600 px) dan diubah ke WebP
  sebelum diunggah. Tekan **Simpan** setelah unggahan selesai.
- **Kembalikan ke bawaan** menghapus isi tersimpan untuk bagian itu, dan situs kembali memakai isi di kode.
- Bagian yang belum pernah disimpan memakai isi bawaan dari `src/data/`. Jadi mulai saja dari bagian
  mana pun; tidak ada yang perlu diimpor dulu.
- Bisa dibuka dari HP.

## Hal yang perlu diketahui

- Setelah menyimpan, situs publik diperbarui seketika. Halaman lain yang sudah di-cache browser
  bisa butuh satu kali muat ulang.
- Tombol "Lihat proyek" di pengalaman hanya muncul bila proyek yang dipilih masih ada.
- Gambar yang diganti atau dihapus tidak otomatis hilang dari Storage. Bersihkan manual di Supabase
  (Storage → portfolio) bila perlu; ukurannya kecil.
- Teks panduan interaktif, diagram use case di bagian atas, dan gaya tampilan tetap di kode;
  admin hanya mengubah isi.
- Kata sandi salah 5 kali dari satu alamat IP mengunci percobaan login selama 10 menit.
  Ganti `ADMIN_PASSWORD` dan `ADMIN_SESSION_SECRET` di Vercel bila curiga bocor; mengganti rahasia sesi
  langsung mengeluarkan semua sesi yang sedang masuk.

## Dev lokal

```bash
cp .env.example .env.local   # isi nilainya
npm install
npm run dev                  # http://localhost:3000/admin
```
