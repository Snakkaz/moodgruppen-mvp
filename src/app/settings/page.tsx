"use client";
import { useEffect, useState } from "react";
import { getSettings, saveSettings, AGENTS, type AISettings } from "@/lib/store";

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
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mg-dark", next ? "1" : "0");
  };

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

  const inputCls = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors";
  const cardCls = "bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Innstillinger</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Konfigurer AI-leverandører, modeller og utseende</p>
        </div>
        <button onClick={toggleDark}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          {dark ? "Lyst tema" : "Mørkt tema"}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* API Config */}
        <div className={cardCls + " space-y-4"}>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">AI-leverandør</h3>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Leverandør</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setSettings({ ...settings, provider: p.id, model: p.models[0] })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${settings.provider === p.id
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700"
                    : "bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">API-nøkkel</label>
            <input type="password" value={settings.apiKey} onChange={e => setSettings({ ...settings, apiKey: e.target.value })} className={inputCls} placeholder={provider.placeholder} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Modell</label>
            <select value={settings.model} onChange={e => setSettings({ ...settings, model: e.target.value })} className={inputCls}>
              {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
              {saved ? "Lagret!" : "Lagre"}
            </button>
            <button onClick={test} disabled={!settings.apiKey || testing}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
              {testing ? "Tester..." : "Test tilkobling"}
            </button>
          </div>

          {testResult && (
            <div className={`text-sm p-3 rounded-lg ${testResult.includes("fungerer") ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Agent Model Recommendations */}
        <div className={cardCls}>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Anbefalte modeller per agent</h3>
          <div className="space-y-3">
            {AGENTS.map(a => {
              const rec = AGENT_MODELS[a.id];
              return (
                <div key={a.id} className={`rounded-lg p-3 border ${a.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{a.name}</span>
                    <span className="text-[11px] font-medium opacity-80">{rec?.recommended}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-60">{rec?.reason}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Architecture */}
        <div className={cardCls}>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Multi-agent arkitektur</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 leading-relaxed">
            <p>Hver forespørsel kjøres gjennom 4 spesialiserte AI-agenter parallelt. Agentene har ulike system-prompts og kontekst optimalisert for sin rolle.</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-3 font-mono text-[11px] text-gray-600 dark:text-gray-300 leading-loose">
              <div className="text-gray-400">// Parallell kjøring</div>
              <div>Brief + Kundeprofil</div>
              <div className="ml-4 text-blue-600 dark:text-blue-400">├── Strateg-agent → kanalanbefaling</div>
              <div className="ml-4 text-purple-600 dark:text-purple-400">├── Innholds-agent → ferdig innhold</div>
              <div className="ml-4 text-emerald-600 dark:text-emerald-400">├── SEO-agent → søkeoptimalisering</div>
              <div className="ml-4 text-amber-600 dark:text-amber-400">└── Analyse-agent → evaluering + forslag</div>
              <div className="mt-1 text-gray-400">// → samlet resultat til bruker</div>
            </div>
            <p className="mt-2">Neste steg: Integrasjon med n8n/Make for workflow-orkestrering, RAG med vektordatabase (Qdrant) for kunnskapsbaserte svar, og Semrush/Surfer SEO-integrasjon for SEO-agenten.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
