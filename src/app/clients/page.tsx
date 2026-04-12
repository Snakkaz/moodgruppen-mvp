"use client";
import { useEffect, useState } from "react";
import { getClients, saveClients, TONES, type Client } from "@/lib/store";

const empty = (): Omit<Client, "id" | "createdAt"> => ({ name: "", industry: "", tone: TONES[2], audience: "", guidelines: "" });

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setClients(getClients()); }, []);

  const save = () => {
    if (!form.name || !form.industry) return;
    let updated: Client[];
    if (editing) {
      updated = clients.map(c => c.id === editing ? { ...c, ...form } : c);
    } else {
      updated = [{ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...clients];
    }
    saveClients(updated);
    setClients(updated);
    setForm(empty());
    setEditing(null);
    setShowForm(false);
  };

  const remove = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    saveClients(updated);
    setClients(updated);
  };

  const edit = (c: Client) => {
    setForm({ name: c.name, industry: c.industry, tone: c.tone, audience: c.audience, guidelines: c.guidelines });
    setEditing(c.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Kunder</h1>
          <p className="text-sm text-white/40 mt-1">Administrer kundeprofiler for innholdsgenerering</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty()); }}
          className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
          {showForm ? "Avbryt" : "Ny kunde"}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">{editing ? "Rediger kunde" : "Ny kundeprofil"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Bedriftsnavn *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none" placeholder="F.eks. REMA 1000"/>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Bransje *</label>
              <input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none" placeholder="F.eks. Dagligvare"/>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Tone of voice</label>
              <select value={form.tone} onChange={e => setForm({...form, tone: e.target.value})}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none">
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Målgruppe</label>
              <input value={form.audience} onChange={e => setForm({...form, audience: e.target.value})}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none" placeholder="F.eks. kvinner 25-45"/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/40 mb-1.5">Brand guidelines</label>
              <textarea value={form.guidelines} onChange={e => setForm({...form, guidelines: e.target.value})} rows={3}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"
                placeholder="Ord å unngaa, farger, stil, referanser..."/>
            </div>
          </div>
          <button onClick={save} className="mt-4 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
            {editing ? "Lagre endringer" : "Opprett kunde"}
          </button>
        </div>
      )}

      {clients.length === 0 && !showForm ? (
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-8 text-center">
          <p className="text-white/40">Ingen kunder ennå. Legg til din første kunde for å begynne.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map(c => (
            <div key={c.id} className="bg-[#12121a] border border-white/5 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{c.industry} — {c.tone} — {c.audience}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(c)} className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/60 transition-colors">Rediger</button>
                <button onClick={() => remove(c.id)} className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md text-red-400 transition-colors">Slett</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
