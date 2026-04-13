import { NextRequest, NextResponse } from "next/server";
import { AGENTS, DEFAULT_SOULS } from "@/lib/store";

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
    return `Du er en erfaren innholdsprodusent i et norsk byrå. Skriv innhold for ${client.name} (${client.industry}).
Tone: ${client.tone}. Målgruppe: ${client.audience || "Ikke spesifisert"}.
${client.guidelines ? `Brand guidelines: ${client.guidelines}` : ""}
${channelGuide[channel] || "Skriv tilpasset innhold."}
Skriv KUN innholdet på norsk. Ingen meta-tekst.`;
  },

  seo: (client, channel) =>
    `Du er en SEO-spesialist. Gi 3-5 konkrete SEO-anbefalinger for dette ${channel}-innholdet for ${client.name} (${client.industry}). Inkluder søkeord, metabeskrivelse-forslag og strukturtips. Kort og konkret, maks 150 ord. Skriv på norsk.`,

  analyst: (client, channel) =>
    `Du er en markedsanalytiker. Gi en kort evaluering (3-4 punkter) av ${channel}-innhold for ${client.name}. Vurder: målgruppetreff, tone-konsistens, CTA-styrke, og forbedringsforslag. Maks 100 ord. Skriv på norsk.`,
};

const FETCH_TIMEOUT = 25000;

async function callAI(
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
  model: string,
  provider: string
): Promise<string | null> {
  // Demo mode — Gemma via Gemini API
  if (provider === "demo") {
    const demoKey = process.env.DEMO_GEMINI_KEY;
    if (!demoKey) return null;
    const demoModel = model || "gemma-3-4b-it";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${demoModel}:generateContent?key=${demoKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt + "\n\n" + userMessage }] }] }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) return null;
      const data = await res.json();
      // Gemma 4 models return thought parts first — find the non-thought part
      const parts = data.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p: { thought?: boolean; text?: string }) => !p.thought && p.text) || parts[0];
      return textPart?.text || null;
    } catch { return null; }
  }

  if (!apiKey || !model || !provider) return null;

  try {
    // --- Anthropic Messages API ---
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
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.content?.[0]?.text || null;
    }

    // --- Google Gemini ---
    if (provider === "google") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\n" + userMessage }] }],
        }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p: { thought?: boolean; text?: string }) => !p.thought && p.text) || parts[0];
      return textPart?.text || null;
    }

    // --- DeepSeek ---
    if (provider === "deepseek") {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
          temperature: 0.8, max_tokens: 1500,
        }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    }

    // --- xAI (Grok) ---
    if (provider === "xai") {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
          temperature: 0.8, max_tokens: 1500,
        }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    }

    // --- Ollama (lokal) ---
    if (provider === "ollama") {
      const baseUrl = apiKey.startsWith("http") ? apiKey : "http://localhost:11434";
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
          stream: false,
        }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.message?.content || null;
    }

    // --- OpenAI-compatible (GitHub Models, OpenAI, Groq, Perplexity, MiniMax) ---
    const urls: Record<string, string> = {
      github: "https://models.github.ai/inference/chat/completions",
      openai: "https://api.openai.com/v1/chat/completions",
      groq: "https://api.groq.com/openai/v1/chat/completions",
      perplexity: "https://api.perplexity.ai/chat/completions",
      minimax: "https://api.minimax.chat/v1/text/chatcompletion_v2",
    };
    const url = urls[provider] || urls.openai;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
        temperature: 0.8, max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { client, channel, brief, agentSettings, testMode, testAgent, testSlot } = body;

    const results: Record<string, { primary: string | null; secondary: string | null }> = {};

    if (testMode && testAgent) {
      const agent = AGENTS.find(a => a.id === testAgent);
      if (!agent) return NextResponse.json({ results });
      const config = agentSettings?.[agent.id];
      if (!config) return NextResponse.json({ results });
      const promptFn = AGENT_PROMPTS[agent.id];
      const contextPrompt = config.soul || (promptFn ? promptFn(client, channel) : DEFAULT_SOULS[agent.id] || "Du er en hjelpsom AI-assistent.");
      const userMessage = `Brief: ${brief}`;
      if (testSlot === "primary") {
        results[agent.id] = { primary: await callAI(contextPrompt, userMessage, config.primaryApiKey, config.primaryModel, config.primaryProvider), secondary: null };
      } else {
        results[agent.id] = { primary: null, secondary: await callAI(contextPrompt, userMessage, config.secondaryApiKey, config.secondaryModel, config.secondaryProvider) };
      }
      return NextResponse.json({ results });
    }

    // Fase 1: Kjor strateg, innhold, SEO parallelt
    const phase1Agents = AGENTS.filter(a => a.id !== "analyst");
    const phase1Promises = phase1Agents.map(async (agent) => {
      const config = agentSettings?.[agent.id];
      if (!config) return;
      const promptFn = AGENT_PROMPTS[agent.id];
      const contextPrompt = config.soul || (promptFn ? promptFn(client, channel) : DEFAULT_SOULS[agent.id] || "");
      const userMessage = `Brief: ${brief}`;
      const [primary, secondary] = await Promise.all([
        callAI(contextPrompt, userMessage, config.primaryApiKey, config.primaryModel, config.primaryProvider),
        callAI(contextPrompt, userMessage, config.secondaryApiKey, config.secondaryModel, config.secondaryProvider),
      ]);
      results[agent.id] = { primary, secondary };
    });
    await Promise.all(phase1Promises);

    // Fase 2: Analyseagent — faar output fra de andre som kontekst
    const analystConfig = agentSettings?.analyst;
    if (analystConfig) {
      const otherOutput = Object.entries(results)
        .map(([id, r]) => {
          const name = AGENTS.find(a => a.id === id)?.name || id;
          return `[${name}]: ${r.primary || "(ingen output)"}`;
        })
        .join("\n\n");

      const analystPrompt = AGENT_PROMPTS.analyst
        ? AGENT_PROMPTS.analyst(client, channel)
        : (analystConfig.soul || DEFAULT_SOULS.analyst || "");

      const analystBrief = `Brief: ${brief}\n\n--- Output fra de andre agentene ---\n\n${otherOutput}\n\n--- Evaluer innholdet ovenfor ---`;

      const [primary, secondary] = await Promise.all([
        callAI(analystPrompt, analystBrief, analystConfig.primaryApiKey, analystConfig.primaryModel, analystConfig.primaryProvider),
        callAI(analystPrompt, analystBrief, analystConfig.secondaryApiKey, analystConfig.secondaryModel, analystConfig.secondaryProvider),
      ]);
      results.analyst = { primary, secondary };
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error("Generate API error:", e);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
