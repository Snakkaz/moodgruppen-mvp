"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { href: "/clients", label: "Kunder", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/generate", label: "Generer innhold", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { href: "/history", label: "Historikk", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[#08080d] border-r border-white/5 flex flex-col z-50 max-md:hidden">
      <div className="px-5 py-6 border-b border-white/5">
        <h1 className="text-lg font-bold tracking-wide text-white">Content<span className="text-indigo-400">AI</span></h1>
        <p className="text-[11px] text-white/30 mt-0.5">Moodgruppen MVP</p>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-indigo-500/10 text-indigo-400" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={n.icon}/></svg>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/5 text-[11px] text-white/20">Stian Petersen / PDC</div>
    </aside>
  );
}
