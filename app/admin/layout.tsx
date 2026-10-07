import React from "react";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import { SearchProvider } from "./components/SearchContext";
import { ThemeProvider } from "../components/ThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <SearchProvider>
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-50 overflow-hidden selection:bg-emerald-500/30">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <div className="max-w-[1600px] mx-auto w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SearchProvider>
    </ThemeProvider>
  );
}

