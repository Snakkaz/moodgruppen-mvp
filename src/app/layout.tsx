import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ContentAI — Moodgruppen",
  description: "AI-drevet content pipeline for markedsforingsbyraer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className="dark">
      <body className="bg-[#0a0a0f] text-white/90 antialiased">
        <Sidebar />
        <main className="md:ml-56 min-h-screen">
          <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
