"use client";
import { useEffect, useState } from "react";
import { getClients, getHistory, saveHistory, CHANNELS, CHANNEL_COLORS, generateDemoContent, type Client, type ContentItem } from "@/lib/store";

export default function GeneratePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0] as string);
  const [brief, setBrief] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setClients(getClients()); }, []);
  const client = clients.find(c => c.id === clientId);

  const generate = async () => {
    if (!client || !brief.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, channel, brief: brief.trim() }),
      });
      const data = await res.json();
      if (data.content) {
        setResult(data.content);
      } else {
        setResult(generateDemoContent(client, channel, brief.trim()));
      }
    } catch {
      setResult(generateDemoContent(client, channel, brief.trim()));
    }

    const content = result || generateDemoContent(client, channel, brief.trim());
    const item: ContentItem = {
      id: crypto.randomUUID(),
      clientId: client.id,
      clientName: client.name,
      channel,
      brief: brief.trim(),
      content,
      createdAt: new Date().toISOString(),
    };
    const hist = getHistory();
    saveHistory([item, ...hist]);
    setLoading(false);
  };

  const copy = () => {
    if (result) { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Generer innhold</h1>
        <p className="text-sm text-white/40 mt-1">Velg kunde, kanal og skriv en brief — AI gjør resten</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-medium">Kunde</label>
            {clients.length === 0 ? (
              <p className="text-sm text-white/30">Ingen kunder — <a href="/clients" className="text-indigo-400 hover:text-indigo-300">legg til en først</a></p>
            ) : (
              <select value={clientId} onChange={e => setClientId(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors">
                <option value="">Velg kunde...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>)}
              </select>
            )}
          </div>

          {client && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3 space-y-1">
              <div className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Kundeprofil</div>
              <div className="text-xs text-white/50"><span className="text-white/30">Tone:</span> {client.tone}</div>
              <div className="text-xs text-white/50"><span className="text-white/30">Målgruppe:</span> {client.audience || "Ikke spesifisert"}</div>
              {client.guidelines && <div className="text-xs text-white/50"><span className="text-white/30">Guidelines:</span> {client.guidelines}</div>}
            </div>
          )}

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-medium">Kanal</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => setChannel(ch)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${channel === ch
                    ? (CHANNEL_COLORS[ch] || "bg-indigo-500/15 text-indigo-400 border-indigo-500/20")
                    : "bg-white/[.03] border-white/5 text-white/40 hover:text-white/70 hover:border-white/10"}`}>
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-medium">Brief / tema</label>
            <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={4}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none transition-colors"
              placeholder="Beskriv hva innholdet skal handle om..."/>
          </div>

          <button onClick={generate} disabled={!client || !brief.trim() || loading}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/5 disabled:text-white/20 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed">
            {loading ? "Genererer innhold..." : "Generer"}
          </button>
        </div>

        <div>
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-6 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Resultat</h3>
              {result && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/25">{result.length} tegn</span>
                  <button onClick={() => generate()} className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/60 transition-colors border border-white/5">
                    Regenerer
                  </button>
                  <button onClick={copy} className="text-xs px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-md text-indigo-400 transition-colors border border-indigo-500/20">
                    {copied ? "Kopiert!" : "Kopier"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"/>
                  <p className="text-sm text-white/30 animate-pulse">Genererer innhold med AI...</p>
                </div>
              ) : result ? (
                <div className="relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-lg"/>
                  <div className="relative bg-[#0a0a0f] rounded-lg p-5">
                    <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white/15 text-sm">
                  Generert innhold vises her
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
