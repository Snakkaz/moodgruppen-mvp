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

export const CHANNEL_ICONS: Record<string, string> = {
  "Instagram Post": `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  "LinkedIn Post": `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  "Facebook Ad": `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  "Google Ads": `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.005 14.453l6.217-10.78 4.244 2.45L7.249 16.9zM16.148 24a3.86 3.86 0 003.86-3.86 3.86 3.86 0 00-3.86-3.86 3.86 3.86 0 00-3.86 3.86A3.86 3.86 0 0016.148 24zM16.633 13.37L10.416 2.59a3.861 3.861 0 00-5.275-1.413A3.861 3.861 0 003.73 6.453l6.217 10.78z"/></svg>`,
  "Blogginnlegg": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>`,
};

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
