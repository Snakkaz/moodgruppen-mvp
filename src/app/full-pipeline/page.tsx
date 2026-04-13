"use client";

import { useState, useEffect } from "react";
import { getClients, getAgentSettings, CHANNELS, AGENTS, type Client } from "@/lib/store";
import { GlassCard, GlassButton, GlassSelect, GlassTextarea, GlassBadge } from "@/components/ui/glass";

type PipelineStep = "idle" | "running" | "done" | "error";

interface StepState {
  status: PipelineStep;
  data?: Record<string, unknown>;
  error?: string;
}

export default function FullPipelinePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0] as string);
  const [brief, setBrief] = useState("");

  const [textStep, setTextStep] = useState<StepState>({ status: "idle" });
  const [imageStep, setImageStep] = useState<StepState>({ status: "idle" });
  const [videoStep, setVideoStep] = useState<StepState>({ status: "idle" });

  useEffect(() => { setClients(getClients()); }, []);
  const client = clients.find(c => c.id === clientId);

  const isRunning = textStep.status === "running" || imageStep.status === "running" || videoStep.status === "running";

  const runPipeline = async () => {
    if (!client || !brief.trim()) return;

    // Reset
    setTextStep({ status: "running" });
    setImageStep({ status: "idle" });
    setVideoStep({ status: "idle" });

    // === STEG 1: TEKST ===
    let textOutput = "";
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, channel, brief: brief.trim(), agentSettings: getAgentSettings() }),
      });
      const data = await res.json();
      if (data.error) {
        setTextStep({ status: "error", error: data.error });
        return;
      }
      // Samle all tekst-output
      const results = data.results || {};
      const parts: string[] = [];
      for (const [agentId, result] of Object.entries(results)) {
        const r = result as { primary?: string; secondary?: string };
        const name = AGENTS.find(a => a.id === agentId)?.name || agentId;
        if (r?.primary) parts.push(`[${name}]: ${r.primary}`);
      }
      textOutput = parts.join("\n\n");
      setTextStep({ status: "done", data: { results, textOutput } });
    } catch {
      setTextStep({ status: "error", error: "Nettverksfeil i tekst-steget." });
      return;
    }

    // === STEG 2: BILDE ===
    setImageStep({ status: "running" });
    let imagePrompt = `Lag et profesjonelt bilde for ${client.name} (${client.industry}). Kanal: ${channel}. Stil: Moderne og rent. Basert på: ${brief.trim().slice(0, 200)}`;
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, style: "Fotorealistisk" }),
      });
      const data = await res.json();
      if (data.error) {
        setImageStep({ status: "error", error: data.error });
      } else {
        setImageStep({ status: "done", data: { image: data.image, text: data.text } });
        imagePrompt = data.text || imagePrompt;
      }
    } catch {
      setImageStep({ status: "error", error: "Nettverksfeil i bilde-steget." });
    }

    // === STEG 3: VIDEO ===
    setVideoStep({ status: "running" });
    try {
      const videoPromptText = `Lag en kort reklamefilm for ${client.name}. Bransje: ${client.industry}. Kanal: ${channel}. Brief: ${brief.trim().slice(0, 200)}. Tone: ${client.tone}. Målgruppe: ${client.audience || "bred"}.`;
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: videoPromptText, style: "Reklamefilm", duration: 5 }),
      });
      const data = await res.json();
      if (data.error) {
        setVideoStep({ status: "error", error: data.error });
      } else {
        setVideoStep({ status: "done", data: { concept: data.concept, videoUrl: data.videoUrl } });
      }
    } catch {
      setVideoStep({ status: "error", error: "Nettverksfeil i video-steget." });
    }
  };

  const stepIcon = (status: PipelineStep) => {
    switch (status) {
      case "running": return <div className="w-5 h-5 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />;
      case "done": return <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "error": return <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>;
      default: return <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />;
    }
  };

  const textResults = textStep.data?.results as Record<string, { primary?: string; secondary?: string }> | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Full Pipeline</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tekst → Bilde → Video — hele innholdspipelinen i ett steg
        </p>
      </div>

      {/* Input */}
      <GlassCard className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Kunde</label>
            {clients.length === 0 ? (
              <p className="text-sm text-gray-400">Ingen kunder — <a href="/clients" className="text-indigo-600 dark:text-indigo-400">legg til en</a></p>
            ) : (
              <GlassSelect value={clientId} onChange={e => setClientId(e.target.value)}>
                <option value="">Velg kunde...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </GlassSelect>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Kanal</label>
            <GlassSelect value={channel} onChange={e => setChannel(e.target.value)}>
              {CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
            </GlassSelect>
          </div>
          <div className="flex items-end">
            <GlassButton variant="primary" size="lg" className="w-full" onClick={runPipeline} disabled={!client || !brief.trim() || isRunning}>
              {isRunning ? "Pipeline kjører..." : "Start full pipeline"}
            </GlassButton>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Brief</label>
          <GlassTextarea rows={2} placeholder="Beskriv hva innholdet skal handle om..." value={brief} onChange={e => setBrief(e.target.value)} />
        </div>
      </GlassCard>

      {/* Pipeline progress */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-2">
          {stepIcon(textStep.status)}
          <span className={`text-sm font-medium ${textStep.status === "done" ? "text-emerald-600 dark:text-emerald-400" : textStep.status === "running" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>Tekst</span>
        </div>
        <div className={`flex-1 h-px ${textStep.status === "done" ? "bg-emerald-500/40" : "bg-gray-200 dark:bg-gray-700"}`} />
        <div className="flex items-center gap-2">
          {stepIcon(imageStep.status)}
          <span className={`text-sm font-medium ${imageStep.status === "done" ? "text-emerald-600 dark:text-emerald-400" : imageStep.status === "running" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>Bilde</span>
        </div>
        <div className={`flex-1 h-px ${imageStep.status === "done" ? "bg-emerald-500/40" : "bg-gray-200 dark:bg-gray-700"}`} />
        <div className="flex items-center gap-2">
          {stepIcon(videoStep.status)}
          <span className={`text-sm font-medium ${videoStep.status === "done" ? "text-emerald-600 dark:text-emerald-400" : videoStep.status === "running" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>Video</span>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Tekst output */}
        {textStep.status === "done" && textResults && (
          <GlassCard className="overflow-hidden">
            <div className="px-5 py-3 border-b border-white/20 dark:border-white/5 flex items-center gap-2">
              <GlassBadge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">Steg 1</GlassBadge>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Tekst — 4 agenter</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {["strategist", "content", "seo", "analyst"].map(id => {
                const r = textResults[id];
                if (!r?.primary) return null;
                const agent = AGENTS.find(a => a.id === id);
                return (
                  <div key={id} className="p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${agent?.color || ""}`}>{agent?.name}</span>
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed mt-2 max-h-[200px] overflow-y-auto">{r.primary}</pre>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
        {textStep.error && (
          <GlassCard className="p-4 border-red-300/50 dark:border-red-500/30">
            <p className="text-sm text-red-600 dark:text-red-400">Tekst: {textStep.error}</p>
          </GlassCard>
        )}

        {/* Bilde output */}
        {imageStep.status === "done" && imageStep.data && (
          <GlassCard className="overflow-hidden">
            <div className="px-5 py-3 border-b border-white/20 dark:border-white/5 flex items-center gap-2">
              <GlassBadge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20">Steg 2</GlassBadge>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Bilde</span>
            </div>
            <div className="p-5">
              {(imageStep.data as { image?: string }).image ? (
                <img src={(imageStep.data as { image: string }).image} alt="Generert bilde" className="w-full max-w-lg rounded-lg mx-auto" />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">{(imageStep.data as { text?: string }).text || "Bilde generert."}</p>
              )}
            </div>
          </GlassCard>
        )}
        {imageStep.error && (
          <GlassCard className="p-4 border-amber-300/50 dark:border-amber-500/30">
            <p className="text-sm text-amber-600 dark:text-amber-400">Bilde: {imageStep.error}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bildegenerering fortsetter til neste steg.</p>
          </GlassCard>
        )}

        {/* Video output */}
        {videoStep.status === "done" && videoStep.data && (
          <GlassCard className="overflow-hidden">
            <div className="px-5 py-3 border-b border-white/20 dark:border-white/5 flex items-center gap-2">
              <GlassBadge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20">Steg 3</GlassBadge>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Video — Storyboard</span>
            </div>
            <div className="p-5">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{(videoStep.data as { concept?: string }).concept}</pre>
            </div>
          </GlassCard>
        )}
        {videoStep.error && (
          <GlassCard className="p-4 border-red-300/50 dark:border-red-500/30">
            <p className="text-sm text-red-600 dark:text-red-400">Video: {videoStep.error}</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
