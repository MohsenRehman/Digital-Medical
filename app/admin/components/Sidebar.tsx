"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Receipt,
  LayoutGrid,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  User,
  HeartPulse,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSearch } from "./SearchContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSearch();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 dark:bg-emerald-500/10 text-white dark:text-emerald-500 p-2 rounded-xl">
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-zinc-50 font-semibold text-lg leading-tight tracking-wide">
              Digital Medical
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-1 -mr-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5 custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <NavItem
          href="/admin/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active={pathname === "/admin/dashboard"}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <NavItem
          href="/admin/clinics"
          icon={<Building2 size={18} />}
          label="Organizations"
          active={pathname.startsWith("/admin/clinics")}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <NavItem
          href="/admin/billing"
          icon={<Receipt size={18} />}
          label="Billing & Payments"
          active={pathname.startsWith("/admin/billing")}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <NavItem
          href="/admin/reports"
          icon={<BarChart3 size={18} />}
          label="Reports"
          active={pathname.startsWith("/admin/reports")}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <NavItem
          href="/admin/settings"
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname.startsWith("/admin/settings")}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-200 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-300">
              <User size={18} />
            </div>
            <div>
              <p className="text-slate-900 dark:text-zinc-50 text-sm font-medium">Admin</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Super Admin</p>
            </div>
          </div>
          <button className="text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white/40 dark:bg-[#09090b]/40 backdrop-blur-xl border-r border-white/40 dark:border-zinc-800/50 flex-col h-full hidden md:flex transition-all shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-2xl shadow-2xl z-50 flex flex-col md:hidden border-r border-white/50 dark:border-zinc-800"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
  onClick
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "group flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out",
        active
          ? "bg-[#0084d1] text-white dark:bg-zinc-800 dark:text-zinc-50"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
      )}
    >
      <div className={clsx("transition-transform duration-200", !active && "group-hover:scale-105", active && "dark:text-emerald-500 text-white")}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

function SubNavItem({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "block py-1.5 text-sm transition-colors",
        active ? "text-slate-900 font-medium dark:text-zinc-50" : "text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300"
      )}
    >
      {label}
    </Link>
  );
}
