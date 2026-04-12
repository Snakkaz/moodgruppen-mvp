"use client";
import { useEffect, useState } from "react";
import { getSettings, saveSettings, type AISettings } from "@/lib/store";

const PROVIDERS = [
  { id: "github", name: "GitHub Models", placeholder: "ghp_xxxx eller GitHub PAT", models: ["openai/gpt-4.1-mini", "openai/gpt-4.1", "openai/gpt-4o", "openai/gpt-4o-mini", "meta-llama/Meta-Llama-3.1-70B-Instruct"] },
  { id: "openai", name: "OpenAI", placeholder: "sk-xxxx", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"] },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<AISettings>({ provider: "github", apiKey: "", model: "openai/gpt-4.1-mini" });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => { setSettings(getSettings()); }, []);

  const provider = PROVIDERS.find(p => p.id === settings.provider) || PROVIDERS[0];

  const save = () => {
    saveSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const test = async () => {
    setTesting(true); setTestResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { name: "Test AS", industry: "Teknologi", tone: "Profesjonell", audience: "alle", guidelines: "" },
          channel: "LinkedIn Post",
          brief: "Si hei og bekreft at tilkoblingen fungerer. Maks 1 setning.",
          settings,
        }),
      });
      const data = await res.json();
      if (data.results?.content) { setTestResult("Tilkoblingen fungerer! AI svarte korrekt."); }
      else { setTestResult("Feil: " + (data.error || "Ukjent feil")); }
    } catch { setTestResult("Kunne ikke koble til API."); }
    setTesting(false);
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Innstillinger</h1>
        <p className="text-sm text-gray-500 mt-1">Konfigurer AI-leverandør og API-nøkler</p>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">AI-leverandør</h3>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Leverandør</label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setSettings({ ...settings, provider: p.id, model: p.models[0] })}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${settings.provider === p.id
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"}`}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">API-nøkkel</label>
            <input type="password" value={settings.apiKey} onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
              className={inputCls} placeholder={provider.placeholder} />
            <p className="text-[11px] text-gray-400 mt-1">
              {settings.provider === "github" ? "Bruk et GitHub Personal Access Token med Models-tilgang" : "Hentes fra platform.openai.com/api-keys"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Modell</label>
            <select value={settings.model} onChange={e => setSettings({ ...settings, model: e.target.value })} className={inputCls}>
              {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
              {saved ? "Lagret!" : "Lagre"}
            </button>
            <button onClick={test} disabled={!settings.apiKey || testing}
              className="px-5 py-2.5 bg-white border border-gray-200 hover:border-indigo-200 text-gray-600 hover:text-indigo-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
              {testing ? "Tester..." : "Test tilkobling"}
            </button>
          </div>

          {testResult && (
            <div className={`text-sm p-3 rounded-lg ${testResult.startsWith("Feil") || testResult.startsWith("Kunne") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
              {testResult}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Om multi-agent arkitekturen</h3>
          <div className="text-xs text-gray-500 space-y-2 leading-relaxed">
            <p>Hver innholdsforespørsel kjøres gjennom 4 spesialiserte AI-agenter parallelt:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li><strong>Strateg-agent</strong> — analyserer bransje og anbefaler kanalstrategi</li>
              <li><strong>Innholds-agent</strong> — genererer innhold tilpasset tone, kanal og målgruppe</li>
              <li><strong>SEO-agent</strong> — optimaliserer for søk med nøkkelord og metabeskrivelser</li>
              <li><strong>Analyse-agent</strong> — evaluerer innholdet og foreslår forbedringer</li>
            </ol>
            <p>Alle agenter bruker samme LLM-backend, men med spesialiserte system-prompts og kontekst.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
