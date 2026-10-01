"use client";

import React from "react";

export function AnalysisSkeleton() {
  return (
    <div
      aria-label="Loading clinical analysis"
      className="space-y-5 animate-pulse"
      role="status"
    >
      {/* Two Column Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        {/* Left: Patient Activity Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            </div>
            <div className="h-8 w-40 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-60 w-full bg-slate-100/70 dark:bg-slate-800/40 rounded-xl mt-4" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>

        {/* Right: Appointment Performance Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-56 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            </div>
            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full my-2" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-3 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-10 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl" />
            <div className="h-10 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl" />
            <div className="h-10 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Quick Insights Strip Skeleton */}
      <div className="space-y-2">
        <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2"
            >
              <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading analysis data...</span>
    </div>
  );
}
