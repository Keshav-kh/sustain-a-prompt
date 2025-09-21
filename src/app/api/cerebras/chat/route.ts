import { NextRequest, NextResponse } from "next/server";

const CEREBRAS_BASE = "https://api.cerebras.ai/v1";

export async function POST(req: NextRequest) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing CEREBRAS_API_KEY" }, { status: 500 });
  }

  try {
    const { model, prompt } = await req.json();
    if (!model || !prompt) {
      return NextResponse.json({ error: "Missing 'model' or 'prompt' in body" }, { status: 400 });
    }

    // 1) Get optimized prompt
    const optimizeRes = await fetch(`${CEREBRAS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are a prompt optimization assistant. Rewrite the user's prompt to be shorter, clearer, and token-efficient while preserving intent. Output ONLY the optimized prompt text without any explanations or formatting.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!optimizeRes.ok) {
      const text = await optimizeRes.text();
      return NextResponse.json({ error: "Cerebras chat failed", detail: text }, { status: optimizeRes.status });
    }

    const optimizeData = await optimizeRes.json();
    const optimized = optimizeData?.choices?.[0]?.message?.content?.trim?.() ?? "";

    // 2) Get concise answer to original prompt
    const answerRes = await fetch(`${CEREBRAS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Provide a concise, direct answer to the user's prompt. Keep it brief and clear without extra commentary.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    let answer: string | null = null;
    let answerUsage: any = null;
    if (answerRes.ok) {
      const answerData = await answerRes.json();
      answer = answerData?.choices?.[0]?.message?.content?.trim?.() ?? null;
      answerUsage = answerData?.usage ?? null;
    }

    return NextResponse.json({
      optimizedPrompt: optimized,
      usage: optimizeData?.usage ?? null,
      model: optimizeData?.model ?? model,
      answer,
      answerUsage,
      raw: optimizeData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Cerebras chat request error", detail: err?.message }, { status: 500 });
  }
}