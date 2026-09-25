"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, User } from "lucide-react";
import { useSearch } from "./SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function DashboardHeader() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-20 bg-white dark:bg-gray-800 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 dark:border-gray-700 flex items-center justify-between px-6 shrink-0 z-10 relative transition-colors duration-200">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search clinics, doctors, patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4f6] dark:bg-gray-700 dark:text-white border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] transition-shadow"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
            3
          </span>
        </button>
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        )}

        <div className="relative">
          <div 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <User size={20} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-700">Admin</p>
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
                className="absolute right-0 mt-4 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-800">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800 dark:text-gray-100">Super Admin</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@digitalmedical.com</p>
                  </div>
                </div>
              <div className="p-2">
                <a href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors">
                  Profile Settings
                </a>
                <a href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors">
                  Account Preferences
                </a>
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
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



