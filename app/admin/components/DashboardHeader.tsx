"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, Sun, Moon, User, Menu } from "lucide-react";
import { useSearch } from "./SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { searchTerm, setSearchTerm, isMobileMenuOpen, setIsMobileMenuOpen } = useSearch();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let pageTitle = "Dashboard";
  let searchPlaceholder = "Search clinics, doctors, patients...";
  
  if (pathname?.includes('/admin/billing')) {
    searchPlaceholder = "Search by invoice ID or clinic...";
    pageTitle = "Billing & Payments";
  } else if (pathname?.includes('/admin/clinics')) {
    searchPlaceholder = "Search by name or location...";
    pageTitle = "Organizations";
  } else if (pathname?.includes('/admin/doctors')) {
    searchPlaceholder = "Search by name, specialization, or clinic...";
    pageTitle = "Doctors";
  } else if (pathname?.includes('/admin/patients')) {
    searchPlaceholder = "Search by name, clinic, or doctor...";
    pageTitle = "Patients";
  } else if (pathname?.includes('/admin/appointments')) {
    searchPlaceholder = "Search by patient, doctor, or clinic...";
    pageTitle = "Appointments";
  } else if (pathname?.includes('/admin/reports')) {
    pageTitle = "Reports";
  } else if (pathname?.includes('/admin/settings')) {
    pageTitle = "Settings";
  }

  return (
    <header className="h-20 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 relative transition-colors duration-200">
      <div className="flex items-center flex-1 gap-3 sm:gap-0">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Page Title */}
        <h1 className="md:hidden text-lg font-bold text-slate-800 dark:text-zinc-100 truncate">
          {pageTitle}
        </h1>

        {/* Search (Desktop Only) */}
        <div className="hidden md:block flex-1 w-full">
          {(pathname?.includes('/admin/settings') || pathname?.includes('/admin/reports')) ? (
            <div className="w-full"></div>
          ) : (
            <div className="max-w-md relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-zinc-200 placeholder:text-slate-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-zinc-700 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-5">
        <button className="relative text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white dark:text-zinc-950 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-[#09090b]">
            3
          </span>
        </button>

        {mounted && (
          <button 
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 pl-5 border-l border-slate-200 dark:border-zinc-800 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-600 dark:text-zinc-300 overflow-hidden shrink-0">
              {mounted && localStorage.getItem('adminProfileImage') ? (
                <img src={localStorage.getItem('adminProfileImage')!} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">Admin</p>
            </div>
          </div>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-4 w-64 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/50">
                  <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">Super Admin</p>
                    <p className="text-xs text-zinc-500">admin@digitalmedical.com</p>
                  </div>
                </div>
              <div className="p-2">
                <a href="/admin/settings" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                  Profile Settings
                </a>
                <a href="/admin/settings" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                  Account Preferences
                </a>
              </div>
              <div className="p-2 border-t border-zinc-800">
                <button 
                  onClick={() => {
                    try {
                      localStorage.removeItem("dm_admin_session");
                    } catch (e) {
                      console.error(e);
                    }
                    router.push("/");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}



