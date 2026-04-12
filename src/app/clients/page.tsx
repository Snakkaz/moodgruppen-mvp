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
    saveClients(updated); setClients(updated); setForm(empty()); setEditing(null); setShowForm(false);
  };

  const remove = (id: string) => { const u = clients.filter(c => c.id !== id); saveClients(u); setClients(u); };
  const edit = (c: Client) => { setForm({ name: c.name, industry: c.industry, tone: c.tone, audience: c.audience, guidelines: c.guidelines }); setEditing(c.id); setShowForm(true); };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>{children}</div>
  );
  const inputCls = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kunder</h1>
          <p className="text-sm text-gray-500 mt-1">Kundeprofiler brukes av AI-agentene for å tilpasse innhold</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty()); }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          {showForm ? "Avbryt" : "Ny kunde"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{editing ? "Rediger kunde" : "Ny kundeprofil"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Bedriftsnavn"><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} placeholder="F.eks. REMA 1000"/></Field>
            <Field label="Bransje"><input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className={inputCls} placeholder="F.eks. Dagligvare"/></Field>
            <Field label="Tone of voice">
              <select value={form.tone} onChange={e => setForm({...form, tone: e.target.value})} className={inputCls}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Målgruppe"><input value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className={inputCls} placeholder="F.eks. kvinner 25-45"/></Field>
            <div className="sm:col-span-2">
              <Field label="Brand guidelines">
                <textarea value={form.guidelines} onChange={e => setForm({...form, guidelines: e.target.value})} rows={3} className={inputCls + " resize-none"} placeholder="Ord å unngå, farger, stil, referanser..."/>
              </Field>
            </div>
          </div>
          <button onClick={save} className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            {editing ? "Lagre endringer" : "Opprett kunde"}
          </button>
        </div>
      )}

      {clients.length === 0 && !showForm ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center shadow-sm">
          <p className="text-gray-400 dark:text-gray-500">Ingen kunder ennå. Legg til din første kunde for å begynne.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center justify-between shadow-sm">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.industry} — {c.tone} — {c.audience}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(c)} className="text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 transition-colors border border-gray-200">Rediger</button>
                <button onClick={() => remove(c.id)} className="text-xs px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors border border-red-200 dark:border-red-800">Slett</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
