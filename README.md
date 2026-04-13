# MoodAI — Multi-Agent Content Platform

AI-drevet innholdsplattform som bruker 4 spesialiserte agenter for å generere markedsføringsinnhold.

## Arkitektur

### Content Pipeline: Tekst → Bilde → Video

**Steg 1: Tekst (Aktiv)**
- 4 AI-agenter jobber parallelt
- Hver agent kjører primær + sekundær modell
- Agenter: Strateg, Innhold, SEO, Analyse

**Steg 2: Bilde (Planlagt)**
- Kontekst fra tekst → bildegenerering
- Midjourney, Gemini, DALL-E

**Steg 3: Video (Planlagt)**  
- Bilde + kontekst → kort video
- Kling AI, Google Veo, Runway

### Agenter

| Agent | Rolle | Anbefalt modell |
|-------|-------|-----------------|
| Strateg | Kanalstrategi og markedsanalyse | Perplexity Sonar Pro |
| Innhold | Innholdsproduksjon tilpasset tone/kanal | Claude Sonnet 4 |
| SEO | Søkeoptimalisering og nøkkelord | Gemini 2.5 Pro |
| Analyse | Evaluering og forbedringsforslag | Claude Opus 4 |

### Støttede AI-leverandører
- GitHub Models (GPT-4.1, Llama 4, DeepSeek)
- OpenAI (GPT-4.1, o3, o4)
- Anthropic (Claude Sonnet 4, Opus 4)
- Google Gemini (2.5 Pro, 2.5 Flash, Gemma)
- Groq (Llama 4, QwQ)
- Perplexity (Sonar Pro, Deep Research)
- DeepSeek (Chat, Reasoner)
- xAI (Grok 3)
- MiniMax (M2)
- Ollama (lokale modeller)

### Planlagte integrasjoner
- **n8n/Make** — Workflow-orkestrering
- **Qdrant** — RAG vektordatabase (PoC klar)
- **Semrush** — SEO-data i sanntid

## Tech Stack
- Next.js 16 + TypeScript
- Tailwind CSS v4
- Glassmorfisme UI
- Multi-provider AI med parallell kjøring
- In-memory RAG (proof-of-concept)

## Demo
Innebygd demo-modus med Gemma-modeller (gratis). Gå til Innstillinger → "Aktiver demo".

## Kjøring
```bash
npm install
npm run dev     # utvikling
npm run build   # produksjon
```

## Miljøvariabler
```
DEMO_GEMINI_KEY=din-gemini-api-nøkkel  # for demo-modus
```

## Lisens
Proprietær — Petersen Digital Consulting