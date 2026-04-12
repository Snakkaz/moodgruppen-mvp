"use client";
import { useEffect, useState } from "react";
import { getHistory, getClients, CHANNELS, type ContentItem } from "@/lib/store";

export default function HistoryPage() {
  const [history, setHistory] = useState<ContentItem[]>([]);
  const [clients, setClients] = useState<{id:string;name:string}[]>([]);
  const [filterClient, setFilterClient] = useState("");
  const [filterChannel, setFilterChannel] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setHistory(getHistory()); setClients(getClients()); }, []);

  const filtered = history.filter(h =>
    (!filterClient || h.clientId === filterClient) &&
    (!filterChannel || h.channel === filterChannel)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Historikk</h1>
        <p className="text-sm text-white/40 mt-1">{history.length} innholdselementer generert</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={filterClient} onChange={e => setFilterClient(e.target.value)}
          className="bg-[#12121a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          <option value="">Alle kunder</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
          className="bg-[#12121a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
          <option value="">Alle kanaler</option>
          {CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-8 text-center">
          <p className="text-white/40 text-sm">{history.length === 0 ? "Ingen innhold generert enda" : "Ingen treff med valgte filtre"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(h => (
            <div key={h.id} className="bg-[#12121a] border border-white/5 rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[.02] transition-colors">
                <div>
                  <div className="text-sm font-medium">{h.clientName}</div>
                  <div className="text-xs text-white/40 mt-0.5">{h.brief.slice(0, 60)}{h.brief.length > 60 ? "..." : ""}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 bg-white/5 rounded-md text-white/50">{h.channel}</span>
                  <span className="text-xs text-white/30">{new Date(h.createdAt).toLocaleDateString("no-NO")}</span>
                  <svg className={`w-4 h-4 text-white/30 transition-transform ${expanded === h.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>
              {expanded === h.id && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <pre className="mt-3 text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed bg-[#0a0a0f] rounded-lg p-4">{h.content}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
