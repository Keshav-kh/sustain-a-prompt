import { NextRequest, NextResponse } from "next/server";

const CEREBRAS_BASE = "https://api.cerebras.ai/v1";

export async function GET(_req: NextRequest) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing CEREBRAS_API_KEY" }, { status: 500 });
  }

  try {
    const res = await fetch(`${CEREBRAS_BASE}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // Avoid Next.js caching for live list
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Cerebras models fetch failed", detail: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "Cerebras models request error", detail: err?.message }, { status: 500 });
  }
}