"use client";

import React from "react";

export function AnalysisSkeleton() {
  return (
    <div
      aria-label="Loading clinical analysis"
      className="space-y-5 animate-pulse"
      role="status"
    >
      {/* 2-Column Responsive Cards Skeleton: Patient Activity (Left) & Appointment Performance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-3.5">
        {/* Left: Patient Activity Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 md:p-4.5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            </div>
            <div className="h-7 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="h-48 w-full bg-slate-100/70 dark:bg-slate-800/40 rounded-xl" />
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>

        {/* Right: Appointment Performance Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 md:p-4.5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1.5">
              <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-56 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            </div>
            <div className="h-7 w-44 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full border-[18px] border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <div className="w-14 h-7 bg-slate-100 dark:bg-slate-800 rounded-md" />
              </div>
            </div>
            <div className="sm:col-span-7 sm:border-l sm:border-slate-100 sm:dark:border-slate-800/80 sm:pl-3 space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-6 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
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
