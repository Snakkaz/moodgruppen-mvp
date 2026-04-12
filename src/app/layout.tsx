import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "MoodAI — Intelligent innholdsproduksjon",
  description: "Multi-agent AI-plattform for markedsføringsbyråer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Sidebar />
        <main className="md:ml-60 min-h-screen bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
