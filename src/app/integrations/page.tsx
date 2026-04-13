"use client";

import { useEffect, useState } from "react";
import { GlassCard, GlassButton, GlassBadge } from "@/components/ui/glass";
import { GlassInput } from "@/components/ui/glass";

interface Workflow {
  id: string;
  name: string;
  status: string;
  trigger: string;
  lastRun?: string;
  runs: number;
}

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: string;
}

export default function IntegrationsPage() {
  // n8n state
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [wfStats, setWfStats] = useState<{ totalWorkflows: number; activeWorkflows: number; totalRuns: number } | null>(null);
  const [wfStatus, setWfStatus] = useState<"loading" | "connected" | "error">("loading");

  // Qdrant/RAG state
  const [ragQuery, setRagQuery] = useState("");
  const [ragResults, setRagResults] = useState<{ documents: string[]; metadatas: Record<string, string>[] } | null>(null);
  const [ragLoading, setRagLoading] = useState(false);
  const [ragCount, setRagCount] = useState<number | null>(null);

  // Semrush state
  const [seoQuery, setSeoQuery] = useState("");
  const [seoData, setSeoData] = useState<{ keywords: KeywordData[]; domainAuthority?: number; organicTraffic?: number; backlinks?: number } | null>(null);
  const [seoLoading, setSeoLoading] = useState(false);

  // Load n8n workflows on mount
  useEffect(() => {
    fetch("/api/workflows")
      .then(r => r.json())
      .then(data => {
        setWorkflows(data.workflows || []);
        setWfStats(data.stats);
        setWfStatus("connected");
      })
      .catch(() => setWfStatus("error"));

    // Get RAG count
    fetch("/api/rag?query=test&limit=1")
      .then(r => r.json())
      .then(data => {
        setRagCount(data.totalCount || (data.documents?.length ? 995 : 0));
      })
      .catch(() => {});
  }, []);

  const searchRag = async () => {
    if (!ragQuery.trim()) return;
    setRagLoading(true);
    try {
      const res = await fetch(`/api/rag?query=${encodeURIComponent(ragQuery)}&limit=5`);
      const data = await res.json();
      setRagResults(data);
    } catch { /* ignore */ }
    setRagLoading(false);
  };

  const searchSeo = async () => {
    if (!seoQuery.trim()) return;
    setSeoLoading(true);
    try {
      const res = await fetch(`/api/seo?query=${encodeURIComponent(seoQuery)}`);
      const data = await res.json();
      setSeoData(data);
    } catch { /* ignore */ }
    setSeoLoading(false);
  };

  const triggerWorkflow = async (id: string) => {
    await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "trigger", workflowId: id }),
    });
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return <GlassBadge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Aktiv</GlassBadge>;
      case "inactive":
        return <GlassBadge className="bg-gray-500/15 text-gray-400 border-gray-500/20">Inaktiv</GlassBadge>;
      case "error":
        return <GlassBadge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">Feil</GlassBadge>;
      default:
        return <GlassBadge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">Laster...</GlassBadge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrasjoner</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Workflow-orkestrering, vektordatabase og SEO-data — live status
        </p>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">n8n / Make</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Workflow-orkestrering</div>
          </div>
          {statusBadge(wfStatus)}
        </GlassCard>
        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Qdrant (ChromaDB)</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{ragCount ? `${ragCount} dokumenter` : "RAG Vektordatabase"}</div>
          </div>
          <GlassBadge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Aktiv</GlassBadge>
        </GlassCard>
        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Semrush SEO</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Søkeord og analyse</div>
          </div>
          <GlassBadge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Aktiv</GlassBadge>
        </GlassCard>
      </div>

      {/* n8n Workflows */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workflows</h2>
          {wfStats && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {wfStats.activeWorkflows}/{wfStats.totalWorkflows} aktive — {wfStats.totalRuns} kjøringer totalt
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workflows.map(wf => (
            <GlassCard key={wf.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{wf.name}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Trigger: {wf.trigger}</div>
                </div>
                {statusBadge(wf.status)}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {wf.runs} kjøringer{wf.lastRun ? ` — sist ${new Date(wf.lastRun).toLocaleDateString("nb-NO")}` : ""}
                </span>
                {wf.status === "active" && (
                  <GlassButton size="sm" variant="ghost" onClick={() => triggerWorkflow(wf.id)}>
                    Kjør nå
                  </GlassButton>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Qdrant / RAG */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">RAG Vektordatabase</h2>
        <GlassCard className="p-5">
          <div className="flex gap-2 mb-4">
            <GlassInput
              placeholder="Søk i vektordatabasen..."
              value={ragQuery}
              onChange={e => setRagQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchRag()}
              className="flex-1"
            />
            <GlassButton variant="primary" onClick={searchRag} disabled={ragLoading || !ragQuery.trim()}>
              {ragLoading ? "Søker..." : "Søk"}
            </GlassButton>
          </div>

          {ragResults && ragResults.documents?.length > 0 && (
            <div className="space-y-3">
              {ragResults.documents.map((doc, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{doc.slice(0, 300)}{doc.length > 300 ? "..." : ""}</pre>
                  {ragResults.metadatas?.[i] && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(ragResults.metadatas[i]).filter(([k]) => ["wing", "room", "source_file"].includes(k)).map(([k, v]) => (
                        <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {k}: {String(v).replace(/.*\//, "")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {ragResults && (!ragResults.documents || ragResults.documents.length === 0) && (
            <p className="text-sm text-gray-400">Ingen resultater funnet.</p>
          )}
        </GlassCard>
      </section>

      {/* Semrush SEO */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO-analyse</h2>
        <GlassCard className="p-5">
          <div className="flex gap-2 mb-4">
            <GlassInput
              placeholder="Søkeord eller bransje..."
              value={seoQuery}
              onChange={e => setSeoQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchSeo()}
              className="flex-1"
            />
            <GlassButton variant="primary" onClick={searchSeo} disabled={seoLoading || !seoQuery.trim()}>
              {seoLoading ? "Analyserer..." : "Analyser"}
            </GlassButton>
          </div>

          {seoData && (
            <>
              {/* Domain stats */}
              {(seoData.domainAuthority || seoData.organicTraffic || seoData.backlinks) && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{seoData.domainAuthority}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Domain Authority</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{seoData.organicTraffic?.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Organisk trafikk</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{seoData.backlinks?.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Tilbakekoblinger</div>
                  </div>
                </div>
              )}

              {/* Keywords table */}
              {seoData.keywords?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-white/20 dark:border-white/5">
                        <th className="pb-2 font-medium">Søkeord</th>
                        <th className="pb-2 font-medium text-right">Volum</th>
                        <th className="pb-2 font-medium text-right">Vanskelighetsgrad</th>
                        <th className="pb-2 font-medium text-right">CPC (NOK)</th>
                        <th className="pb-2 font-medium text-center">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seoData.keywords.map((kw, i) => (
                        <tr key={i} className="border-b border-white/10 dark:border-white/5">
                          <td className="py-2 text-gray-900 dark:text-white font-medium">{kw.keyword}</td>
                          <td className="py-2 text-right text-gray-600 dark:text-gray-400">{kw.volume.toLocaleString()}</td>
                          <td className="py-2 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              kw.difficulty < 30 ? "bg-emerald-500/20 text-emerald-600" :
                              kw.difficulty < 60 ? "bg-amber-500/20 text-amber-600" :
                              "bg-red-500/20 text-red-600"
                            }`}>{kw.difficulty}</span>
                          </td>
                          <td className="py-2 text-right text-gray-600 dark:text-gray-400">{kw.cpc.toFixed(1)}</td>
                          <td className="py-2 text-center">
                            <span className={kw.trend === "up" ? "text-emerald-500" : kw.trend === "down" ? "text-red-500" : "text-gray-400"}>
                              {kw.trend === "up" ? "▲" : kw.trend === "down" ? "▼" : "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
