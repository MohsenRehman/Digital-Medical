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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SearchProvider>
        <div className="flex h-screen bg-[#f8f9fa] dark:bg-gray-900 overflow-hidden text-[#1a202c] dark:text-gray-100 transition-colors duration-200">
          <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      </SearchProvider>
    </ThemeProvider>
  );
}

