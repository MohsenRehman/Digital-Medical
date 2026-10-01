import React from "react";
import { TableSkeleton } from "@/components/doctor/loading/DoctorSkeletons";

export default function FollowUpsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-80 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
