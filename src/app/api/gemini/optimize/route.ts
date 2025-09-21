import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "gemini-1.5-flash" } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_GEMINI_API_KEY not set" }, { status: 500 });
    }

    const systemInstruction = `You are a prompt optimizer focused on minimal resource consumption.
- Rewrite the user's prompt to be as short as possible while preserving intent and required constraints.
- Remove filler, pleasantries, and redundant words.
- Prefer declarative, scoped instructions over open-ended requests.
- Ask for only essential output.
- Avoid examples unless explicitly required.
- Output ONLY the optimized prompt as plain text. No preface, no markdown, no code fences.`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemInstruction}\n\nUSER_PROMPT:\n${prompt}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 160,
        candidateCount: 1,
      },
    };

    const url = `${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Fast timeouts via AbortController if needed (kept simple here)
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Gemini API error", details: text }, { status: res.status });
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    const optimizedPrompt = candidate?.content?.parts?.map((p: any) => p?.text).join("\n").trim() || "";

    // Usage metadata if provided
    const usage = data?.usageMetadata
      ? {
          prompt_tokens: data.usageMetadata.promptTokenCount ?? null,
          completion_tokens: data.usageMetadata.candidatesTokenCount ?? null,
          total_tokens: data.usageMetadata.totalTokenCount ?? null,
        }
      : null;

    return NextResponse.json({ optimizedPrompt, usage });
  } catch (e: any) {
    return NextResponse.json({ error: "Unexpected error", details: e?.message || String(e) }, { status: 500 });
  }
}