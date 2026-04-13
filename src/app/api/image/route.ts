import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, style, provider, model: requestModel, apiKey: requestApiKey } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt er påkrevd' }, { status: 400 });
    }

    const fullPrompt = style && style !== 'Ingen' ? `${style} stil: ${prompt}` : prompt;

    const apiKey = requestApiKey && requestApiKey !== "demo" ? requestApiKey : process.env.DEMO_GEMINI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API-nøkkel er ikke konfigurert' }, { status: 500 });
    }

    const model = requestModel || 'gemini-2.5-flash-image';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errBody = await res.text();
      if (res.status === 429) {
        return NextResponse.json({ error: 'Rate limit nådd. Prøv igjen om noen minutter.' }, { status: 429 });
      }
      return NextResponse.json({ error: `Gemini API feil (${res.status}): ${errBody.slice(0, 200)}` }, { status: 502 });
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!parts || !Array.isArray(parts)) {
      return NextResponse.json({ error: 'Uventet respons fra Gemini' }, { status: 502 });
    }

    const imagePart = parts.find((p: Record<string, unknown>) => p.inlineData);
    const textPart = parts.find((p: Record<string, unknown>) => typeof p.text === 'string');

    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: 'Ingen bilde i responsen' }, { status: 502 });
    }

    const { mimeType, data: b64 } = imagePart.inlineData;
    return NextResponse.json({
      image: `data:${mimeType || 'image/png'};base64,${b64}`,
      text: textPart?.text || undefined,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json({ error: 'Forespørselen tok for lang tid (25s timeout)' }, { status: 504 });
    }
    return NextResponse.json({ error: `Serverfeil: ${err instanceof Error ? err.message : 'ukjent'}` }, { status: 500 });
  }
}
