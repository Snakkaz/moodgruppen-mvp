"use client";
import { useEffect, useState } from "react";
import { getClients, getHistory, saveHistory, getSettings, getAgentSettings, CHANNELS, CHANNEL_COLORS, CHANNEL_ICONS, AGENTS, type Client, type ContentItem } from "@/lib/store";
import { GlassCard, GlassButton, GlassSelect, GlassTextarea } from "@/components/ui/glass";

export default function GeneratePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0] as string);
  const [brief, setBrief] = useState("");
  const [results, setResults] = useState<Record<string, { primary: string | null; secondary: string | null }> | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setClients(getClients());
    // Restore siste resultat fra localStorage
    try {
      const saved = localStorage.getItem("mg-last-result");
      if (saved) {
        const parsed = JSON.parse(saved);
        setResults(parsed.results);
        setClientId(parsed.clientId || "");
        setChannel(parsed.channel || CHANNELS[0] as string);
        setBrief(parsed.brief || "");
      }
    } catch { /* ignore */ }
  }, []);
  const client = clients.find(c => c.id === clientId);

  const generate = async () => {
    if (!client || !brief.trim()) return;
    setLoading(true); setResults(null); setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, channel, brief: brief.trim(), agentSettings: getAgentSettings() }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error.includes("agent") ?
          "Ingen agenter er konfigurert. Gå til Innstillinger og aktiver agenter eller prøv demo-modus."
          : data.error);
        setLoading(false);
        return;
      }
      setResults(data.results);
      if (data.results) {
        // Lagre siste resultat for restore ved sidebytte
        localStorage.setItem("mg-last-result", JSON.stringify({
          results: data.results, clientId: client.id, channel, brief: brief.trim(),
        }));
        const item: ContentItem = {
          id: crypto.randomUUID(), clientId: client.id, clientName: client.name,
          channel, brief: brief.trim(), content: JSON.stringify(data.results),
          agents: Object.keys(data.results), createdAt: new Date().toISOString(),
        };
        saveHistory([item, ...getHistory()]);
      }
    } catch {
      setError("Kunne ikke koble til AI. Sjekk Innstillinger eller aktiver demo-modus.");
    }
    setLoading(false);
  };

  const copy = (text: string, key: string) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); };
  const agentOrder = ["strategist", "content", "seo", "analyst"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generer innhold</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">4 AI-agenter samarbeider om å lage optimalt innhold</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Kunde</label>
              {clients.length === 0 ? (
                <p className="text-sm text-gray-400">Ingen kunder — <a href="/clients" className="text-indigo-600 dark:text-indigo-400">legg til en først</a></p>
              ) : (
                <GlassSelect value={clientId} onChange={e => setClientId(e.target.value)}>
                  <option value="">Velg kunde...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>)}
                </GlassSelect>
              )}
            </div>

            {client && (
              <div className="bg-indigo-500/5 dark:bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/10 space-y-1">
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Kundeprofil</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Tone: {client.tone} — Målgruppe: {client.audience || "Ikke satt"}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Kanal</label>
              <div className="grid grid-cols-2 gap-2">
                {CHANNELS.map(ch => (
                  <GlassButton key={ch} size="sm" onClick={() => setChannel(ch)}
                    className={channel === ch ? (CHANNEL_COLORS[ch] || "") : ""}>
                    <span className="w-4 h-4 flex-shrink-0" dangerouslySetInnerHTML={{ __html: CHANNEL_ICONS[ch] || "" }} />
                    {ch}
                  </GlassButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Brief / tema</label>
              <GlassTextarea value={brief} onChange={e => setBrief(e.target.value)} rows={4} placeholder="Beskriv hva innholdet skal handle om..."/>
            </div>

            <GlassButton variant="primary" size="lg" className="w-full" onClick={generate} disabled={!client || !brief.trim() || loading}>
              {loading ? "Agentene jobber..." : "Start alle agenter"}
            </GlassButton>
            {results && !loading && (
              <GlassButton variant="ghost" size="sm" className="w-full" onClick={() => {
                setResults(null);
                localStorage.removeItem("mg-last-result");
              }}>
                Nullstill resultater
              </GlassButton>
            )}
          </GlassCard>

          <GlassCard className="p-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Agent-status</div>
            <div className="space-y-2">
              {AGENTS.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : results?.[a.id] ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"}`}/>
                  <span className={results?.[a.id] ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>{a.name}</span>
                  {results?.[a.id] && <span className="text-emerald-500 ml-auto">Ferdig</span>}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {error && (
            <GlassCard className="p-4 border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
              {error}
            </GlassCard>
          )}

          {loading && (
            <GlassCard className="p-12 flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"/>
              <p className="text-sm text-gray-400 dark:text-gray-500">4 AI-agenter jobber parallelt...</p>
            </GlassCard>
          )}

          {results && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentOrder.map(agentId => {
                const agentResult = results[agentId];
                if (!agentResult) return null;
                const agent = AGENTS.find(a => a.id === agentId);
                return (
                  <GlassCard key={agentId} className="overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/20 dark:border-white/5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${agent?.color || ""}`}>{agent?.name}</span>
                    </div>
                    <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                      {agentResult.primary && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Primaer</h3>
                          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{agentResult.primary}</pre>
                        </div>
                      )}
                      {agentResult.secondary && (
                        <div className="pt-2 border-t border-white/15 dark:border-white/5">
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Sekundaer</h3>
                          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{agentResult.secondary}</pre>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {!results && !loading && !error && (
            <GlassCard className="p-12 flex items-center justify-center">
              <p className="text-sm text-gray-300 dark:text-gray-600">Resultater fra alle 4 agenter vises her</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}