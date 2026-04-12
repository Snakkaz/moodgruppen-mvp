"use client";
import { useEffect, useState } from "react";
import { getHistory, getClients, CHANNELS, CHANNEL_COLORS, type ContentItem } from "@/lib/store";

export default function HistoryPage() {
  const [history, setHistory] = useState<ContentItem[]>([]);
  const [clients, setClients] = useState<{id:string;name:string}[]>([]);
  const [filterClient, setFilterClient] = useState("");
  const [filterChannel, setFilterChannel] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setHistory(getHistory()); setClients(getClients()); }, []);

  const filtered = history.filter(h =>
    (!filterClient || h.clientId === filterClient) && (!filterChannel || h.channel === filterChannel)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historikk</h1>
        <p className="text-sm text-gray-500 mt-1">{history.length} innholdselementer generert</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={filterClient} onChange={e => setFilterClient(e.target.value)}
          className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none">
          <option value="">Alle kunder</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
          className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none">
          <option value="">Alle kanaler</option>
          {CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center shadow-sm">
          <p className="text-gray-400 text-sm">{history.length === 0 ? "Ingen innhold generert ennå" : "Ingen treff med valgte filtre"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(h => (
            <div key={h.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <button onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{h.clientName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{h.brief.slice(0, 60)}{h.brief.length > 60 ? "..." : ""}</div>
                </div>
                <div className="flex items-center gap-3">
                  {h.agents?.length > 0 && <span className="text-[10px] text-gray-400 dark:text-gray-500">{h.agents.length} agenter</span>}
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${CHANNEL_COLORS[h.channel] || "bg-gray-50 text-gray-500 dark:text-gray-400 dark:text-gray-500"}`}>{h.channel}</span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">{new Date(h.createdAt).toLocaleDateString("nb-NO")}</span>
                  <svg className={`w-4 h-4 text-gray-300 transition-transform ${expanded === h.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>
              {expanded === h.id && (
                <div className="px-4 pb-4 border-t border-gray-50 dark:border-gray-800">
                  <pre className="mt-3 text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">{h.content}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
