import { NextRequest, NextResponse } from "next/server";

// Video generation API — supports multiple providers
// For demo: generates a placeholder/mock video concept
// Ready for real providers when API keys are added

const FETCH_TIMEOUT = 60000; // video gen takes longer

interface VideoRequest {
  prompt: string;
  imageUrl?: string; // optional: use generated image as input
  provider?: string;
  duration?: number; // seconds, default 5
  style?: string;
}

async function generateVideo(req: VideoRequest): Promise<{ videoUrl?: string; concept?: string; error?: string }> {
  const provider = req.provider || "demo";

  if (provider === "demo") {
    // Demo mode: use Gemma to generate a video concept/storyboard
    const demoKey = process.env.DEMO_GEMINI_KEY;
    if (!demoKey) return { error: "Demo-nøkkel mangler. Sjekk miljøvariabler." };

    const storyboardPrompt = `Du er en kreativ videoprodusent. Lag et kort video-konsept (storyboard med 4-6 scener) basert på denne briefen:

"${req.prompt}"

${req.style ? `Stil: ${req.style}` : ""}
${req.duration ? `Varighet: ${req.duration} sekunder` : "Varighet: 5 sekunder"}
${req.imageUrl ? "Et bilde er allerede generert som utgangspunkt for videoen." : ""}

Formater som:
Scene 1 (0-1s): [beskrivelse]
Scene 2 (1-2s): [beskrivelse]
...

Inkluder kamerabevegelser, overganger, og visuell stil. Skriv på norsk.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${demoKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: storyboardPrompt }] }] }),
          signal: AbortSignal.timeout(FETCH_TIMEOUT),
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 429) return { error: "Rate limit nådd — vent litt og prøv igjen." };
        return { error: `API-feil: ${res.status} ${errData?.error?.message || ""}` };
      }
      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p: { thought?: boolean; text?: string }) => !p.thought && p.text) || parts[0];
      const concept = textPart?.text || null;
      if (!concept) return { error: "Ingen respons fra AI-modellen." };
      return { concept };
    } catch {
      return { error: "Tidsavbrudd — prøv igjen." };
    }
  }

  // Kling AI
  if (provider === "kling") {
    return { error: "Kling AI-integrasjon er planlagt. Legg til API-nøkkel i innstillinger." };
  }

  // Google Veo
  if (provider === "veo") {
    return { error: "Google Veo-integrasjon er planlagt. Krever Vertex AI-tilgang." };
  }

  // Runway
  if (provider === "runway") {
    return { error: "Runway Gen-integrasjon er planlagt. Legg til API-nøkkel i innstillinger." };
  }

  return { error: `Ukjent leverandør: ${provider}` };
}

export async function POST(req: NextRequest) {
  try {
    const body: VideoRequest = await req.json();
    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: "Prompt er påkrevd." }, { status: 400 });
    }
    const result = await generateVideo(body);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Video API error:", e);
    return NextResponse.json({ error: "Intern serverfeil." }, { status: 500 });
  }
}
