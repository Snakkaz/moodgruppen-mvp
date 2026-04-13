import { NextRequest, NextResponse } from "next/server";

// Semrush SEO API — demo endpoint with realistic mock data
// Ready for real Semrush API when key is added

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: "up" | "down" | "stable";
  position?: number;
}

async function getSeoData(query: string, domain?: string): Promise<{
  keywords: KeywordData[];
  domainAuthority?: number;
  organicTraffic?: number;
  backlinks?: number;
}> {
  const apiKey = process.env.SEMRUSH_API_KEY;

  if (apiKey) {
    // Real Semrush API integration
    // TODO: implement when API key is available
    return { keywords: [] };
  }

  // Demo mode — generate realistic mock data based on query
  const demoKey = process.env.DEMO_GEMINI_KEY;
  if (demoKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${demoKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Du er en SEO-ekspert. Generer 8 relevante søkeord for "${query}"${domain ? ` (domene: ${domain})` : ""}.

For hvert søkeord, gi:
- keyword: søkeordet
- volume: månedlig søkevolum (realistisk norsk marked, 100-50000)
- difficulty: vanskelighetsgrad 1-100
- cpc: kostnad per klikk i NOK (1-50)
- trend: "up", "down" eller "stable"

Svar BARE med JSON-array, ingen annen tekst:
[{"keyword":"...","volume":...,"difficulty":...,"cpc":...,"trend":"..."}]`
              }]
            }]
          }),
          signal: AbortSignal.timeout(25000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const textPart = parts.find((p: { thought?: boolean; text?: string }) => !p.thought && p.text) || parts[0];
        const text = textPart?.text || "";
        // Extract JSON array from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const keywords: KeywordData[] = JSON.parse(jsonMatch[0]);
          return {
            keywords: keywords.slice(0, 8),
            domainAuthority: Math.floor(Math.random() * 40) + 20,
            organicTraffic: Math.floor(Math.random() * 5000) + 500,
            backlinks: Math.floor(Math.random() * 1000) + 100,
          };
        }
      }
    } catch { /* fall through to static */ }
  }

  // Static fallback
  return {
    keywords: [
      { keyword: query, volume: 2400, difficulty: 45, cpc: 8.5, trend: "up" },
      { keyword: `${query} oslo`, volume: 880, difficulty: 32, cpc: 6.2, trend: "up" },
      { keyword: `beste ${query}`, volume: 1200, difficulty: 58, cpc: 12.0, trend: "stable" },
      { keyword: `${query} pris`, volume: 720, difficulty: 28, cpc: 15.5, trend: "up" },
    ],
    domainAuthority: 35,
    organicTraffic: 1250,
    backlinks: 340,
  };
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "markedsføring";
  const domain = req.nextUrl.searchParams.get("domain") || undefined;
  const data = await getSeoData(query, domain);
  return NextResponse.json(data);
}
