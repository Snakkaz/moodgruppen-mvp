"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getClients, getHistory, AGENTS, CHANNEL_COLORS, type Client, type ContentItem } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/ui/glass";

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [history, setHistory] = useState<ContentItem[]>([]);
  useEffect(() => { setClients(getClients()); setHistory(getHistory()); }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = history.filter(h => h.createdAt.startsWith(today)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Oversikt over AI-drevet innholdsproduksjon</p>
        </div>
        <Link href="/generate">
          <GlassButton variant="primary" size="default">Generer nytt innhold</GlassButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Kunder", value: clients.length, border: "border-t-indigo-400" },
          { label: "Generert i dag", value: todayCount, border: "border-t-emerald-400" },
          { label: "Totalt generert", value: history.length, border: "border-t-purple-400" },
          { label: "AI-agenter", value: AGENTS.length, border: "border-t-amber-400" },
        ].map(s => (
          <GlassCard key={s.label} className={`p-5 border-t-2 ${s.border}`}>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AI-agenter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map(a => (
            <GlassCard key={a.id} className={`p-4 ${a.color}`}>
              <div className="font-semibold text-sm">{a.name}</div>
              <div className="text-xs mt-1 opacity-70">{a.desc}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      {clients.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 mb-3">Ingen kunder lagt til ennå</p>
          <Link href="/clients" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-sm font-medium">
            Legg til din første kunde for å komme i gang
          </Link>
        </GlassCard>
      ) : history.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Siste generert</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map(h => (
              <GlassCard key={h.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{h.clientName}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{h.brief.slice(0, 50)}{h.brief.length > 50 ? "..." : ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${CHANNEL_COLORS[h.channel] || "bg-gray-50 text-gray-500"}`}>{h.channel}</span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">{new Date(h.createdAt).toLocaleDateString("nb-NO")}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
