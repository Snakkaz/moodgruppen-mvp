"use client";
import { GlassCard, GlassButton, GlassBadge } from "@/components/ui/glass";
import { AGENTS } from "@/lib/store";
import Link from "next/link";

const agentColors: Record<string, { bg: string; border: string; dot: string; line: string }> = {
  strategist: { bg: "bg-blue-500/10 dark:bg-blue-500/15", border: "border-blue-500/30", dot: "bg-blue-500", line: "bg-blue-500/40" },
  content: { bg: "bg-purple-500/10 dark:bg-purple-500/15", border: "border-purple-500/30", dot: "bg-purple-500", line: "bg-purple-500/40" },
  seo: { bg: "bg-emerald-500/10 dark:bg-emerald-500/15", border: "border-emerald-500/30", dot: "bg-emerald-500", line: "bg-emerald-500/40" },
  analyst: { bg: "bg-amber-500/10 dark:bg-amber-500/15", border: "border-amber-500/30", dot: "bg-amber-500", line: "bg-amber-500/40" },
};

const imageProviders = ["Midjourney API", "Gemini (Nano Banana)", "DALL-E 3"];
const videoProviders = ["Kling AI", "Google Veo 3.1", "Runway Gen 4.5", "PixVerse", "Luma Dream Machine"];

const techStack = [
  { name: "Next.js", detail: "React framework" },
  { name: "TypeScript", detail: "Type-safe kode" },
  { name: "Tailwind v4", detail: "Utility-first CSS" },
  { name: "6 AI-leverandorer", detail: "GitHub, OpenAI, Anthropic, Google, Groq, Ollama" },
  { name: "Glass UI", detail: "Glassmorfisme design" },
  { name: "Parallell AI", detail: "4 agenter samtidig" },
  { name: "In-memory RAG", detail: "Vektorsok (PoC)" },
  { name: "REST API", detail: "Modulaer arkitektur" },
];

const integrations = [
  {
    name: "n8n / Make",
    subtitle: "Workflow-orkestrering",
    status: "Planlagt",
    statusColor: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    features: [
      "Automatiser hele innholdspipelinen",
      "Trigger fra CRM, kalender eller manuelt",
      "Koble agenter til eksterne systemer",
      "Visuell workflow-builder",
    ],
  },
  {
    name: "Qdrant",
    subtitle: "RAG Vektordatabase",
    status: "Klar",
    statusColor: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
    features: [
      "Lagre kundeprofiler og merkevare-guider",
      "Automatisk kontekst-henting",
      "Semantisk sok i all kundedata",
      "Bedre innhold over tid",
    ],
  },
  {
    name: "Semrush",
    subtitle: "SEO-agent integrasjon",
    status: "Planlagt",
    statusColor: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    features: [
      "Ekte sokedata for nokkelord-research",
      "Konkurrentanalyse i sanntid",
      "Automatisk rangerings-tracking",
      "Reelle data, ikke estimater",
    ],
  },
];

export default function PipelinePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Pipeline</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fra brief til ferdig video — 3 steg, full automatisering
        </p>
      </div>

      {/* === STEG 1: TEKST === */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">1</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tekst — Multi-agent innholdsgenerering</h2>
            <GlassBadge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 mt-1">Aktiv</GlassBadge>
          </div>
        </div>

        {/* Flow: Input → Agents → Output */}
        <div className="flex flex-col items-center gap-0">
          {/* Input box */}
          <GlassCard className="p-4 w-full max-w-md text-center bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Brief + Kundeprofil</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Kanal, tone, malgruppe, merkevare</div>
          </GlassCard>

          {/* Vertical connector */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 -mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>

          {/* Agent grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {AGENTS.map((agent) => {
              const c = agentColors[agent.id] || agentColors.strategist;
              return (
                <GlassCard key={agent.id} className={`p-4 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-full h-1 rounded-full ${c.line}`} />
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Primaer AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-full h-1 rounded-full ${c.line} opacity-50`} />
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Sekundaer AI</span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Vertical connector */}
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 -mt-1" />

          {/* Output box */}
          <GlassCard className="p-4 w-full max-w-md text-center bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Kontekst-rikt innhold</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Strategi, copy, SEO, analyse — klart for neste steg</div>
          </GlassCard>
        </div>
      </section>

      {/* Big arrow down */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-px h-8 bg-gradient-to-b from-emerald-500/40 to-purple-500/40" />
          <svg className="w-5 h-5 text-purple-500/60" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* === STEG 2: BILDE === */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20">
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bilde — AI-genererte visuelle elementer</h2>
            <GlassBadge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 mt-1">Planlagt</GlassBadge>
          </div>
        </div>

        <GlassCard className="p-6 bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Kontekst inn</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Tekst-innhold, merkevare-profil og visuelle retningslinjer fra Steg 1 brukes til a generere bilder som matcher budskapet.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Leverandorer</h3>
              <div className="flex flex-wrap gap-1.5">
                {imageProviders.map((p) => (
                  <span key={p} className="text-[11px] px-2 py-1 rounded-md bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Big arrow down */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-px h-8 bg-gradient-to-b from-purple-500/40 to-rose-500/40" />
          <svg className="w-5 h-5 text-rose-500/60" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* === STEG 3: VIDEO === */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20">
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">3</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Video — AI-generert kort video</h2>
            <GlassBadge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 mt-1">Planlagt</GlassBadge>
          </div>
        </div>

        <GlassCard className="p-6 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Kontekst + bilde inn</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Generert bilde + tekst-kontekst brukes som input for a lage kort video tilpasset kanal og merkevare.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Leverandorer</h3>
              <div className="flex flex-wrap gap-1.5">
                {videoProviders.map((p) => (
                  <span key={p} className="text-[11px] px-2 py-1 rounded-md bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* === ARKITEKTUR === */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Systemarkitektur</h2>
        <GlassCard className="p-6 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-[600px] justify-center flex-wrap">
            {/* Input */}
            <div className="flex flex-col gap-1.5">
              {["Brief", "Kundeprofil", "Merkevare-guide"].map((item) => (
                <div key={item} className="text-[11px] px-3 py-1.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-center">
                  {item}
                </div>
              ))}
            </div>

            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>

            {/* Orchestrator */}
            <div className="text-[11px] px-4 py-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-center">
              Agent<br />Orchestrator
            </div>

            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>

            {/* 4 Agents */}
            <div className="flex flex-col gap-1.5">
              {AGENTS.map((a) => {
                const c = agentColors[a.id] || agentColors.strategist;
                return (
                  <div key={a.id} className={`text-[11px] px-3 py-1.5 rounded-md ${c.bg} border ${c.border} text-gray-700 dark:text-gray-300 font-medium text-center`}>
                    {a.name}
                  </div>
                );
              })}
            </div>

            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>

            {/* Output */}
            <div className="text-[11px] px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-center">
              Tekst<br />Output
            </div>

            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>

            {/* Image */}
            <div className="text-[11px] px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold text-center">
              Bilde<br />Gen
            </div>

            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>

            {/* Video */}
            <div className="text-[11px] px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-center">
              Video<br />Gen
            </div>
          </div>
        </GlassCard>
      </section>

      {/* === INTEGRASJONER === */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Integrasjoner</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <GlassCard key={item.name} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</span>
                <GlassBadge className={item.statusColor}>{item.status}</GlassBadge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{item.subtitle}</p>
              <ul className="space-y-1.5">
                {item.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* === TECH STACK === */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teknisk stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {techStack.map((t) => (
            <GlassCard key={t.name} className="p-3 text-center">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{t.detail}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Back */}
      <div className="flex justify-center pb-4">
        <Link href="/">
          <GlassButton variant="ghost">Tilbake til dashboard</GlassButton>
        </Link>
      </div>
    </div>
  );
}
