"use client";
import { useEffect, useState } from "react";
import { getClients, getHistory, saveHistory, getSettings, CHANNELS, CHANNEL_COLORS, AGENTS, type Client, type ContentItem } from "@/lib/store";

export default function GeneratePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0] as string);
  const [brief, setBrief] = useState("");
  const [results, setResults] = useState<Record<string, string | null> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setClients(getClients()); }, []);
  const client = clients.find(c => c.id === clientId);

  const generate = async () => {
    if (!client || !brief.trim()) return;
    setLoading(true); setResults(null); setError(null); setActiveAgent("strategist");

    const settings = getSettings();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, channel, brief: brief.trim(), settings }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setResults(data.results);

      // Save main content to history
      if (data.results?.content) {
        const item: ContentItem = {
          id: crypto.randomUUID(), clientId: client.id, clientName: client.name,
          channel, brief: brief.trim(), content: data.results.content,
          agents: data.agents || [], createdAt: new Date().toISOString(),
        };
        saveHistory([item, ...getHistory()]);
      }
    } catch { setError("Kunne ikke koble til AI. Sjekk Innstillinger."); }
    setLoading(false); setActiveAgent(null);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000);
  };

  const agentOrder = ["strategist", "content", "seo", "analyst"];
  const agentNames: Record<string, string> = { strategist: "Strateg", content: "Innholdsprodusent", seo: "SEO-spesialist", analyst: "Analyseagent" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generer innhold</h1>
        <p className="text-sm text-gray-500 mt-1">4 AI-agenter samarbeider om å lage optimalt innhold</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kunde</label>
              {clients.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">Ingen kunder — <a href="/clients" className="text-indigo-600">legg til en først</a></p>
              ) : (
                <select value={clientId} onChange={e => setClientId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none">
                  <option value="">Velg kunde...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>)}
                </select>
              )}
            </div>

            {client && (
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 space-y-1">
                <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Kundeprofil</div>
                <div className="text-xs text-indigo-900/60">Tone: {client.tone} — Målgruppe: {client.audience || "Ikke satt"}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kanal</label>
              <div className="grid grid-cols-2 gap-2">
                {CHANNELS.map(ch => (
                  <button key={ch} onClick={() => setChannel(ch)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${channel === ch
                      ? (CHANNEL_COLORS[ch] || "bg-indigo-50 text-indigo-700 border-indigo-200")
                      : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"}`}>
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Brief / tema</label>
              <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={4}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none resize-none"
                placeholder="Beskriv hva innholdet skal handle om..."/>
            </div>

            <button onClick={generate} disabled={!client || !brief.trim() || loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-semibold rounded-lg transition-all shadow-sm">
              {loading ? "Agentene jobber..." : "Start alle agenter"}
            </button>
          </div>

          {/* Agent status */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent-status</div>
            <div className="space-y-2">
              {AGENTS.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : results?.[a.id] ? "bg-emerald-400" : "bg-gray-200"}`}/>
                  <span className={results?.[a.id] ? "text-gray-900 font-medium" : "text-gray-400 dark:text-gray-500"}>{a.name}</span>
                  {results?.[a.id] && <span className="text-emerald-500 ml-auto">Ferdig</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">{error}</div>
          )}

          {loading && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 shadow-sm flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"/>
              <p className="text-sm text-gray-400 dark:text-gray-500">4 AI-agenter jobber parallelt...</p>
            </div>
          )}

          {results && !loading && agentOrder.map(agentId => {
            const content = results[agentId];
            if (!content) return null;
            const agent = AGENTS.find(a => a.id === agentId);
            return (
              <div key={agentId} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${agent?.color || ""}`}>{agentNames[agentId]}</div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{content.length} tegn</span>
                  </div>
                  <button onClick={() => copy(content, agentId)}
                    className="text-xs px-3 py-1 bg-white border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                    {copied === agentId ? "Kopiert!" : "Kopier"}
                  </button>
                </div>
                <div className="p-5">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
                </div>
              </div>
            );
          })}

          {!results && !loading && !error && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 shadow-sm flex items-center justify-center">
              <p className="text-sm text-gray-300 dark:text-gray-600">Resultater fra alle 4 agenter vises her</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
