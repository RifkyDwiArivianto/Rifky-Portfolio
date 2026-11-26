"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Gagal masuk.");
    } catch {
      setError("Tidak bisa menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="adm adm-narrow">
      <form className="adm-card" onSubmit={submit}>
        <p className="eyebrow">Admin</p>
        <h1 className="adm-title">Masuk</h1>
        <label className="adm-field">
          <span className="adm-label">Kata sandi</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </label>
        {error && (
          <p className="adm-notice error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn primary" disabled={loading || !password}>
          {loading ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
