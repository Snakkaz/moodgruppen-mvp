"use client";

import { useState, useEffect } from "react";
import { getClients, getAgentSettings, CHANNELS, AGENTS, type Client } from "@/lib/store";
import { GlassCard, GlassButton, GlassSelect, GlassTextarea, GlassBadge } from "@/components/ui/glass";

type StepStatus = "idle" | "running" | "done" | "error";

export default function FullPipelinePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0] as string);
  const [brief, setBrief] = useState("");

  // Steg 1: Tekst
  const [textStatus, setTextStatus] = useState<StepStatus>("idle");
  const [textResults, setTextResults] = useState<Record<string, { primary?: string; secondary?: string }> | null>(null);
  const [textError, setTextError] = useState("");

  // Steg 2: Bilde
  const [imageStatus, setImageStatus] = useState<StepStatus>("idle");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  // Steg 3: Video
  const [videoStatus, setVideoStatus] = useState<StepStatus>("idle");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoConcept, setVideoConcept] = useState<string | null>(null);
  const [videoError, setVideoError] = useState("");

  useEffect(() => { setClients(getClients()); }, []);
  const client = clients.find(c => c.id === clientId);

  // === STEG 1: Generer tekst ===
  const runTextStep = async () => {
    if (!client || !brief.trim()) return;
    setTextStatus("running");
    setTextError("");
    setTextResults(null);
    // Reset downstream
    setImageStatus("idle"); setImageData(null); setImageError("");
    setVideoStatus("idle"); setVideoConcept(null); setVideoError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, channel, brief: brief.trim(), agentSettings: getAgentSettings() }),
      });
      const data = await res.json();
      if (data.error) { setTextStatus("error"); setTextError(data.error); return; }

      setTextResults(data.results || {});
      setTextStatus("done");

      // Generer bilde-prompt fra innhold
      const contentAgent = data.results?.content?.primary || data.results?.strategist?.primary || brief;
      const autoImagePrompt = `Profesjonelt markedsføringsbilde for ${client.name} (${client.industry}). Kanal: ${channel}. Innhold: ${contentAgent.slice(0, 300)}`;
      setImagePrompt(autoImagePrompt);

      // Generer video-prompt
      const autoVideoPrompt = `Kort reklamefilm for ${client.name}. Bransje: ${client.industry}. Kanal: ${channel}. Tone: ${client.tone}. Brief: ${brief.trim().slice(0, 200)}`;
      setVideoPrompt(autoVideoPrompt);
    } catch {
      setTextStatus("error");
      setTextError("Nettverksfeil — sjekk tilkoblingen.");
    }
  };

  // === STEG 2: Generer bilde ===
  const runImageStep = async () => {
    if (!imagePrompt.trim()) return;
    setImageStatus("running");
    setImageError("");
    setImageData(null);

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt.trim(), style: "Fotorealistisk", provider: "demo" }),
      });
      const data = await res.json();
      if (data.error) { setImageStatus("error"); setImageError(data.error); }
      else { setImageData(data.image); setImageStatus("done"); }
    } catch {
      setImageStatus("error");
      setImageError("Nettverksfeil.");
    }
  };

  // === STEG 3: Generer video ===
  const runVideoStep = async () => {
    if (!videoPrompt.trim()) return;
    setVideoStatus("running");
    setVideoError("");
    setVideoConcept(null);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: videoPrompt.trim(), style: "Reklamefilm", duration: 5 }),
      });
      const data = await res.json();
      if (data.error) { setVideoStatus("error"); setVideoError(data.error); }
      else { setVideoConcept(data.concept); setVideoStatus("done"); }
    } catch {
      setVideoStatus("error");
      setVideoError("Nettverksfeil.");
    }
  };

  // === Kjør alt automatisk ===
  const runFullPipeline = async () => {
    await runTextStep();
  };

  // Auto-kjør bilde etter tekst (kan overstyres)
  // Bruker ikke useEffect for å la bruker redigere først

  const stepDot = (s: StepStatus) => {
    if (s === "running") return "bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]";
    if (s === "done") return "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
    if (s === "error") return "bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.5)]";
    return "bg-gray-300 dark:bg-gray-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Full Pipeline</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tekst → Bilde → Video — rediger mellom hvert steg
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-all ${stepDot(textStatus)}`} />
          <span className={`text-sm font-medium ${textStatus === "done" ? "text-emerald-600 dark:text-emerald-400" : textStatus === "running" ? "text-indigo-600" : "text-gray-400"}`}>1. Tekst</span>
        </div>
        <div className={`flex-1 h-px ${textStatus === "done" ? "bg-emerald-500/40" : "bg-gray-200 dark:bg-gray-700"}`} />
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-all ${stepDot(imageStatus)}`} />
          <span className={`text-sm font-medium ${imageStatus === "done" ? "text-emerald-600 dark:text-emerald-400" : imageStatus === "running" ? "text-indigo-600" : "text-gray-400"}`}>2. Bilde</span>
        </div>
        <div className={`flex-1 h-px ${imageStatus === "done" ? "bg-emerald-500/40" : "bg-gray-200 dark:bg-gray-700"}`} />
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-all ${stepDot(videoStatus)}`} />
          <span className={`text-sm font-medium ${videoStatus === "done" ? "text-emerald-600 dark:text-emerald-400" : videoStatus === "running" ? "text-indigo-600" : "text-gray-400"}`}>3. Video</span>
        </div>
      </div>

      {/* === STEG 1: INPUT + TEKST === */}
      <GlassCard className="p-5 space-y-4 border-l-4 border-l-indigo-500">
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">Steg 1</GlassBadge>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Tekst — 4 AI-agenter</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Kunde</label>
            {clients.length === 0 ? (
              <p className="text-sm text-gray-400">Ingen kunder — <a href="/clients" className="text-indigo-600 dark:text-indigo-400">legg til en</a></p>
            ) : (
              <GlassSelect value={clientId} onChange={e => setClientId(e.target.value)}>
                <option value="">Velg kunde...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>)}
              </GlassSelect>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Kanal</label>
            <GlassSelect value={channel} onChange={e => setChannel(e.target.value)}>
              {CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
            </GlassSelect>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Brief</label>
          <GlassTextarea rows={2} placeholder="Beskriv innholdet..." value={brief} onChange={e => setBrief(e.target.value)} />
        </div>

        <GlassButton variant="primary" className="w-full" onClick={runFullPipeline} disabled={!client || !brief.trim() || textStatus === "running"}>
          {textStatus === "running" ? "Agentene jobber..." : "Start Steg 1 — Generer tekst"}
        </GlassButton>

        {textError && <p className="text-sm text-red-500">{textError}</p>}

        {/* Tekst-resultater i 2x2 grid */}
        {textResults && textStatus === "done" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {["strategist", "content", "seo", "analyst"].map(id => {
              const r = textResults[id];
              if (!r?.primary) return null;
              const agent = AGENTS.find(a => a.id === id);
              return (
                <div key={id} className="p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${agent?.color || ""}`}>{agent?.name}</span>
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed mt-2 max-h-[180px] overflow-y-auto">{r.primary}</pre>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* === STEG 2: BILDE === */}
      {textStatus === "done" && (
        <GlassCard className="p-5 space-y-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 mb-1">
            <GlassBadge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20">Steg 2</GlassBadge>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Bilde — AI-generering</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Bilde-prompt <span className="text-gray-400">(auto-generert fra tekst, kan redigeres)</span>
            </label>
            <GlassTextarea rows={3} value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} />
          </div>

          <GlassButton variant="primary" className="w-full" onClick={runImageStep} disabled={!imagePrompt.trim() || imageStatus === "running"}>
            {imageStatus === "running" ? "Genererer bilde..." : "Generer bilde"}
          </GlassButton>

          {imageError && <p className="text-sm text-amber-500">{imageError}</p>}

          {imageData && (
            <div className="mt-3">
              <img src={imageData} alt="Generert" className="w-full max-w-lg rounded-lg mx-auto" />
            </div>
          )}
        </GlassCard>
      )}

      {/* === STEG 3: VIDEO === */}
      {textStatus === "done" && (
        <GlassCard className="p-5 space-y-4 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-2 mb-1">
            <GlassBadge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20">Steg 3</GlassBadge>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Video — AI-storyboard</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Video-prompt <span className="text-gray-400">(auto-generert fra brief, kan redigeres)</span>
            </label>
            <GlassTextarea rows={3} value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} />
          </div>

          <GlassButton variant="primary" className="w-full" onClick={runVideoStep} disabled={!videoPrompt.trim() || videoStatus === "running"}>
            {videoStatus === "running" ? "Genererer video-konsept..." : "Generer video-storyboard"}
          </GlassButton>

          {videoError && <p className="text-sm text-red-500">{videoError}</p>}

          {videoConcept && (
            <div className="mt-3 p-4 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{videoConcept}</pre>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
