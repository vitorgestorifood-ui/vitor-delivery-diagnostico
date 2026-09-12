import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (payload.honeypot) return NextResponse.json({ ok: true });
    if (!payload.name || !payload.whatsapp || !payload.city || !payload.consent) return NextResponse.json({ error: "Dados obrigatórios ausentes." }, { status: 400 });
    const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
    const token = process.env.GOOGLE_APPS_SCRIPT_TOKEN;
    if (!endpoint || !token) return NextResponse.json({ ok: true, configured: false });
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, token, pageVersion: "v1" }) });
    if (!response.ok) return NextResponse.json({ error: "Não foi possível registrar o lead." }, { status: 502 });
    return NextResponse.json({ ok: true, configured: true });
  } catch { return NextResponse.json({ error: "Não foi possível processar o envio." }, { status: 500 }); }
}
