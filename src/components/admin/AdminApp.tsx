"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SECTIONS, type ContentKey } from "@/lib/content-schema";
import { GroupFields, ListNode, type EditorEnv } from "./FieldEditor";

interface Props {
  initial: Record<ContentKey, unknown>;
  customized: Record<ContentKey, boolean>;
  connected: boolean;
}

type Notice = { kind: "ok" | "error"; text: string; list?: string[] } | null;

const snapshot = (value: unknown) => JSON.stringify(value);

export function AdminApp({ initial, customized: initialCustomized, connected }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<ContentKey>(SECTIONS[0].key);
  const [values, setValues] = useState(initial);
  // isi terakhir yang tersimpan, untuk mendeteksi perubahan yang belum disimpan
  const [saved, setSaved] = useState(() => Object.fromEntries(SECTIONS.map((s) => [s.key, snapshot(initial[s.key])])) as Record<ContentKey, string>);
  const [customized, setCustomized] = useState(initialCustomized);
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  const spec = SECTIONS.find((s) => s.key === active)!;
  const dirty = useMemo(() => Object.fromEntries(SECTIONS.map((s) => [s.key, snapshot(values[s.key]) !== saved[s.key]])) as Record<ContentKey, boolean>, [values, saved]);
  const anyDirty = Object.values(dirty).some(Boolean);
  const busy = saving || uploading;

  const env: EditorEnv = useMemo(
    () => ({
      projects: (Array.isArray(values.projects) ? (values.projects as { id: string; title: string }[]) : []).map((p) => ({ id: p.id, title: p.title || "(proyek tanpa judul)" })),
      setBusy: setUploading,
    }),
    [values.projects],
  );

  // peringatan bila menutup tab saat ada perubahan yang belum disimpan
  useEffect(() => {
    if (!anyDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [anyDirty]);

  useEffect(() => {
    if (notice) noticeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [notice]);

  function switchSection(key: ContentKey) {
    setActive(key);
    setNotice(null);
  }

  async function request(method: "PUT" | "DELETE") {
    const res = await fetch(`/api/admin/content/${active}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "PUT" ? JSON.stringify({ value: values[active] }) : undefined,
    });
    const data = (await res.json().catch(() => ({}))) as { value?: unknown; errors?: string[]; error?: string };
    return { res, data };
  }

  async function save() {
    setSaving(true);
    setNotice(null);
    try {
      const { res, data } = await request("PUT");
      if (res.status === 401) {
        setNotice({ kind: "error", text: "Sesi berakhir. Muat ulang halaman dan masuk lagi (perubahanmu belum hilang selama tab ini terbuka)." });
        return;
      }
      if (!res.ok) {
        setNotice({ kind: "error", text: data.errors ? "Periksa isian berikut:" : (data.error ?? "Gagal menyimpan."), list: data.errors });
        return;
      }
      setValues((prev) => ({ ...prev, [active]: data.value }));
      setSaved((prev) => ({ ...prev, [active]: snapshot(data.value) }));
      setCustomized((prev) => ({ ...prev, [active]: true }));
      setNotice({ kind: "ok", text: "Tersimpan. Halaman publik diperbarui." });
      router.refresh();
    } catch {
      setNotice({ kind: "error", text: "Tidak bisa menghubungi server." });
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!window.confirm(`Kembalikan bagian "${spec.title}" ke isi bawaan? Perubahan yang pernah kamu simpan di bagian ini akan hilang.`)) return;
    setSaving(true);
    setNotice(null);
    try {
      const { res, data } = await request("DELETE");
      if (!res.ok) {
        setNotice({ kind: "error", text: data.error ?? "Gagal mengembalikan." });
        return;
      }
      setValues((prev) => ({ ...prev, [active]: data.value }));
      setSaved((prev) => ({ ...prev, [active]: snapshot(data.value) }));
      setCustomized((prev) => ({ ...prev, [active]: false }));
      setNotice({ kind: "ok", text: "Dikembalikan ke isi bawaan." });
      router.refresh();
    } catch {
      setNotice({ kind: "error", text: "Tidak bisa menghubungi server." });
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    if (anyDirty && !window.confirm("Ada perubahan yang belum disimpan. Tetap keluar?")) return;
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      window.alert("Gagal keluar. Coba lagi.");
      return;
    }
    window.location.assign("/admin");
  }

  const onChange = (value: unknown) => setValues((prev) => ({ ...prev, [active]: value }));

  return (
    <main className="adm">
      <header className="adm-top">
        <div>
          <p className="eyebrow">Mode admin</p>
          <h1 className="adm-title">Ubah isi website</h1>
        </div>
        <div className="adm-top-actions">
          <a className="btn sm ghost" href="/" target="_blank" rel="noopener noreferrer">
            Lihat situs ↗
          </a>
          <button type="button" className="btn sm ghost" onClick={logout}>
            Keluar
          </button>
        </div>
      </header>

      {!connected && (
        <p className="adm-notice error" role="alert">
          Database tidak terjangkau, jadi yang tampil di sini adalah isi bawaan. Penyimpanan dimatikan supaya tidak menimpa data yang ada. Cek pengaturan Supabase lalu muat ulang.
        </p>
      )}

      <nav className="adm-tabs" aria-label="Bagian konten">
        {SECTIONS.map((s) => (
          <button key={s.key} type="button" className="ftab" aria-pressed={active === s.key} onClick={() => switchSection(s.key)} disabled={busy}>
            {s.title}
            {dirty[s.key] && (
              <span className="adm-dot" title="Belum disimpan">
                ●
              </span>
            )}
          </button>
        ))}
      </nav>

      <section className="adm-card" aria-labelledby="adm-section-title">
        <h2 id="adm-section-title" className="adm-h2">
          {spec.title}
        </h2>
        <p className="adm-hint">{spec.hint}</p>
        <p className="adm-state">{customized[active] ? "Memakai isi yang kamu simpan." : "Masih memakai isi bawaan dari kode."}</p>

        <fieldset className="adm-lock" disabled={busy}>
          {spec.root.type === "list" ? (
            <ListNode field={spec.root} value={values[active]} onChange={onChange} env={env} hideLabel />
          ) : (
            <GroupFields fields={spec.root.fields} value={values[active]} onChange={onChange} env={env} />
          )}
        </fieldset>

        <div ref={noticeRef} aria-live="polite">
          {notice && (
            <div className={`adm-notice ${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
              <p>{notice.text}</p>
              {notice.list && (
                <ul>
                  {notice.list.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="adm-bar">
          <button type="button" className="btn primary" onClick={save} disabled={busy || !connected || !dirty[active]}>
            {saving ? "Menyimpan…" : uploading ? "Menunggu unggahan…" : dirty[active] ? "Simpan perubahan" : "Tidak ada perubahan"}
          </button>
          <button type="button" className="btn ghost" onClick={reset} disabled={busy || !connected || !customized[active]}>
            Kembalikan ke bawaan
          </button>
        </div>
      </section>
    </main>
  );
}
