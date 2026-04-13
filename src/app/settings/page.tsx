"use client";
import { useEffect, useState } from "react";
import { getAgentSettings, saveAgentSettings, type AgentSettings } from "@/lib/store";

export default function SettingsPage() {
  const [agentSettings, setAgentSettings] = useState(getAgentSettings());

  const enableDemoMode = () => {
    const base = { primaryApiKey: "demo", secondaryApiKey: "demo", soul: "" };
    const demoSettings: AgentSettings = {
      strategist: { ...base, primaryProvider: "demo", primaryModel: "gemma-3-12b-it", secondaryProvider: "demo", secondaryModel: "gemma-3-4b-it" },
      content: { ...base, primaryProvider: "demo", primaryModel: "gemma-3-27b-it", secondaryProvider: "demo", secondaryModel: "gemma-3-12b-it" },
      seo: { ...base, primaryProvider: "demo", primaryModel: "gemma-3-12b-it", secondaryProvider: "demo", secondaryModel: "gemma-3-4b-it" },
      analyst: { ...base, primaryProvider: "demo", primaryModel: "gemma-4-31b-it", secondaryProvider: "demo", secondaryModel: "gemma-3-12b-it" },
    };
    saveAgentSettings(demoSettings);
    setAgentSettings(demoSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div>
        <h2 className="text-lg font-medium">Demo-modus</h2>
        <p className="text-gray-600">Aktiver en gratis demo-modus med Gemma-modeller.</p>
        <button
          onClick={enableDemoMode}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Aktiver Demo-modus
        </button>
      </div>
    </div>
  );
}