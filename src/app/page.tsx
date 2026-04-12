"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getClients, getHistory, CHANNEL_COLORS, type Client, type ContentItem } from "@/lib/store";

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
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">Oversikt over innholdsproduksjon</p>
        </div>
        <Link href="/generate" className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors">
          Generer nytt innhold
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Kunder", value: clients.length, sub: "registrerte profiler", color: "from-indigo-500" },
          { label: "Generert i dag", value: todayCount, sub: today, color: "from-emerald-500" },
          { label: "Totalt generert", value: history.length, sub: "innholdselementer", color: "from-purple-500" },
        ].map(s => (
          <div key={s.label} className="relative bg-[#12121a] border border-white/5 rounded-xl p-5 overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.color} to-transparent`}/>
            <div className="text-3xl font-bold text-white">{s.value}</div>
            <div className="text-sm font-medium text-white/60 mt-1">{s.label}</div>
            <div className="text-xs text-white/25 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-8 text-center">
          <p className="text-white/40 mb-3">Ingen kunder lagt til ennå</p>
          <Link href="/clients" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            Legg til din første kunde for å komme i gang
          </Link>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Siste generert innhold</h2>
          <div className="space-y-3">
            {history.slice(0, 5).map(h => (
              <div key={h.id} className="bg-[#12121a] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{h.clientName}</div>
                  <div className="text-xs text-white/40 mt-0.5">{h.brief.slice(0, 50)}{h.brief.length > 50 ? "..." : ""} — {new Date(h.createdAt).toLocaleDateString("nb-NO")}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-md border ${CHANNEL_COLORS[h.channel] || "bg-white/5 text-white/50 border-white/10"}`}>{h.channel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-16 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-white/20">Bygget av <a href="https://petersendc.no" target="_blank" rel="noopener" className="text-white/30 hover:text-indigo-400 transition-colors">Stian Petersen</a> — Petersen Digital Consulting</p>
      </footer>
    </div>
  );
}
