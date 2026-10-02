"use client";

import React from "react";

export function TableSkeleton({
  rows = 5,
  cols = 5,
  header = true,
}: {
  rows?: number;
  cols?: number;
  header?: boolean;
}) {
  return (
    <div
      role="status"
      aria-label="Loading table records"
      className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden animate-pulse"
    >
      {header && (
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-56 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
          <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      )}

      {/* Table Header Row Skeleton */}
      <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className={`h-3 bg-slate-200 dark:bg-slate-700 rounded ${
              i === 0 ? "w-28" : i === 1 ? "w-36" : "w-20"
            }`}
          />
        ))}
      </div>

      {/* Table Body Rows Skeleton */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="px-5 py-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded hidden sm:block" />
            <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded hidden md:block" />
            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading records...</span>
    </div>
  );
}

export function DoctorDashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading doctor dashboard"
      className="space-y-6 animate-pulse"
    >
      {/* 1. Identity Header Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-3.5 w-64 bg-slate-100 dark:bg-slate-800/60 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* 2. KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-8 w-20 bg-slate-300 dark:bg-slate-600 rounded" />
            <div className="h-2.5 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* 3. Analysis Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5" />
        <div className="h-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5" />
      </div>

      {/* 4. Appointments Table Skeleton */}
      <TableSkeleton rows={4} cols={5} />
      <span className="sr-only">Loading dashboard...</span>
    </div>
  );
}

export function QueueSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading live queue"
      className="space-y-6 animate-pulse"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 h-80" />
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 h-80" />
      </div>
      <span className="sr-only">Loading queue...</span>
    </div>
  );
}

export function AppointmentListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading appointments"
      className="space-y-5 animate-pulse"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-56 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
      <TableSkeleton rows={6} cols={6} />
      <span className="sr-only">Loading appointments...</span>
    </div>
  );
}

export function PatientListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading patients"
      className="space-y-5 animate-pulse"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-60 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
      <div className="h-10 w-full max-w-md bg-slate-100 dark:bg-slate-800 rounded-xl" />
      <TableSkeleton rows={6} cols={5} />
      <span className="sr-only">Loading patients...</span>
    </div>
  );
}

export function ConsultationSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading consultation"
      className="space-y-5 animate-pulse"
    >
      <div className="h-6 w-52 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5" />
          <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5" />
        </div>
        <div className="lg:col-span-4 h-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5" />
      </div>
      <span className="sr-only">Loading consultation...</span>
    </div>
  );
}

export function PrescriptionListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading prescriptions"
      className="space-y-5 animate-pulse"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
      </div>
      <TableSkeleton rows={5} cols={5} />
      <span className="sr-only">Loading prescriptions...</span>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading analytics"
      className="space-y-5 animate-pulse"
    >
      <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-28"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 h-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="lg:col-span-5 h-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
      <span className="sr-only">Loading analytics...</span>
    </div>
  );
}
