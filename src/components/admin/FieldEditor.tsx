"use client";

import { useState, type ReactNode, type SyntheticEvent } from "react";
import { emptyObject, type Field } from "@/lib/content-schema";
import { shrinkImage } from "./image";

export interface EditorEnv {
  /** daftar proyek yang sedang diedit, untuk pilihan "Proyek terkait" */
  projects: { id: string; title: string }[];
  /** true selama unggahan berjalan; seluruh formulir dikunci agar tidak ada perubahan yang tertimpa */
  setBusy: (busy: boolean) => void;
}

type Obj = Record<string, unknown>;
const asObj = (v: unknown): Obj => (typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Obj) : {});
const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const asStr = (v: unknown) => (typeof v === "string" ? v : "");

interface FieldProps<F extends Field = Field> {
  field: F;
  value: unknown;
  onChange: (value: unknown) => void;
  env: EditorEnv;
}

function Labeled({ field, hint, children }: { field: { label: string; required?: boolean }; hint?: string; children: ReactNode }) {
  return (
    <label className="adm-field">
      <span className="adm-label">
        {field.label}
        {field.required && <b aria-hidden="true"> *</b>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function FieldNode({ field, value, onChange, env }: FieldProps) {
  switch (field.type) {
    case "text":
      return (
        <Labeled field={field} hint={field.hint}>
          {field.multiline ? (
            <textarea rows={4} value={asStr(value)} maxLength={field.max} onChange={(e) => onChange(e.target.value)} />
          ) : (
            <input type="text" value={asStr(value)} maxLength={field.max} onChange={(e) => onChange(e.target.value)} />
          )}
        </Labeled>
      );
    case "url":
      return (
        <Labeled field={field} hint={field.hint}>
          <input
            type="text"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="https://"
            value={asStr(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        </Labeled>
      );
    case "email":
      return (
        <Labeled field={field}>
          <input type="email" autoCapitalize="none" spellCheck={false} value={asStr(value)} onChange={(e) => onChange(e.target.value)} />
        </Labeled>
      );
    case "number":
      return (
        <Labeled field={field} hint={field.hint}>
          <input
            type="number"
            inputMode="numeric"
            min={field.min}
            max={field.max}
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </Labeled>
      );
    case "bool":
      return (
        <label className="adm-check">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          <span>{field.label}</span>
        </label>
      );
    case "select": {
      const options = field.optionsFrom === "projects" ? env.projects.map((p) => ({ value: p.id, label: p.title })) : field.options;
      const withBlank = field.optionsFrom || !field.required ? [{ value: "", label: "(tidak ada)" }, ...options] : options;
      const current = asStr(value);
      return (
        <Labeled field={field}>
          <select value={withBlank.some((o) => o.value === current) ? current : ""} onChange={(e) => onChange(e.target.value)}>
            {withBlank.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Labeled>
      );
    }
    case "lines":
      return (
        <Labeled field={field} hint={field.hint}>
          <textarea
            rows={4}
            value={asArr(value).map(asStr).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
        </Labeled>
      );
    case "group":
      return (
        <fieldset className="adm-group">
          <legend>{field.label}</legend>
          <GroupFields fields={field.fields} value={value} onChange={onChange} env={env} />
        </fieldset>
      );
    case "list":
      return <ListNode field={field} value={value} onChange={onChange} env={env} />;
    case "id":
    case "image":
      return null; // ditangani GroupFields
  }
}

export function GroupFields({ fields, value, onChange, env }: { fields: Field[]; value: unknown; onChange: (v: unknown) => void; env: EditorEnv }) {
  const obj = asObj(value);
  return (
    <>
      {fields.map((f) => {
        if (f.type === "id") return null;
        if (f.type === "image") {
          return <ImageField key={f.key} field={f} value={obj} onChange={(patch) => onChange({ ...obj, ...patch })} env={env} />;
        }
        return <FieldNode key={f.key} field={f} value={obj[f.key]} onChange={(v) => onChange({ ...obj, [f.key]: v })} env={env} />;
      })}
    </>
  );
}

export function ListNode({
  field,
  value,
  onChange,
  env,
  hideLabel,
}: FieldProps<Extract<Field, { type: "list" }>> & { hideLabel?: boolean }) {
  const items = asArr(value);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const canAdd = !field.max || items.length < field.max;

  const update = (index: number, item: unknown) => onChange(items.map((x, i) => (i === index ? item : x)));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setOpen({});
    onChange(copy);
  };
  const remove = (index: number) => {
    if (!window.confirm(`Hapus ${field.itemLabel} ${index + 1}?`)) return;
    setOpen({});
    onChange(items.filter((_, i) => i !== index));
  };
  const add = () => {
    onChange([...items, emptyObject(field.fields)]);
    setOpen({ [items.length]: true });
  };

  return (
    <div className="adm-list">
      {!hideLabel && <h4 className="adm-sub">{field.label}</h4>}
      {items.length === 0 && <p className="adm-empty">Belum ada {field.itemLabel.toLowerCase()}.</p>}
      {items.map((raw, i) => {
        const item = asObj(raw);
        const title = asStr(item[field.titleKey]).trim();
        return (
          <details
            key={i}
            className="adm-item"
            open={!!open[i]}
            onToggle={(e: SyntheticEvent<HTMLDetailsElement>) => {
              const isOpen = e.currentTarget.open;
              setOpen((prev) => (!!prev[i] === isOpen ? prev : { ...prev, [i]: isOpen }));
            }}
          >
            <summary>
              <span className="adm-num">{i + 1}</span>
              <span className="adm-sum">{title || "(belum diisi)"}</span>
            </summary>
            <div className="adm-item-body">
              <GroupFields fields={field.fields} value={item} onChange={(v) => update(i, v)} env={env} />
              <div className="adm-item-actions">
                <button type="button" className="btn sm ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑ Naik
                </button>
                <button type="button" className="btn sm ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                  ↓ Turun
                </button>
                <button type="button" className="btn sm ghost adm-danger" onClick={() => remove(i)}>
                  Hapus
                </button>
              </div>
            </div>
          </details>
        );
      })}
      {canAdd ? (
        <button type="button" className="btn sm" onClick={add}>
          + Tambah {field.itemLabel.toLowerCase()}
        </button>
      ) : (
        <p className="adm-empty">Sudah mencapai batas {field.max} item.</p>
      )}
    </div>
  );
}

function ImageField({
  field,
  value,
  onChange,
  env,
}: {
  field: Extract<Field, { type: "image" }>;
  value: Obj;
  onChange: (patch: Obj) => void;
  env: EditorEnv;
}) {
  const src = asStr(value[field.key]);
  const [status, setStatus] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    env.setBusy(true);
    setStatus("Mengecilkan dan mengunggah…");
    try {
      const { blob, width, height } = await shrinkImage(file);
      const body = new FormData();
      body.append("file", new File([blob], "gambar.webp", { type: "image/webp" }));
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Unggahan gagal.");
      onChange({ [field.key]: data.url, width, height });
      setStatus("Gambar terunggah. Tekan Simpan untuk menerapkannya.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unggahan gagal.");
    } finally {
      env.setBusy(false);
    }
  }

  return (
    <div className="adm-field">
      <span className="adm-label">
        {field.label} <b aria-hidden="true">*</b>
      </span>
      {src && (
        <div className="adm-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" />
        </div>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const input = e.currentTarget;
          const file = input.files?.[0];
          input.value = "";
          void pick(file);
        }}
      />
      <small>{status || (src ? "Pilih berkas baru untuk mengganti." : "PNG, JPG, atau WebP. Otomatis dikecilkan.")}</small>
    </div>
  );
}
