import React from "react";

export default function DoctorSettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true">
      <div className="space-y-2">
        <div className="h-7 w-60 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[100, 120, 110, 90].map((width, i) => (
          <div
            key={i}
            className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl"
            style={{ width }}
          />
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
