"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getAgentSettings, AGENTS } from "@/lib/store";

const nav = [
  { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { href: "/clients", label: "Kunder", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/generate", label: "Generer innhold", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { href: "/history", label: "Historikk", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/pipeline", label: "Pipeline", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-1.102-4.555a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" },
  { href: "/image", label: "Bilde", icon: "m2.25 15.75 5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" },
  { href: "/video", label: "Video", icon: "m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" },
  { href: "/integrations", label: "Integrasjoner", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.875-9.875l4.5 4.5a4.5 4.5 0 010 6.364l-4.5 4.5a4.5 4.5 0 01-6.364 0l-1.757-1.757" },
  { href: "/settings", label: "Innstillinger", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [expandAgents, setExpandAgents] = useState(false);
  const [agentSettings, setAgentSettings] = useState(() => typeof window !== "undefined" ? getAgentSettings() : {});

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mg-dark", next ? "1" : "0");
  };

  const NavLinks = () => (
    <>
      {nav.map((n) => {
        const active = pathname === n.href;
        return (
          <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${active
              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"}`}>
            <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={n.icon}/></svg>
            {n.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-white/60 dark:bg-black/30 backdrop-blur-xl border-r border-white/20 dark:border-white/5 flex flex-col z-50 max-md:hidden">
        <div className="px-6 py-5 border-b border-white/20 dark:border-white/5">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mood<span className="text-indigo-600 dark:text-indigo-400">AI</span></h1>
          <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">Multi-agent innholdsplattform</p>
        </div>

        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          <NavLinks />

          {/* Agent panel */}
          <div className="mt-4 pt-3 border-t border-white/15 dark:border-white/5">
            <button onClick={() => setExpandAgents(!expandAgents)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <span>Agenter</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${expandAgents ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {expandAgents && (
              <div className="mt-1 space-y-1.5">
                {AGENTS.map(a => {
                  const config = agentSettings[a.id] || {};
                  const configured = config.primaryApiKey && config.secondaryApiKey;

                  return (
                    <div key={a.id} className="px-2 py-2 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{a.name}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${configured ? "bg-emerald-400" : "bg-red-400 animate-pulse"}`}/>
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {configured ? `${config.primaryModel || "Primær"} + ${config.secondaryModel || "Sekundær"}` : "Ikke konfigurert"}
                      </div>
                      <div className="text-[9px] text-gray-300 dark:text-gray-600 mt-0.5 italic">{a.desc}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Dark mode toggle */}
        <div className="px-3 py-2 border-t border-white/15 dark:border-white/5">
          <button onClick={toggleDark}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 transition-all">
            {dark ? (
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
            ) : (
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
            )}
            {dark ? "Lyst tema" : "Mørkt tema"}
          </button>
        </div>
      </aside>
    </>
  );
}