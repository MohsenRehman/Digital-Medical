"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  RotateCcw,
  Search,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Eye,
  ArrowRight,
  User,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { FollowUpRecord } from "@/lib/types/doctor";

function DoctorFollowUpsContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const { followUps, markFollowUpCompleted, activeClinic } = useDoctor();

  const [filterTab, setFilterTab] = useState<"today" | "upcoming" | "overdue" | "all">(() => {
    if (filterParam && ["today", "upcoming", "overdue", "all"].includes(filterParam)) {
      return filterParam as "today" | "upcoming" | "overdue" | "all";
    }
    return "today";
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Sync filterTab if searchParams change
  useEffect(() => {
    if (filterParam && ["today", "upcoming", "overdue", "all"].includes(filterParam)) {
      setFilterTab(filterParam as "today" | "upcoming" | "overdue" | "all");
    }
  }, [filterParam]);

  const todayStr = "2026-09-24";

  const categorizedFollowUps = followUps.filter((f) => {
    if (filterTab === "today") return f.followUpDate === todayStr && f.status !== "completed";
    if (filterTab === "upcoming") return f.followUpDate > todayStr && f.status !== "completed";
    if (filterTab === "overdue") return f.status === "overdue" || (f.followUpDate < todayStr && f.status !== "completed");
    return true;
  });

  const filteredList = categorizedFollowUps.filter((f) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return f.patientName.toLowerCase().includes(q) || f.reason.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Follow-up Care & Reviews
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor patient progress, post-discharge checks, and chronic titration appointments at {activeClinic.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {followUps.filter((f) => f.followUpDate === todayStr && f.status !== "completed").length} Due Today
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            {
              id: "today",
              label: "Due Today",
              count: followUps.filter((f) => f.followUpDate === todayStr && f.status !== "completed").length,
              color: "text-rose-600",
            },
            {
              id: "upcoming",
              label: "Upcoming Reviews",
              count: followUps.filter((f) => f.followUpDate > todayStr && f.status !== "completed").length,
              color: "text-sky-600",
            },
            {
              id: "overdue",
              label: "Overdue",
              count: followUps.filter((f) => f.status === "overdue" || (f.followUpDate < todayStr && f.status !== "completed")).length,
              color: "text-amber-600",
            },
            {
              id: "all",
              label: "All Records",
              count: followUps.length,
              color: "text-slate-700 dark:text-slate-300",
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              filterTab === tab.id
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-xs"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{tab.label}</span>
            <span className={`text-2xl font-black ${tab.color}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search follow-up by patient name or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Previous Visit</th>
                <th className="py-3.5 px-4">Follow-up Date</th>
                <th className="py-3.5 px-4">Clinical Indication</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No follow-ups due under this category.
                  </td>
                </tr>
              ) : (
                filteredList.map((fup) => (
                  <tr key={fup.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/doctor/patients/${fup.patientProfileId}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-sky-600 block text-xs"
                      >
                        {fup.patientName}
                      </Link>
                      <span className="text-[11px] text-slate-500">
                        {fup.age} yrs • {fup.gender} • {fup.phone}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {fup.previousVisitDate}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {fup.followUpDate}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-sm truncate">
                      {fup.reason}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {fup.status === "completed" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      ) : fup.status === "overdue" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {fup.status !== "completed" && (
                          <button
                            onClick={() => markFollowUpCompleted(fup.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                          >
                            Mark Completed
                          </button>
                        )}
                        <Link
                          href={`/doctor/patients/${fup.patientProfileId}`}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Patient</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DoctorFollowUpsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading follow-ups...</div>}>
      <DoctorFollowUpsContent />
    </Suspense>
  );
}

