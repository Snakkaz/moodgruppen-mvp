"use client";
import { useEffect, useState } from "react";
import { getSettings, saveSettings, AGENTS, type AISettings } from "@/lib/store";
import { GlassCard, GlassButton, GlassInput, GlassSelect } from "@/components/ui/glass";

const PROVIDERS = [
  { id: "github", name: "GitHub Models", placeholder: "ghp_xxxx", models: ["openai/gpt-4.1-mini", "openai/gpt-4.1", "openai/gpt-4o", "openai/gpt-4o-mini"] },
  { id: "openai", name: "OpenAI", placeholder: "sk-xxxx", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4.1-mini", "gpt-5"] },
  { id: "anthropic", name: "Anthropic", placeholder: "sk-ant-xxxx", models: ["claude-sonnet-4.6", "claude-opus-4.6", "claude-4.5-sonnet"] },
  { id: "google", name: "Google Gemini", placeholder: "AIzaSy...", models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"] },
  { id: "perplexity", name: "Perplexity", placeholder: "pplx-xxxx", models: ["sonar-pro", "sonar", "sonar-deep-research"] },
];

const AGENT_MODELS: Record<string, { recommended: string; reason: string }> = {
  strategist: { recommended: "Perplexity sonar-pro + Claude 4.5", reason: "Sanntidsdata for bransjeanalyse og dyp strategisk resonnering" },
  content: { recommended: "Claude Sonnet 4.6 + Gemini 2.5 Pro", reason: "Menneskelig tonefall, stort kontekstvindu for merkevareguider" },
  seo: { recommended: "Gemini 2.5 Pro + GPT-5", reason: "Søkeintensjon, metatitler, long-tail nøkkelord" },
  analyst: { recommended: "Claude Opus 4.6 + MiniMax M2", reason: "Dyp analytisk dybde og kostnadseffektiv dataanalyse" },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AISettings>({ provider: "github", apiKey: "", model: "openai/gpt-4.1-mini" });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => { setSettings(getSettings()); }, []);
  const provider = PROVIDERS.find(p => p.id === settings.provider) || PROVIDERS[0];

  const save = () => { saveSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const test = async () => {
    setTesting(true); setTestResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { name: "Test AS", industry: "Teknologi", tone: "Profesjonell", audience: "alle", guidelines: "" },
          channel: "LinkedIn Post", brief: "Bekreft at tilkoblingen fungerer. Maks 1 setning.", settings,
        }),
      });
      const data = await res.json();
      setTestResult(data.results?.content ? "Tilkoblingen fungerer! AI svarte korrekt." : "Feil: " + (data.error || "Ukjent feil"));
    } catch { setTestResult("Kunne ikke koble til API."); }
    setTesting(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Innstillinger</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Konfigurer AI-leverandører, modeller og tilkoblinger</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* API Status */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${settings.apiKey ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.4)]"}`}/>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{settings.apiKey ? "API tilkoblet" : "Ingen API-tilkobling"}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{settings.apiKey ? `${provider.name} — ${settings.model}` : "Legg til en API-nøkkel for å aktivere AI-agentene"}</div>
              </div>
            </div>
            {settings.apiKey && (
              <GlassButton size="sm" onClick={test} disabled={testing}>
                {testing ? "Tester..." : "Test tilkobling"}
              </GlassButton>
            )}
          </div>
          {testResult && (
            <div className={`mt-3 text-sm p-3 rounded-lg ${testResult.includes("fungerer") ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20" : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"}`}>
              {testResult}
            </div>
          )}
        </GlassCard>

        {/* API Config */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">AI-leverandør</h3>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Leverandør</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PROVIDERS.map(p => (
                <GlassButton key={p.id} size="sm" onClick={() => setSettings({ ...settings, provider: p.id, model: p.models[0] })}
                  className={settings.provider === p.id ? "bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400/30" : ""}>
                  {p.name}
                </GlassButton>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">API-nøkkel</label>
            <GlassInput type="password" value={settings.apiKey} onChange={e => setSettings({ ...settings, apiKey: e.target.value })} placeholder={provider.placeholder} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Modell</label>
            <GlassSelect value={settings.model} onChange={e => setSettings({ ...settings, model: e.target.value })}>
              {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
            </GlassSelect>
          </div>

          <GlassButton variant="primary" onClick={save}>
            {saved ? "Lagret!" : "Lagre innstillinger"}
          </GlassButton>
        </GlassCard>

        {/* Agent Recommendations */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Anbefalte modeller per agent</h3>
          <div className="space-y-3">
            {AGENTS.map(a => {
              const rec = AGENT_MODELS[a.id];
              return (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${settings.apiKey ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"}`}/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{a.name}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{rec?.recommended}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rec?.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Architecture */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Arkitektur</h3>
          <div className="bg-white/30 dark:bg-white/5 rounded-lg p-4 font-mono text-[11px] text-gray-600 dark:text-gray-400 leading-loose border border-white/20 dark:border-white/5">
            <div className="text-gray-400 dark:text-gray-600">// Parallell agent-kjøring</div>
            <div className="text-gray-700 dark:text-gray-300">Brief + Kundeprofil</div>
            <div className="ml-4 text-blue-600 dark:text-blue-400">├── Strateg-agent → kanalanbefaling</div>
            <div className="ml-4 text-purple-600 dark:text-purple-400">├── Innholds-agent → ferdig innhold</div>
            <div className="ml-4 text-emerald-600 dark:text-emerald-400">├── SEO-agent → søkeoptimalisering</div>
            <div className="ml-4 text-amber-600 dark:text-amber-400">└── Analyse-agent → evaluering + forslag</div>
            <div className="mt-2 text-gray-400 dark:text-gray-600">// Neste steg</div>
            <div className="text-gray-500 dark:text-gray-500">n8n/Make → workflow-orkestrering</div>
            <div className="text-gray-500 dark:text-gray-500">Qdrant → RAG vektordatabase</div>
            <div className="text-gray-500 dark:text-gray-500">Semrush → SEO-agent integrasjon</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
