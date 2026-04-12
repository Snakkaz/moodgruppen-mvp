"use client";
import { useEffect, useState } from "react";
import { getClients, getHistory, saveHistory, CHANNELS, generateDemoContent, type Client, type ContentItem } from "@/lib/store";

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

    // Simulate slight delay for realism
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const content = generateDemoContent(client, channel, brief.trim());
    setResult(content);

    // Save to history
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
        <p className="text-sm text-white/40 mt-1">Velg kunde, kanal og skriv en brief</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Kunde</label>
            {clients.length === 0 ? (
              <p className="text-sm text-white/30">Ingen kunder — <a href="/clients" className="text-indigo-400">legg til en foerst</a></p>
            ) : (
              <select value={clientId} onChange={e => setClientId(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none">
                <option value="">Velg kunde...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>)}
              </select>
            )}
          </div>

          {client && (
            <div className="bg-white/5 rounded-lg p-3 text-xs text-white/50 space-y-1">
              <div><span className="text-white/30">Tone:</span> {client.tone}</div>
              <div><span className="text-white/30">Maalgruppe:</span> {client.audience}</div>
              {client.guidelines && <div><span className="text-white/30">Guidelines:</span> {client.guidelines}</div>}
            </div>
          )}

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Kanal</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => setChannel(ch)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${channel === ch ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" : "bg-white/5 border-white/5 text-white/50 hover:text-white/80"}`}>
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Brief / tema</label>
            <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={4}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Beskriv hva innholdet skal handle om..."/>
          </div>

          <button onClick={generate} disabled={!client || !brief.trim() || loading}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-medium rounded-lg transition-colors">
            {loading ? "Genererer..." : "Generer innhold"}
          </button>
        </div>

        {/* Output */}
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Resultat</h3>
            {result && (
              <button onClick={copy} className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/60 transition-colors">
                {copied ? "Kopiert" : "Kopier"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"/>
            </div>
          ) : result ? (
            <div className="bg-[#0a0a0f] border border-white/5 rounded-lg p-4">
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-white/20 text-sm">
              Generert innhold vises her
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
