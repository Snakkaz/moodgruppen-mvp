import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { DarkModeInit } from "@/components/DarkModeInit";

export const metadata: Metadata = {
  title: "MoodAI — Intelligent innholdsproduksjon",
  description: "Multi-agent AI-plattform for markedsføringsbyråer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("mg-dark")==="1")document.documentElement.classList.add("dark")}catch(e){}` }} />
      </head>
      <body className="antialiased min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
        <DarkModeInit />
        <Sidebar />
        <main className="md:ml-60 min-h-screen pt-14 md:pt-0">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
