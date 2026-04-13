"use client";
import { useEffect, useState, useCallback } from "react";
import { getAgentSettings, saveAgentSettings, AGENTS, DEFAULT_SOULS, type AgentSettings, type AgentConfig } from "@/lib/store";
import { GlassCard, GlassButton, GlassInput, GlassSelect, GlassTextarea, GlassBadge } from "@/components/ui/glass";

const PROVIDERS = [
  { id: "", name: "Velg leverandør...", placeholder: "", models: [] },
  {
    id: "demo",
    name: "Demo (Gemma — gratis)",
    placeholder: "Innebygd",
    models: ["gemma-3-1b-it", "gemma-3-4b-it", "gemma-3-12b-it", "gemma-3-27b-it", "gemma-4-26b-a4b-it", "gemma-4-31b-it"],
  },
  {
    id: "github",
    name: "GitHub Models",
    placeholder: "ghp_xxxx",
    models: [
      "openai/gpt-4.1", "openai/gpt-4.1-mini", "openai/gpt-4.1-nano",
      "openai/o4-mini",
      "meta-llama/llama-4-scout", "meta-llama/llama-4-maverick",
      "mistralai/mistral-large-2501", "mistralai/codestral-2501",
      "cohere/command-a",
      "deepseek/DeepSeek-R1", "deepseek/DeepSeek-V3",
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    placeholder: "sk-xxxx",
    models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "o3", "o3-mini", "o4-mini", "gpt-4.5-preview"],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    placeholder: "sk-ant-xxxx",
    models: ["claude-sonnet-4-20250514", "claude-opus-4-20250514", "claude-3.5-haiku-20241022"],
  },
  {
    id: "google",
    name: "Google Gemini",
    placeholder: "AIzaSy...",
    models: ["gemini-2.5-pro-preview-06-05", "gemini-2.5-flash-preview-05-20", "gemini-2.0-flash", "gemini-2.0-flash-lite"],
  },
  {
    id: "groq",
    name: "Groq",
    placeholder: "gsk_xxxx",
    models: ["llama-4-scout-17b-16e-instruct", "llama-4-maverick-17b-128e-instruct", "qwen-qwq-32b", "deepseek-r1-distill-llama-70b"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    placeholder: "pplx-xxxx",
    models: ["sonar-pro", "sonar", "sonar-deep-research", "sonar-reasoning-pro"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    placeholder: "sk-xxxx",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    placeholder: "xai-xxxx",
    models: ["grok-3", "grok-3-mini"],
  },
  {
    id: "minimax",
    name: "MiniMax",
    placeholder: "mm-xxxx",
    models: ["MiniMax-M2"],
  },
  {
    id: "ollama",
    name: "Ollama (lokal)",
    placeholder: "http://localhost:11434",
    models: ["llama3.1:8b", "qwen2.5:32b", "gemma2:27b", "mistral:7b", "codestral:latest"],
  },
];

const AGENT_COLORS: Record<string, { border: string; bg: string; text: string; dot: string; badge: string }> = {
  strategist: {
    border: "border-l-blue-500",
    bg: "bg-blue-500/5 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  content: {
    border: "border-l-purple-500",
    bg: "bg-purple-500/5 dark:bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  seo: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  analyst: {
    border: "border-l-amber-500",
    bg: "bg-amber-500/5 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
};

const RECOMMENDATIONS: Record<string, { primary: { provider: string; model: string }; secondary: { provider: string; model: string }; reason: string }> = {
  strategist: {
    primary: { provider: "perplexity", model: "sonar-pro" },
    secondary: { provider: "google", model: "gemini-2.5-pro-preview-06-05" },
    reason: "Sonar gir sanntids-data og markedsinnsikt. Gemini 2.5 Pro gir dyp analyse.",
  },
  content: {
    primary: { provider: "anthropic", model: "claude-sonnet-4-20250514" },
    secondary: { provider: "google", model: "gemini-2.5-flash-preview-05-20" },
    reason: "Claude Sonnet 4 skriver best norsk innhold. Gemini Flash er rask og billig som alternativ.",
  },
  seo: {
    primary: { provider: "google", model: "gemini-2.5-pro-preview-06-05" },
    secondary: { provider: "openai", model: "gpt-4.1" },
    reason: "Gemini Pro har bred søkeforståelse. GPT-4.1 gir presise nøkkelord-anbefalinger.",
  },
  analyst: {
    primary: { provider: "anthropic", model: "claude-opus-4-20250514" },
    secondary: { provider: "deepseek", model: "deepseek-reasoner" },
    reason: "Opus 4 er best pa kritisk evaluering. DeepSeek Reasoner gir alternativt perspektiv.",
  },
};

type ApiStatus = "idle" | "testing" | "ok" | "error";

function AgentConfigCard({ agent, config, colors, onUpdate }: {
  agent: typeof AGENTS[number];
  config: AgentConfig;
  colors: typeof AGENT_COLORS[string];
  onUpdate: (config: AgentConfig) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [primaryStatus, setPrimaryStatus] = useState<ApiStatus>("idle");
  const [secondaryStatus, setSecondaryStatus] = useState<ApiStatus>("idle");
  const [primaryError, setPrimaryError] = useState("");
  const [secondaryError, setSecondaryError] = useState("");
  const rec = RECOMMENDATIONS[agent.id];
  const primaryProvider = PROVIDERS.find(p => p.id === config.primaryProvider);
  const secondaryProvider = PROVIDERS.find(p => p.id === config.secondaryProvider);
  const hasPrimary = !!(config.primaryApiKey && config.primaryProvider && config.primaryModel);
  const hasSecondary = !!(config.secondaryApiKey && config.secondaryProvider && config.secondaryModel);

  const testApi = useCallback(async (slot: "primary" | "secondary") => {
    const setter = slot === "primary" ? setPrimaryStatus : setSecondaryStatus;
    const errSetter = slot === "primary" ? setPrimaryError : setSecondaryError;
    const provider = slot === "primary" ? config.primaryProvider : config.secondaryProvider;
    const apiKey = slot === "primary" ? config.primaryApiKey : config.secondaryApiKey;
    const model = slot === "primary" ? config.primaryModel : config.secondaryModel;

    if (!provider || !apiKey || !model) return;
    setter("testing");
    errSetter("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { name: "Test", industry: "test", tone: "Profesjonell", audience: "test" },
          channel: "LinkedIn Post",
          brief: "Test av API-tilkobling. Svar med ett ord: OK",
          agentSettings: {
            [agent.id]: {
              ...config,
              soul: "Du er en test-agent. Svar med ett ord: OK",
            },
          },
          testMode: true,
          testAgent: agent.id,
          testSlot: slot,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const result = data.results?.[agent.id]?.[slot];
        if (result) {
          setter("ok");
        } else {
          setter("error");
          errSetter("Ingen respons fra modellen");
        }
      } else {
        setter("error");
        errSetter(`HTTP ${res.status}`);
      }
    } catch {
      setter("error");
      errSetter("Tilkoblingsfeil");
    }
    setTimeout(() => { setter("idle"); errSetter(""); }, 5000);
  }, [agent.id, config]);

  const applyRecommendation = () => {
    onUpdate({
      ...config,
      primaryProvider: rec.primary.provider,
      primaryModel: rec.primary.model,
      secondaryProvider: rec.secondary.provider,
      secondaryModel: rec.secondary.model,
    });
  };

  const statusDot = (has: boolean, status: ApiStatus) => {
    if (status === "testing") return "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]";
    if (status === "ok") return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
    if (status === "error") return "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]";
    if (has) return "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.3)]";
    return "bg-gray-300 dark:bg-gray-600";
  };

  const statusLabel = (status: ApiStatus, error: string) => {
    if (status === "testing") return { text: "Tester...", color: "text-amber-500" };
    if (status === "ok") return { text: "Tilkoblet", color: "text-emerald-500" };
    if (status === "error") return { text: error || "Feil", color: "text-red-500" };
    return null;
  };

  return (
    <GlassCard className={`overflow-hidden border-l-4 ${colors.border}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start justify-between text-left hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-all ${statusDot(hasPrimary, primaryStatus)}`} />
              <div className={`w-2 h-2 rounded-full transition-all ${statusDot(hasSecondary, secondaryStatus)}`} />
            </div>
            <h3 className={`text-base font-bold ${colors.text}`}>{agent.name}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-[34px]">{agent.desc}</p>
          {/* Model badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 ml-[34px]">
            {hasPrimary ? (
              <GlassBadge className={colors.badge}>
                {primaryProvider?.name}: {config.primaryModel}
              </GlassBadge>
            ) : (
              <GlassBadge className="bg-gray-500/10 text-gray-400 border-gray-500/20">
                Primær: ikke satt
              </GlassBadge>
            )}
            {hasSecondary ? (
              <GlassBadge className={colors.badge}>
                {secondaryProvider?.name}: {config.secondaryModel}
              </GlassBadge>
            ) : (
              <GlassBadge className="bg-gray-500/10 text-gray-400 border-gray-500/20">
                Sekundær: ikke satt
              </GlassBadge>
            )}
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 mt-1 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className={`px-5 pb-5 space-y-5 border-t border-white/20 dark:border-white/5 pt-5 ${colors.bg}`}>
          {/* Recommendation */}
          <div className="p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Anbefalt oppsett</span>
              </div>
              <GlassButton size="sm" variant="ghost" onClick={applyRecommendation}>
                Bruk anbefalt
              </GlassButton>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 ml-6">{rec.reason}</p>
          </div>

          {/* Primary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Primærmodell</label>
              <div className="flex items-center gap-2">
                {statusLabel(primaryStatus, primaryError) && (
                  <span className={`text-[10px] font-medium ${statusLabel(primaryStatus, primaryError)!.color}`}>
                    {statusLabel(primaryStatus, primaryError)!.text}
                  </span>
                )}
                <GlassButton size="sm" variant="ghost" onClick={() => testApi("primary")} disabled={!hasPrimary || primaryStatus === "testing"}>
                  Test
                </GlassButton>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <GlassSelect
                value={config.primaryProvider || ""}
                onChange={e => {
                  const prov = PROVIDERS.find(p => p.id === e.target.value);
                  onUpdate({
                    ...config,
                    primaryProvider: e.target.value,
                    primaryModel: prov?.models[0] || "",
                    primaryApiKey: e.target.value === "demo" ? "demo" : config.primaryApiKey,
                  });
                }}
              >
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </GlassSelect>
              {config.primaryProvider === "demo" ? (
                <GlassInput value="Innebygd nøkkel" disabled className="opacity-50" />
              ) : (
                <GlassInput
                  type="password"
                  placeholder={primaryProvider?.placeholder || "API-nøkkel"}
                  value={config.primaryApiKey || ""}
                  onChange={e => onUpdate({ ...config, primaryApiKey: e.target.value })}
                />
              )}
              <GlassSelect
                value={config.primaryModel || ""}
                onChange={e => onUpdate({ ...config, primaryModel: e.target.value })}
              >
                <option value="">Velg modell...</option>
                {(primaryProvider?.models || []).map(m => <option key={m} value={m}>{m}</option>)}
              </GlassSelect>
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sekundærmodell</label>
              <div className="flex items-center gap-2">
                {statusLabel(secondaryStatus, secondaryError) && (
                  <span className={`text-[10px] font-medium ${statusLabel(secondaryStatus, secondaryError)!.color}`}>
                    {statusLabel(secondaryStatus, secondaryError)!.text}
                  </span>
                )}
                <GlassButton size="sm" variant="ghost" onClick={() => testApi("secondary")} disabled={!hasSecondary || secondaryStatus === "testing"}>
                  Test
                </GlassButton>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <GlassSelect
                value={config.secondaryProvider || ""}
                onChange={e => {
                  const prov = PROVIDERS.find(p => p.id === e.target.value);
                  onUpdate({
                    ...config,
                    secondaryProvider: e.target.value,
                    secondaryModel: prov?.models[0] || "",
                    secondaryApiKey: e.target.value === "demo" ? "demo" : config.secondaryApiKey,
                  });
                }}
              >
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </GlassSelect>
              {config.secondaryProvider === "demo" ? (
                <GlassInput value="Innebygd nøkkel" disabled className="opacity-50" />
              ) : (
                <GlassInput
                  type="password"
                  placeholder={secondaryProvider?.placeholder || "API-nøkkel"}
                  value={config.secondaryApiKey || ""}
                  onChange={e => onUpdate({ ...config, secondaryApiKey: e.target.value })}
                />
              )}
              <GlassSelect
                value={config.secondaryModel || ""}
                onChange={e => onUpdate({ ...config, secondaryModel: e.target.value })}
              >
                <option value="">Velg modell...</option>
                {(secondaryProvider?.models || []).map(m => <option key={m} value={m}>{m}</option>)}
              </GlassSelect>
            </div>
          </div>

          {/* Soul */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Soul / Systemprompt</label>
              <GlassButton size="sm" variant="ghost" onClick={() => onUpdate({ ...config, soul: DEFAULT_SOULS[agent.id] || "" })}>
                Tilbakestill
              </GlassButton>
            </div>
            <GlassTextarea
              rows={4}
              value={config.soul || DEFAULT_SOULS[agent.id] || ""}
              onChange={e => onUpdate({ ...config, soul: e.target.value })}
              placeholder="Systemprompt for denne agenten..."
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export default function SettingsPage() {
  const [agentSettings, setAgentSettings] = useState<AgentSettings>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAgentSettings(getAgentSettings());
  }, []);

  const updateAgent = (agentId: string, config: AgentConfig) => {
    const updated = { ...agentSettings, [agentId]: config };
    setAgentSettings(updated);
    saveAgentSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const enableDemoMode = () => {
    const base = { primaryApiKey: "demo", secondaryApiKey: "demo", soul: "" };
    const demoSettings: AgentSettings = {
      strategist: { ...base, primaryProvider: "demo", primaryModel: "gemma-3-4b-it", secondaryProvider: "demo", secondaryModel: "gemma-3-27b-it" },
      content: { ...base, primaryProvider: "demo", primaryModel: "gemma-3-27b-it", secondaryProvider: "demo", secondaryModel: "gemma-4-31b-it" },
      seo: { ...base, primaryProvider: "demo", primaryModel: "gemma-3-4b-it", secondaryProvider: "demo", secondaryModel: "gemma-3-27b-it" },
      analyst: { ...base, primaryProvider: "demo", primaryModel: "gemma-4-31b-it", secondaryProvider: "demo", secondaryModel: "gemma-3-4b-it" },
    };
    saveAgentSettings(demoSettings);
    setAgentSettings(demoSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const configuredCount = AGENTS.filter(a => {
    const c = agentSettings[a.id];
    return c?.primaryApiKey && c?.primaryProvider && c?.primaryModel;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent-konfigurasjon</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Konfigurer modeller, API-nøkler og systemprompt for hver agent
          </p>
        </div>
        {saved && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">Lagret!</span>
        )}
      </div>

      {/* Status + Demo */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${configuredCount === 4 ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : configuredCount > 0 ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "bg-gray-400"}`} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {configuredCount}/4 agenter konfigurert
            </span>
            <div className="hidden sm:flex items-center gap-3 ml-3">
              {AGENTS.map(a => {
                const c = agentSettings[a.id];
                const configured = !!(c?.primaryApiKey && c?.primaryProvider);
                const ac = AGENT_COLORS[a.id];
                return (
                  <div key={a.id} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${configured ? ac.dot : "bg-gray-300 dark:bg-gray-600"}`} />
                    <span className={`text-[11px] ${configured ? ac.text : "text-gray-400"} font-medium`}>{a.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <GlassButton variant="primary" size="sm" onClick={enableDemoMode}>
            Aktiver demo-modus
          </GlassButton>
        </div>
        {configuredCount === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Ingen agenter konfigurert. Klikk "Aktiver demo-modus" for a komme i gang med gratis Gemma-modeller, eller konfigurer hver agent manuelt nedenfor.
          </p>
        )}
      </GlassCard>

      {/* Agent cards */}
      <div className="space-y-4">
        {AGENTS.map(agent => (
          <AgentConfigCard
            key={agent.id}
            agent={agent}
            config={agentSettings[agent.id] || {} as AgentConfig}
            colors={AGENT_COLORS[agent.id]}
            onUpdate={(config) => updateAgent(agent.id, config)}
          />
        ))}
      </div>

      {/* Provider reference */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Leverandør-oversikt (2026)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PROVIDERS.filter(p => p.id).map(p => (
            <div key={p.id} className="p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{p.name}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{p.models.length} modeller</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">{p.models[0]}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
