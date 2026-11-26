-- Skema untuk mode admin. Jalankan sekali di Supabase: SQL Editor → New query → tempel → Run.
-- Aman dijalankan ulang.

-- 1) Tabel isi website: satu baris per bagian (site, stats, projects, timeline, skills, certificates).
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS dinyalakan dan SENGAJA tanpa policy: data ini hanya diakses server situs lewat
-- service role key (yang melewati RLS). Kunci anon/publik tidak bisa membaca atau menulis apa pun.
alter table public.site_content enable row level security;

-- 2) Bucket gambar proyek. Publik untuk dibaca (supaya gambar tampil di situs),
-- tapi unggah/hapus hanya lewat server situs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];
