export interface Client {
  id: string;
  name: string;
  industry: string;
  tone: string;
  audience: string;
  guidelines: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  clientId: string;
  clientName: string;
  channel: string;
  brief: string;
  content: string;
  agents: string[];
  createdAt: string;
}

export interface AISettings {
  provider: string;
  apiKey: string;
  model: string;
}

export const TONES = ["Formell", "Uformell", "Profesjonell", "Leken", "Autoritativ"] as const;
export const CHANNELS = ["Instagram Post", "LinkedIn Post", "Facebook Ad", "Google Ads", "Blogginnlegg"] as const;

export const AGENTS = [
  { id: "strategist", name: "Strateg", desc: "Analyserer bransje og anbefaler kanalstrategi", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "content", name: "Innholdsprodusent", desc: "Skriver innhold tilpasset tone og kanal", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "seo", name: "SEO-spesialist", desc: "Optimaliserer for søk og synlighet", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "analyst", name: "Analyseagent", desc: "Evaluerer innhold og foreslår forbedringer", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export const CHANNEL_COLORS: Record<string, string> = {
  "Instagram Post": "bg-pink-50 text-pink-700 border-pink-200",
  "LinkedIn Post": "bg-blue-50 text-blue-700 border-blue-200",
  "Facebook Ad": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Google Ads": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Blogginnlegg": "bg-purple-50 text-purple-700 border-purple-200",
};

// Storage helpers
export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("mg-clients") || "[]");
}
export function saveClients(c: Client[]) { localStorage.setItem("mg-clients", JSON.stringify(c)); }
export function getHistory(): ContentItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("mg-history") || "[]");
}
export function saveHistory(h: ContentItem[]) { localStorage.setItem("mg-history", JSON.stringify(h)); }
export function getSettings(): AISettings {
  if (typeof window === "undefined") return { provider: "github", apiKey: "", model: "openai/gpt-4.1-mini" };
  return JSON.parse(localStorage.getItem("mg-settings") || '{"provider":"github","apiKey":"","model":"openai/gpt-4.1-mini"}');
}
export function saveSettings(s: AISettings) { localStorage.setItem("mg-settings", JSON.stringify(s)); }
