"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getClients, getHistory, AGENTS, CHANNEL_COLORS, type Client, type ContentItem } from "@/lib/store";

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Oversikt over AI-drevet innholdsproduksjon</p>
        </div>
        <Link href="/generate" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          Generer nytt innhold
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Kunder", value: clients.length, accent: "border-indigo-400" },
          { label: "Generert i dag", value: todayCount, accent: "border-emerald-400" },
          { label: "Totalt generert", value: history.length, accent: "border-purple-400" },
          { label: "AI-agenter", value: AGENTS.length, accent: "border-amber-400" },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-xl p-5 border border-gray-100 border-t-2 ${s.accent} shadow-sm`}>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Agents overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">AI-agenter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map(a => (
            <div key={a.id} className={`rounded-xl p-4 border ${a.color}`}>
              <div className="font-semibold text-sm">{a.name}</div>
              <div className="text-xs mt-1 opacity-70">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state or recent */}
      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
          <p className="text-gray-400 mb-3">Ingen kunder lagt til ennå</p>
          <Link href="/clients" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Legg til din første kunde for å komme i gang
          </Link>
        </div>
      ) : history.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Siste generert</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map(h => (
              <div key={h.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-sm font-medium text-gray-900">{h.clientName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{h.brief.slice(0, 50)}{h.brief.length > 50 ? "..." : ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${CHANNEL_COLORS[h.channel] || "bg-gray-50 text-gray-500"}`}>{h.channel}</span>
                  <span className="text-xs text-gray-300">{new Date(h.createdAt).toLocaleDateString("nb-NO")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
