import React from "react";

export default function DoctorAvailabilityLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true">
      <div className="space-y-2">
        <div className="h-7 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="h-5 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-9 w-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
