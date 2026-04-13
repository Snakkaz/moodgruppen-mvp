"use client";

import { useState } from "react";
import { GlassCard, GlassButton, GlassTextarea, GlassSelect, GlassBadge } from "@/components/ui/glass";

const PROVIDERS = [
  { id: "demo", name: "Demo (AI Storyboard)", available: true },
  { id: "kling", name: "Kling AI", available: false },
  { id: "veo", name: "Google Veo 3.1", available: false },
  { id: "runway", name: "Runway Gen 4.5", available: false },
  { id: "pixverse", name: "PixVerse", available: false },
  { id: "luma", name: "Luma Dream Machine", available: false },
];

const STYLES = ["Cinematic", "Dokumentar", "Reklamefilm", "Sosiale medier", "Animasjon", "Slow motion"];
const DURATIONS = [
  { value: 3, label: "3 sekunder" },
  { value: 5, label: "5 sekunder" },
  { value: 10, label: "10 sekunder" },
  { value: 15, label: "15 sekunder" },
];

export default function VideoPage() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("demo");
  const [style, setStyle] = useState("Cinematic");
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setConcept(null);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), provider, style, duration }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.concept) {
        setConcept(data.concept);
      } else if (data.videoUrl) {
        setConcept(`Video generert: ${data.videoUrl}`);
      }
    } catch {
      setError("Nettverksfeil — sjekk tilkoblingen.");
    } finally {
      setLoading(false);
    }
  };

  const selectedProvider = PROVIDERS.find(p => p.id === provider);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Videogenerering</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Steg 3 i content pipeline — generer kort video fra tekst og bilde
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Leverandør</label>
              <div className="space-y-2">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => p.available && setProvider(p.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all border ${
                      provider === p.id
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-medium"
                        : p.available
                          ? "bg-white/30 dark:bg-white/5 border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 cursor-pointer"
                          : "bg-white/10 dark:bg-white/[0.02] border-white/10 dark:border-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!p.available}
                  >
                    <span>{p.name}</span>
                    {p.available ? (
                      <GlassBadge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">Aktiv</GlassBadge>
                    ) : (
                      <GlassBadge className="bg-gray-500/15 text-gray-400 border-gray-500/20 text-[10px]">Planlagt</GlassBadge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Stil</label>
              <GlassSelect value={style} onChange={e => setStyle(e.target.value)}>
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </GlassSelect>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Varighet</label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map(d => (
                  <GlassButton
                    key={d.value}
                    size="sm"
                    onClick={() => setDuration(d.value)}
                    className={duration === d.value ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" : ""}
                  >
                    {d.label}
                  </GlassButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Prompt / Brief</label>
              <GlassTextarea
                rows={4}
                placeholder="Beskriv videoen du vil lage..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <GlassButton variant="primary" size="lg" className="w-full" onClick={generate} disabled={loading || !prompt.trim()}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Genererer...
                </span>
              ) : "Generer video"}
            </GlassButton>
          </GlassCard>

          {/* Pipeline context hint */}
          <GlassCard className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">Content Pipeline</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Bruk output fra Tekst- og Bilde-steget som kontekst her. Videoen tilpasses automatisk til merkevare og kanal.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          {error && (
            <GlassCard className="p-4 border-red-300/50 dark:border-red-500/30 mb-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </GlassCard>
          )}

          {loading && (
            <GlassCard className="p-12 flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 dark:text-gray-500">AI genererer video-konsept...</p>
            </GlassCard>
          )}

          {concept && !loading && (
            <GlassCard className="overflow-hidden">
              <div className="px-5 py-3 border-b border-white/20 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Video-konsept / Storyboard</span>
                </div>
                <GlassBadge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20">
                  {selectedProvider?.name} — {style} — {duration}s
                </GlassBadge>
              </div>
              <div className="p-5">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{concept}</pre>
              </div>
              <div className="px-5 py-3 border-t border-white/20 dark:border-white/5 flex items-center gap-2">
                <GlassButton size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(concept)}>
                  Kopier
                </GlassButton>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  Konseptet kan brukes som brief til Kling AI, Runway, eller Veo når integrasjonen er klar.
                </span>
              </div>
            </GlassCard>
          )}

          {!concept && !loading && !error && (
            <GlassCard className="p-12 flex flex-col items-center gap-3">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p className="text-sm text-gray-300 dark:text-gray-600">Video-konsept vises her</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
