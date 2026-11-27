import { NextResponse } from "next/server";
import { clearLoginFailures, clientIp, json, loginBlocked, recordLoginFailure, sameOrigin } from "@/lib/admin-api";
import { SESSION_COOKIE, SESSION_SECONDS, createSessionToken, missingEnv, passwordMatches } from "@/lib/auth";

export async function POST(req: Request) {
  if (missingEnv().length) return json({ error: "Mode admin belum dikonfigurasi di server." }, 503);
  if (!sameOrigin(req)) return json({ error: "Permintaan ditolak." }, 403);

  const ip = clientIp(req);
  if (loginBlocked(ip)) return json({ error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." }, 429);

  let password = "";
  try {
    const text = await req.text();
    const body = text.length <= 10_000 ? (JSON.parse(text) as { password?: unknown }) : {};
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    // body kosong atau bukan JSON: dianggap kata sandi salah
  }

  if (!passwordMatches(password)) {
    recordLoginFailure(ip);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return json({ error: "Kata sandi salah." }, 401);
  }

  clearLoginFailures(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}
