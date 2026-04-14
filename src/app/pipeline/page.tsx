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
  { name: "11 AI-leverandører", detail: "GitHub, OpenAI, Anthropic, Google, Groq, Ollama" },
  { name: "Glass UI", detail: "Glassmorfisme design" },
  { name: "Parallell AI", detail: "4 agenter samtidig" },
  { name: "ChromaDB", detail: "Vektordatabase (RAG)" },
  { name: "REST API", detail: "Modulær arkitektur" },
];

const integrations = [
  {
    name: "n8n / Make",
    subtitle: "Workflow-orkestrering",
    status: "Aktiv",
    statusColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    features: [
      "Automatiser hele innholdspipelinen",
      "Trigger fra CRM, kalender eller manuelt",
      "Koble agenter til eksterne systemer",
      "Visuell workflow-builder",
    ],
  },
  {
    name: "Qdrant (ChromaDB)",
    subtitle: "RAG Vektordatabase",
    status: "Aktiv",
    statusColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    features: [
      "Lagre kundeprofiler og merkevare-guider",
      "Automatisk kontekst-henting",
      "Semantisk søk i all kundedata",
      "Bedre innhold over tid",
    ],
  },
  {
    name: "Semrush SEO",
    subtitle: "SEO-agent integrasjon",
    status: "Aktiv",
    statusColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    features: [
      "Søkeord-analyse med volum og vanskelighetsgrad",
      "Domain Authority og organisk trafikk",
      "Konkurrentanalyse",
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
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Kanal, tone, målgruppe, merkevare</div>
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
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Primær AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-full h-1 rounded-full ${c.line} opacity-50`} />
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Sekundær AI</span>
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
            <GlassBadge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 mt-1">Aktiv</GlassBadge>
          </div>
        </div>

        <GlassCard className="p-6 bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Kontekst inn</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Tekst-innhold, merkevare-profil og visuelle retningslinjer fra Steg 1 brukes til å generere bilder som matcher budskapet.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Leverandører</h3>
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
            <GlassBadge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 mt-1">Aktiv</GlassBadge>
          </div>
        </div>

        <GlassCard className="p-6 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Kontekst + bilde inn</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Generert bilde + tekst-kontekst brukes som input for å lage kort video tilpasset kanal og merkevare.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Leverandører</h3>
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

      {/* === NESTE STEG: LOKAL AI + RAG === */}
      <section className="relative">
        <div className="absolute -left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent" />
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Neste steg — Lokal AI + RAG</h2>
            <GlassBadge className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 mt-1">Planlagt</GlassBadge>
          </div>
        </div>

        {/* Hero image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/IMG_1495.jpeg" alt="Mood AI — Dedikert AI-arbeidsstasjon" className="w-full rounded-xl border border-white/10 shadow-lg mb-6" />

        {/* RAG Explainer */}
        <GlassCard className="p-6 bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">RAG — Retrieval-Augmented Generation</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            AI som henter relevant info fra bedriftens egne dokumenter før den genererer svar. Reduserer hallusinasjoner med 70–90 % og gir skreddersydde svar basert på ekte kundedata.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "1. Indeksering", desc: "Bedriftsdata konverteres til vektorer og lagres i ChromaDB", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
              { title: "2. Henting", desc: "Semantisk søk finner relevante dokumenter i sanntid", icon: "m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
              { title: "3. Generering", desc: "Kontekst injiseres i agentene — svar med kilder", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/5">
                <svg className="w-5 h-5 text-cyan-500 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                </svg>
                <div className="text-xs font-semibold text-gray-800 dark:text-white">{step.title}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{step.desc}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Hardware */}
        <GlassCard className="p-6 border border-white/20 dark:border-white/5 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Dedikert AI-infrastruktur</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Lokal hardware for full datakontroll, GDPR-kompatibilitet og forutsigbare kostnader
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "GPU", value: "RTX 6000 Pro 96 GB", detail: "Kjører 70B-modeller lokalt" },
              { label: "CPU", value: "Ryzen 9 9950X3D", detail: "16 kjerner, parallell AI" },
              { label: "RAM", value: "128 GB DDR5", detail: "Vektordb + modeller i minnet" },
            ].map((spec) => (
              <div key={spec.label} className="p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
                <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{spec.label}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{spec.value}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{spec.detail}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Roadmap */}
        <GlassCard className="p-6 border border-white/20 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Implementeringsplan</h3>
          <div className="space-y-3">
            {[
              { phase: "Fase 1", title: "RAG-pipeline", time: "Uke 1", items: ["Ollama + embedding-modell", "ChromaDB med chunking", "Dokument-upload (PDF, DOCX, URL)", "Kunnskapsbase-side"] },
              { phase: "Fase 2", title: "Agent-integrasjon", time: "Uke 2", items: ["Agenter henter kontekst automatisk", "Per-kunde isolert data", "Lokal AI uten API-nøkkel", "A/B: lokal vs. sky"] },
              { phase: "Fase 3", title: "Workflow-automatisering", time: "Uke 3", items: ["n8n visuell workflow-builder", "Auto-indeksering av kundedata", "Innhold → auto-publisering", "Ukentlig re-indeksering"] },
              { phase: "Fase 4", title: "Produksjonsklart", time: "Uke 4", items: ["Dashboard med RAG-metrics", "Kvalitetsmåling", "Kryptering + tilgangskontroll", "Dokumentasjon og opplæring"] },
            ].map((phase) => (
              <div key={phase.phase} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase">{phase.phase}</div>
                  <div className="text-[9px] text-gray-400">{phase.time}</div>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/15 dark:border-white/5">
                  <div className="text-xs font-semibold text-gray-800 dark:text-white">{phase.title}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {phase.items.map((item, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
