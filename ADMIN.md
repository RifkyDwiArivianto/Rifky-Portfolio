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
3. Ambil **Project URL** dan **secret key** (atau `service_role` key versi lama) di *Project Settings → API Keys*.
   Kunci itu rahasia: hanya taruh di environment variable Vercel, jangan di kode atau chat.
   Bila kamu memakai integrasi Vercel–Supabase, variabelnya dibuat otomatis dan langkah 3–4 bisa dilewati.
4. Di Vercel: **Settings → Environment Variables**, pastikan ada empat nilai berikut
   (contohnya ada di `.env.example`):

   | Nama | Isi |
   | --- | --- |
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_SECRET_KEY` atau `SUPABASE_SERVICE_ROLE_KEY` | secret key / service_role key (salah satu) |
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

## Kalau proyek Supabase ter-pause

- **Situs tetap menayangkan halaman terakhir yang berhasil dibuat**, yaitu isi hasil editanmu terakhir. Next.js
  mencoba memperbaruinya lagi pada kunjungan berikutnya, dan begitu proyek aktif, isi terbaru muncul sendiri.
  Isi bawaan dari kode hanya dipakai bila Supabase memang belum diatur.
- **Admin** menampilkan peringatan "Database tidak terjangkau" dan tombol simpan dimatikan.
- **Deploy baru akan gagal** dengan pesan *"Konten tidak bisa dibaca dari database..."*. Ini disengaja: situs lama
  tetap tayang dan isi editanmu tidak tertimpa isi bawaan. Tekan **Resume project** di dashboard Supabase,
  lalu Redeploy.
- **Gambar yang kamu unggah lewat admin** disimpan di Supabase Storage, jadi bisa tidak tampil selama proyek
  ter-pause. Gambar bawaan yang ada di folder `public/` tidak terpengaruh.
- Mencegahnya: kunjungan ke situs atau membuka `/admin` dihitung sebagai aktivitas, jadi buka `/admin`
  sekali seminggu.

## Memperbarui kode tanpa kehilangan isi

- Isi yang kamu ubah lewat admin **tersimpan di database Supabase, bukan di kode**. Push atau ekstrak zip tidak
  menghapusnya.
- Bagian yang pernah kamu simpan lewat admin **mengalahkan** isi bawaan di `src/data/`. Jadi bila kode baru mengubah
  `src/data/*.ts` untuk bagian itu, perubahannya tidak terlihat. Ubah lewat admin, atau tekan
  **Kembalikan ke bawaan** di bagian itu. Admin menunjukkan status tiap bagian: "Memakai isi yang kamu simpan"
  atau "Masih memakai isi bawaan".
- Mengekstrak zip **menimpa file kode yang sama di komputermu**. Kalau kamu pernah mengedit file langsung (bukan
  lewat admin) dan belum di-push, commit dulu perubahan itu, ekstrak zip, lalu cek `git diff` dan kembalikan yang
  tidak diinginkan dengan `git checkout -- <file>`.

## Keamanan

**Sudah otomatis di kode:** cookie login `HttpOnly`, `Secure`, `SameSite=Strict` (di produksi memakai awalan `__Host-`);
setiap permintaan admin dicek asalnya dan sesinya; semua isian divalidasi di server (tautan hanya `http(s)`, teks
selalu di-escape); unggahan gambar dicek isinya (PNG/JPG/WebP asli, maksimal 4 MB), bukan sekadar labelnya;
halaman admin tidak di-cache dan tidak diindeks mesin pencari; kunci Supabase hanya ada di server;
tabel database dikunci RLS; situs mengirim header keamanan (CSP, anti-iframe, anti-sniffing, HSTS).

**Yang perlu kamu lakukan sendiri:**

1. **Batasi percobaan login di Vercel Firewall** (gratis, Hobby boleh 1 aturan). Ini lebih kuat daripada pembatas
   bawaan di kode, yang hanya hidup di memori server. Buka proyek → **Firewall** → **Configure** → **+ New Rule**:
   nama "Batasi login admin"; kondisi **Request Path** *Equals* `/api/admin/login`; **Then**: *Rate Limit*,
   *Fixed Window*, jendela **10 menit**, batas **10** permintaan, kunci **IP**, aksi *Too Many Requests (429)*.
   Simpan, lalu **Review Changes → Publish**.
2. **Aktifkan verifikasi dua langkah (2FA)** di akun GitHub, Vercel, Supabase, dan emailmu. Itu pintu masuk yang
   paling sering dibobol, dan siapa pun yang menguasainya bisa mengubah situs tanpa melewati halaman admin.
3. **Kata sandi admin panjang dan unik**, sebaiknya 16 karakter atau lebih dari pengelola kata sandi. Kalau curiga
   bocor, ganti `ADMIN_PASSWORD` dan `ADMIN_SESSION_SECRET` di Vercel lalu redeploy.
4. **Perbarui dependensi tiap bulan:** `npm outdated`, `npm update`, `npm audit`, lalu `npm run build` dan push.
   Next.js beberapa kali merilis tambalan keamanan sepanjang 2026, dan versi di `package-lock.json` hanya
   berubah bila kamu memperbaruinya. Versi terkunci saat ini (Next.js 16.4.6, React 19.3.1, sharp 0.35.5)
   sudah mencakup tambalan Mei dan Oktober 2026. Perhatikan juga email keamanan dari GitHub dan Vercel.
5. **Jangan pernah commit `.env.local`** atau menempel kunci di chat. Kalau kunci Supabase bocor, ganti di
   *Supabase → Project Settings → API Keys*, lalu perbarui nilainya di Vercel.
6. **Cek CSP setelah deploy:** buka situs, tekan F12 → Console, dan pastikan tidak ada pesan
   *"Content Security Policy"*. Kalau ada elemen yang rusak karenanya, hapus satu entri
   `Content-Security-Policy` di `next.config.ts` (header lain tidak terpengaruh) dan kabari agar kebijakannya disesuaikan.

## Dev lokal

```bash
cp .env.example .env.local   # isi nilainya
npm install
npm run dev                  # http://localhost:3000/admin
```
