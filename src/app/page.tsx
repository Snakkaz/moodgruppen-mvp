"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard, GlassButton, GlassBadge } from "@/components/ui/glass";
import { getClients, getHistory, AGENTS } from "@/lib/store";

const pipelineSteps = [
  {
    title: "Tekst",
    desc: "4 AI-agenter genererer strategi, innhold, SEO og analyse",
    status: "Aktiv",
    statusColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: "border-indigo-500/30",
    glow: "bg-indigo-500/5 dark:bg-indigo-500/10",
  },
  {
    title: "Bilde",
    desc: "Midjourney, Gemini — kontekst-tilpassede bilder fra tekst",
    status: "Planlagt",
    statusColor: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
    color: "border-purple-500/30",
    glow: "bg-purple-500/5 dark:bg-purple-500/10",
  },
  {
    title: "Video",
    desc: "Kling, Veo, Runway — kort video fra bilde + kontekst",
    status: "Planlagt",
    statusColor: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    color: "border-rose-500/30",
    glow: "bg-rose-500/5 dark:bg-rose-500/10",
  },
];

const agentColors: Record<string, { bg: string; border: string; dot: string }> = {
  strategist: { bg: "bg-blue-500/5 dark:bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
  content: { bg: "bg-purple-500/5 dark:bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-500" },
  seo: { bg: "bg-emerald-500/5 dark:bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  analyst: { bg: "bg-amber-500/5 dark:bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
};

const integrations = [
  { name: "n8n / Make", desc: "Workflow-orkestrering", status: "Planlagt", statusColor: "bg-gray-500/20 text-gray-500 border-gray-500/30" },
  { name: "Qdrant", desc: "RAG Vektordatabase", status: "Klar", statusColor: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  { name: "Semrush", desc: "SEO-data i sanntid", status: "Planlagt", statusColor: "bg-gray-500/20 text-gray-500 border-gray-500/30" },
];

export default function Dashboard() {
  const [clientCount, setClientCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setClientCount(getClients().length);
    setHistoryCount(getHistory().length);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mood<span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">
          Multi-agent innholdsplattform for markedsføringsbyråer
        </p>
        <div className="flex gap-3">
          <Link href="/generate">
            <GlassButton variant="primary">Generer innhold</GlassButton>
          </Link>
          <Link href="/pipeline">
            <GlassButton>Se pipeline</GlassButton>
          </Link>
        </div>
      </section>

      {/* Content Pipeline */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative">
          {pipelineSteps.map((step, i) => (
            <div key={step.title} className="flex items-stretch">
              <GlassCard className={`flex-1 p-5 ${step.glow} border ${step.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-indigo-600 dark:text-indigo-400">{step.icon}</div>
                  <GlassBadge className={step.statusColor}>{step.status}</GlassBadge>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </GlassCard>
              {i < pipelineSteps.length - 1 && (
                <div className="hidden md:flex items-center px-2">
                  <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI-agenter</h2>
          <GlassBadge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
            Dual AI
          </GlassBadge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AGENTS.map((agent) => {
            const colors = agentColors[agent.id] || agentColors.strategist;
            return (
              <GlassCard key={agent.id} className={`p-4 ${colors.bg} border ${colors.border}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{agent.desc}</p>
                <div className="mt-2 flex gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400">
                    Primær modell
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400">
                    Sekundær modell
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Integrations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Integrasjoner</h2>
          <Link href="/pipeline">
            <GlassButton size="sm" variant="ghost">Mer detaljer</GlassButton>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <GlassCard key={item.name} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</span>
                <GlassBadge className={item.statusColor}>{item.status}</GlassBadge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistikk</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Innhold generert", value: historyCount },
            { label: "Kunder", value: clientCount },
            { label: "AI-leverandører", value: 6 },
            { label: "Agenter", value: 4 },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
