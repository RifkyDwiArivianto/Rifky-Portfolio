# Rifky Dwi Arivianto — Portofolio (Next.js)

Konversi dari `Rifky_Dwi_Arivianto_v1.html` ke Next.js (App Router + TypeScript).
Tampilan dan perilaku mengikuti HTML v1 (menu layar penuh di HP, navbar yang bersembunyi saat scroll,
toggle Rancang/Bangun di HP, skala font minimum 14px); yang berbeda hanya cara kodenya disusun.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm start        # jalankan hasil build
```

Butuh Node.js 20.9 atau lebih baru. Font (Unbounded, Hanken Grotesk, JetBrains Mono)
diunduh lewat `next/font/google` saat dev/build, jadi butuh koneksi internet saat itu.

## Struktur

```
public/images/projects/     gambar proyek (dulu base64 di dalam HTML)
src/
├─ app/
│  ├─ layout.tsx            font, metadata, viewport, skrip tema, impor CSS
│  └─ page.tsx              menyusun seluruh halaman
├─ components/
│  ├─ layout/               Navbar, MobileMenu, ScrollProgress, Footer, BackToTop
│  ├─ hero/                 Hero, StatsBand, UseCasePanel, UseCaseDiagram, MockScreen
│  ├─ projects/             ProjectCard, ProjectStage
│  ├─ gallery/              GalleryProvider (state), Lightbox
│  ├─ sections/             Projects, Path (Timeline + Skills), Certificates, Contact
│  └─ ui/                   SectionHead, ThemeToggle
├─ data/                    ISI KONTEN: ubah teks di sini, bukan di komponen
│  ├─ site.ts               nama, peran, email, GitHub, menu navigasi
│  ├─ projects.ts           proyek + gambar galeri
│  ├─ timeline.ts           pengalaman dan pendidikan
│  ├─ skills.ts             keahlian dan peralatan
│  ├─ certificates.ts       sertifikat
│  ├─ stats.ts              angka di hero
│  └─ usecase.ts            data diagram use case dan contoh hasil diagnosa
├─ hooks/useScrollSpy.ts    penanda menu aktif saat scroll
├─ lib/theme.ts             ganti tema terang/gelap (dipakai tombol di navbar dan di menu HP)
├─ styles/                  CSS dipisah per bagian (nama kelas sama seperti HTML asli)
└─ types/index.ts           tipe data
```

## Cara mengubah

- **Tambah proyek**: taruh gambar di `public/images/projects/`, lalu tambah satu objek di
  `src/data/projects.ts` (isi lebar/tinggi gambar yang sebenarnya).
- **Tambah pengalaman**: tambah objek di `src/data/timeline.ts`. Isi `projectId` bila ingin
  tombol "Lihat proyek" muncul.
- **Ganti warna/font/ukuran teks**: `src/styles/tokens.css` (skala teks `--t-s`, `--t-m`, `--t-l`, `--t-xl`, `--t-xxl`).

## Catatan

- Urutan impor CSS di `app/layout.tsx` menentukan cascade (aturan responsif ada di file
  yang sama dengan komponennya). Jangan diacak.
- Server Component dipakai untuk bagian statis; Client Component (`"use client"`) hanya untuk
  yang interaktif: navbar, tema, galeri, diagram use case, tombol salin email.
