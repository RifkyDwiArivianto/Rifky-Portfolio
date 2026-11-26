import { NextResponse } from "next/server";
import { json, sameOrigin } from "@/lib/admin-api";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Permintaan ditolak." }, 403);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: SESSION_COOKIE, value: "", httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
