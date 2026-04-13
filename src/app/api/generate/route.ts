import { NextRequest, NextResponse } from "next/server";
import { AGENTS, DEFAULT_SOULS } from "@/lib/store";

const AGENT_PROMPTS: Record<string, (client: Record<string, string>, channel: string) => string> = {
  strategist: (client, channel) =>
    `Du er en senior mediestrateg i et norsk markedsforingsbyraa. Analyser kort (2-3 setninger) hvorfor ${channel} er riktig kanal for ${client.name} (${client.industry}) med maalgruppe ${client.audience || "bred"}. Vaer konkret og datadrevet. Skriv paa norsk.`,

  content: (client, channel) => {
    const channelGuide: Record<string, string> = {
      "Instagram Post": "Skriv en engasjerende Instagram-post (maks 200 ord). Bruk relevante hashtags.",
      "LinkedIn Post": "Skriv en profesjonell LinkedIn-post (200-400 ord). Bruk avsnitt og punktlister.",
      "Facebook Ad": "Skriv en Facebook-annonse med sterk hook, kort brodtekst og tydelig CTA.",
      "Google Ads": "Skriv 3 overskrifter (maks 30 tegn) og 2 beskrivelser (maks 90 tegn).",
      "Blogginnlegg": "Skriv et blogginnlegg (500-800 ord) med overskrifter og struktur.",
    };
    return `Du er en erfaren innholdsprodusent i et norsk markedsforingsbyraa. Skriv innhold for ${client.name} (${client.industry}).
Tone of voice: ${client.tone}. Maalgruppe: ${client.audience || "Ikke spesifisert"}.
${client.guidelines ? `Brand guidelines: ${client.guidelines}` : ""}
${channelGuide[channel] || "Skriv tilpasset innhold."}
Skriv KUN innholdet paa norsk. Ingen meta-tekst eller forklaringer.`;
  },

  seo: (client, channel) =>
    `Du er en SEO-spesialist. Gi 3-5 konkrete SEO-anbefalinger for dette ${channel}-innholdet for ${client.name} (${client.industry}). Inkluder soekeord, metabeskrivelse-forslag og strukturtips. Kort og konkret, maks 150 ord. Skriv paa norsk.`,

  analyst: (client, channel) =>
    `Du er en markedsanalytiker. Gi en kort evaluering (3-4 punkter) av ${channel}-innhold for ${client.name}. Vurder: maalgruppetreff, tone-konsistens, CTA-styrke, og forbedringsforslag. Maks 100 ord. Skriv paa norsk.`,
};

async function callAI(
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
  model: string,
  provider: string
): Promise<string | null> {
  // Demo mode — use Gemma via Gemini API
  if (provider === "demo") {
    const demoKey = process.env.DEMO_GEMINI_KEY;
    if (!demoKey) return null;
    const demoModel = model || "gemma-3-12b-it";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${demoModel}:generateContent?key=${demoKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt + "\n\n" + userMessage }] }] }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch { return null; }
  }

  if (!apiKey || !model || !provider) return null;

  try {
    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1500,
          messages: [{ role: "user", content: systemPrompt + "\n\n" + userMessage }],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.content?.[0]?.text || null;
    }

    if (provider === "google") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\n" + userMessage }] }],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }

    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { client, channel, brief, agentSettings, testMode, testAgent, testSlot } = body;

    const results: Record<string, { primary: string | null; secondary: string | null }> = {};

    const agentsToRun = testMode && testAgent
      ? AGENTS.filter(a => a.id === testAgent)
      : AGENTS;

    const promises = agentsToRun.map(async (agent) => {
      const config = agentSettings?.[agent.id];
      if (!config) return;

      const promptFn = AGENT_PROMPTS[agent.id];
      const systemPrompt = config.soul || DEFAULT_SOULS[agent.id] || "Du er en hjelpsom AI-assistent.";
      const contextPrompt = promptFn ? promptFn(client, channel) : systemPrompt;
      const userMessage = `Brief: ${brief}`;

      if (testMode && testSlot) {
        if (testSlot === "primary") {
          const primary = await callAI(contextPrompt, userMessage, config.primaryApiKey, config.primaryModel, config.primaryProvider);
          results[agent.id] = { primary, secondary: null };
        } else {
          const secondary = await callAI(contextPrompt, userMessage, config.secondaryApiKey, config.secondaryModel, config.secondaryProvider);
          results[agent.id] = { primary: null, secondary };
        }
      } else {
        const [primary, secondary] = await Promise.all([
          callAI(contextPrompt, userMessage, config.primaryApiKey, config.primaryModel, config.primaryProvider),
          callAI(contextPrompt, userMessage, config.secondaryApiKey, config.secondaryModel, config.secondaryProvider),
        ]);
        results[agent.id] = { primary, secondary };
      }
    });

    await Promise.all(promises);

    return NextResponse.json({ results });
  } catch (e) {
    console.error("Generate API error:", e);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}