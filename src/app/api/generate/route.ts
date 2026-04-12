import { NextRequest, NextResponse } from "next/server";

const AGENT_PROMPTS: Record<string, (client: Record<string, string>, channel: string) => string> = {
  strategist: (client, channel) =>
    `Du er en senior mediestrateg i et norsk markedsføringsbyrå. Analyser kort (2-3 setninger) hvorfor ${channel} er riktig kanal for ${client.name} (${client.industry}) med målgruppe ${client.audience || "bred"}. Vær konkret og datadrevet. Skriv på norsk.`,

  content: (client, channel) => {
    const channelGuide: Record<string, string> = {
      "Instagram Post": "Skriv en engasjerende Instagram-post (maks 200 ord). Bruk relevante hashtags.",
      "LinkedIn Post": "Skriv en profesjonell LinkedIn-post (200-400 ord). Bruk avsnitt og punktlister.",
      "Facebook Ad": "Skriv en Facebook-annonse med sterk hook, kort brødtekst og tydelig CTA.",
      "Google Ads": "Skriv 3 overskrifter (maks 30 tegn) og 2 beskrivelser (maks 90 tegn).",
      "Blogginnlegg": "Skriv et blogginnlegg (500-800 ord) med overskrifter og struktur.",
    };
    return `Du er en erfaren innholdsprodusent i et norsk markedsføringsbyrå. Skriv innhold for ${client.name} (${client.industry}).
Tone of voice: ${client.tone}. Målgruppe: ${client.audience || "Ikke spesifisert"}.
${client.guidelines ? `Brand guidelines: ${client.guidelines}` : ""}
${channelGuide[channel] || "Skriv tilpasset innhold."}
Skriv KUN innholdet på norsk med korrekt æøå. Ingen meta-tekst eller forklaringer.`;
  },

  seo: (client, channel) =>
    `Du er en SEO-spesialist. Gi 3-5 konkrete SEO-anbefalinger for dette ${channel}-innholdet for ${client.name} (${client.industry}). Inkluder søkeord, metabeskrivelse-forslag og strukturtips. Kort og konkret, maks 150 ord. Skriv på norsk.`,

  analyst: (client, channel) =>
    `Du er en markedsanalytiker. Gi en kort evaluering (3-4 punkter) av ${channel}-innhold for ${client.name}. Vurder: målgruppetreff, tone-konsistens, CTA-styrke, og forbedringsforslag. Maks 100 ord. Skriv på norsk.`,
};

async function callAI(systemPrompt: string, userMessage: string, apiKey: string, model: string, provider: string): Promise<string | null> {
  const urls: Record<string, string> = {
    github: "https://models.github.ai/inference/chat/completions",
    openai: "https://api.openai.com/v1/chat/completions",
  };
  const url = urls[provider] || urls.github;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { client, channel, brief, settings } = await req.json();

    const apiKey = settings?.apiKey || process.env.GITHUB_TOKEN || "";
    const model = settings?.model || "openai/gpt-4.1-mini";
    const provider = settings?.provider || "github";

    if (!apiKey) {
      return NextResponse.json({ error: "Ingen API-nøkkel. Gå til Innstillinger for å legge til." }, { status: 400 });
    }

    const results: Record<string, string | null> = {};

    // Run all agents in parallel
    const [strategist, content, seo, analyst] = await Promise.all([
      callAI(AGENT_PROMPTS.strategist(client, channel), `Brief: ${brief}`, apiKey, model, provider),
      callAI(AGENT_PROMPTS.content(client, channel), brief, apiKey, model, provider),
      callAI(AGENT_PROMPTS.seo(client, channel), `Kunde: ${client.name}, Bransje: ${client.industry}, Kanal: ${channel}, Brief: ${brief}`, apiKey, model, provider),
      callAI(AGENT_PROMPTS.analyst(client, channel), `Kanal: ${channel}, Brief: ${brief}, Målgruppe: ${client.audience}`, apiKey, model, provider),
    ]);

    results.strategist = strategist;
    results.content = content;
    results.seo = seo;
    results.analyst = analyst;

    return NextResponse.json({ results, agents: ["strategist", "content", "seo", "analyst"] });
  } catch (e) {
    console.error("Generate API error:", e);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
