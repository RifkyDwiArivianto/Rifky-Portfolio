import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/admin-session";
import { missingEnv } from "@/lib/auth";
import { getAdminContent } from "@/lib/content";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// selalu dirender ulang: bergantung pada cookie sesi dan data terbaru
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const missing = missingEnv();
  if (missing.length) {
    return (
      <main className="adm adm-narrow">
        <div className="adm-card">
          <p className="eyebrow">Admin</p>
          <h1 className="adm-title">Belum dikonfigurasi</h1>
          <p className="adm-hint">Isi pengaturan berikut di Vercel (Settings → Environment Variables), lalu deploy ulang. Panduan lengkap ada di ADMIN.md.</p>
          <ul className="adm-envs">
            {missing.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  if (!(await isAdmin())) return <LoginForm />;

  const { values, customized, connected } = await getAdminContent();
  return <AdminApp initial={values} customized={customized} connected={connected} />;
}
