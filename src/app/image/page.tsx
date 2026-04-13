"use client";

import { useState } from "react";
import { GlassCard, GlassButton, GlassTextarea, GlassSelect, GlassBadge } from "@/components/ui/glass";

const STYLES = ["Ingen", "Fotorealistisk", "Illustrasjon", "Logo", "Minimalistisk", "Abstrakt"];

const IMAGE_PROVIDERS = [
  { id: "demo", name: "Demo (Gemini Image)", available: true },
  { id: "gemini", name: "Google Gemini", available: true },
  { id: "dalle", name: "DALL-E 3 (OpenAI)", available: false },
  { id: "midjourney", name: "Midjourney", available: false },
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Ingen");
  const [provider, setProvider] = useState("demo");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImage(null);
    setDescription(null);

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style: style !== "Ingen" ? style : undefined, provider }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setImage(data.image);
        setDescription(data.text || null);
      }
    } catch {
      setError("Nettverksfeil — sjekk tilkoblingen");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `moodai-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bildegenerering</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Generer bilder med AI. Kontekst fra innholdsgenerering kan brukes som prompt.
        </p>
      </div>

      <GlassCard className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prompt</label>
          <GlassTextarea
            rows={3}
            placeholder="Beskriv bildet du vil generere..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) generate(); }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stil</label>
          <GlassSelect value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </GlassSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Leverandør</label>
          <div className="grid grid-cols-2 gap-2">
            {IMAGE_PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => p.available && setProvider(p.id)}
                disabled={!p.available}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all border ${
                  provider === p.id
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-medium"
                    : p.available
                      ? "bg-white/30 dark:bg-white/5 border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-white/50 cursor-pointer"
                      : "bg-white/10 dark:bg-white/[0.02] border-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                <span>{p.name}</span>
                {!p.available && <GlassBadge className="bg-gray-500/15 text-gray-400 border-gray-500/20 text-[9px]">Planlagt</GlassBadge>}
              </button>
            ))}
          </div>
        </div>

        <GlassButton variant="primary" size="lg" onClick={generate} disabled={loading || !prompt.trim()} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Genererer...
            </span>
          ) : "Generer bilde"}
        </GlassButton>
      </GlassCard>

      {error && (
        <GlassCard className="p-4 border-red-300/50 dark:border-red-500/30">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </GlassCard>
      )}

      {image && (
        <GlassCard className="p-6 space-y-4">
          <img src={image} alt="Generert bilde" className="w-full rounded-lg" />
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
          <GlassButton onClick={download} size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Last ned bilde
          </GlassButton>
        </GlassCard>
      )}
    </div>
  );
}
