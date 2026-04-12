import { NextRequest, NextResponse } from "next/server";

const CHANNEL_INSTRUCTIONS: Record<string, string> = {
  "Instagram Post": "Skriv en kort, engasjerende Instagram-post (maks 300 ord). Bruk relevante hashtags. Skriv på norsk.",
  "LinkedIn Post": "Skriv en profesjonell LinkedIn-post (200-400 ord). Bruk avsnitt og gjerne punktlister. Skriv på norsk.",
  "Facebook Ad": "Skriv en Facebook-annonse med en sterk hook, kort brødtekst og en tydelig CTA. Skriv på norsk.",
  "Google Ads": "Skriv Google Ads med 3 overskrifter (maks 30 tegn hver) og 2 beskrivelser (maks 90 tegn hver). Skriv på norsk.",
  "Blogginnlegg": "Skriv et blogginnlegg (500-800 ord) med overskrifter, innledning, hovedpunkter og avslutning. Bruk markdown-formatering. Skriv på norsk.",
};

function buildSystemPrompt(client: { name: string; industry: string; tone: string; audience: string; guidelines: string }, channel: string) {
  return `Du er en erfaren innholdsprodusent for et norsk markedsføringsbyrå. Du skriver alltid på norsk med korrekt bruk av æøå.

Kunde: ${client.name}
Bransje: ${client.industry}
Tone of voice: ${client.tone}
Målgruppe: ${client.audience || "Ikke spesifisert"}
${client.guidelines ? `Brand guidelines: ${client.guidelines}` : ""}

${CHANNEL_INSTRUCTIONS[channel] || "Skriv innhold tilpasset kanalen. Skriv på norsk."}

Tilpass tonen nøyaktig etter kundens tone of voice. Ikke bruk emojier med mindre tonen er "Leken". Levér kun innholdet, ingen forklaringer eller meta-tekst.`;
}

export async function POST(req: NextRequest) {
  try {
    const { client, channel, brief } = await req.json();
    const systemPrompt = buildSystemPrompt(client, channel);

    // Try Ollama (local)
    try {
      const ollamaRes = await fetch("http://127.0.0.1:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen2.5-coder:7b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: brief },
          ],
          stream: false,
        }),
      });

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        const content = data.message?.content;
        if (content) {
          return NextResponse.json({ content, source: "ai" });
        }
      }
    } catch {
      // Ollama not available, continue
    }

    // Try GitHub Models
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      try {
        const res = await fetch("https://models.github.ai/inference/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-4.1-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: brief },
            ],
            temperature: 0.8,
            max_tokens: 1500,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) return NextResponse.json({ content, source: "ai" });
        }
      } catch {
        // GitHub Models not available
      }
    }

    return NextResponse.json({ error: "AI utilgjengelig", fallback: true }, { status: 500 });
  } catch (e) {
    console.error("Generate API error:", e);
    return NextResponse.json({ error: "Intern feil", fallback: true }, { status: 500 });
  }
}
