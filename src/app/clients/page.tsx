"use client";
import { useEffect, useState, useCallback } from "react";
import { getClients, saveClients, TONES, type Client } from "@/lib/store";
import { GlassCard, GlassButton, GlassInput, GlassSelect, GlassTextarea } from "@/components/ui/glass";

const empty = () => ({ name: "", industry: "", tone: TONES[2] as string, audience: "", guidelines: "" });

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setClients(getClients()); }, []);

  const updateField = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const save = () => {
    if (!form.name || !form.industry) return;
    let updated: Client[];
    if (editing) {
      updated = clients.map(c => c.id === editing ? { ...c, ...form } : c);
    } else {
      updated = [{ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...clients];
    }
    saveClients(updated); setClients(updated); setForm(empty()); setEditing(null); setShowForm(false);
  };

  const remove = (id: string) => { const u = clients.filter(c => c.id !== id); saveClients(u); setClients(u); };
  const edit = (c: Client) => { setForm({ name: c.name, industry: c.industry, tone: c.tone, audience: c.audience, guidelines: c.guidelines }); setEditing(c.id); setShowForm(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kunder</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kundeprofiler brukes av AI-agentene for å tilpasse innhold</p>
        </div>
        <GlassButton variant={showForm ? "ghost" : "primary"} onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty()); }}>
          {showForm ? "Avbryt" : "Ny kunde"}
        </GlassButton>
      </div>

      {showForm && (
        <GlassCard className="p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">{editing ? "Rediger kunde" : "Ny kundeprofil"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Bedriftsnavn</label>
              <GlassInput value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="F.eks. REMA 1000"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Bransje</label>
              <GlassInput value={form.industry} onChange={e => updateField("industry", e.target.value)} placeholder="F.eks. Dagligvare"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tone of voice</label>
              <GlassSelect value={form.tone} onChange={e => updateField("tone", e.target.value)}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </GlassSelect>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Målgruppe</label>
              <GlassInput value={form.audience} onChange={e => updateField("audience", e.target.value)} placeholder="F.eks. kvinner 25-45"/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Brand guidelines</label>
              <GlassTextarea value={form.guidelines} onChange={e => updateField("guidelines", e.target.value)} rows={3} placeholder="Ord å unngå, farger, stil, referanser..."/>
            </div>
          </div>
          <div className="mt-4">
            <GlassButton variant="primary" onClick={save}>
              {editing ? "Lagre endringer" : "Opprett kunde"}
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {clients.length === 0 && !showForm ? (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">Ingen kunder ennå. Legg til din første kunde for å begynne.</p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {clients.map(c => (
            <GlassCard key={c.id} className="p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.industry} — {c.tone} — {c.audience}</div>
              </div>
              <div className="flex gap-2">
                <GlassButton size="sm" onClick={() => edit(c)}>Rediger</GlassButton>
                <GlassButton size="sm" className="text-red-600 dark:text-red-400" onClick={() => remove(c.id)}>Slett</GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
