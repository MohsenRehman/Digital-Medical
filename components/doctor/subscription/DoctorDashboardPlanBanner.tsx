"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck, XCircle } from "lucide-react";
import { useDoctorSubscription } from "@/app/context/DoctorSubscriptionContext";

export default function DoctorDashboardPlanBanner() {
  const { isLoaded, subscription, entitlement } = useDoctorSubscription();

  if (!isLoaded || !subscription || !entitlement) return null;

  const isFree = subscription.planId === "FREE";
  const used = subscription.bookingsUsed;
  const limit = subscription.bookingLimit ?? 50;
  const remaining = entitlement.bookingsRemaining ?? Math.max(0, limit - used);
  const isLimitReached = isFree && (used >= limit || entitlement.code === "BOOKING_LIMIT_REACHED");
  const isCancelled = subscription.status === "CANCELLED";
  const isExpired = subscription.status === "EXPIRED";

  // If Limit Reached
  if (isLimitReached) {
    return (
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/5 dark:from-rose-950/40 dark:to-slate-900 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <span>
            <strong>Monthly online booking limit reached:</strong> 50 of 50 online bookings used.
            New patient bookings are paused. Existing records remain safe.
          </span>
        </div>
        <Link
          href="/doctor/subscription"
          className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-300 hover:underline ml-3 flex-shrink-0"
        >
          <span>Upgrade to Pro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // If Cancelled
  if (isCancelled) {
    return (
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <span>
            <strong>Plan Cancelled:</strong> Public online bookings are unavailable. Your clinical records remain safe.
          </span>
        </div>
        <Link
          href="/doctor/subscription"
          className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-300 hover:underline ml-3 flex-shrink-0"
        >
          <span>Choose Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // If Expired
  if (isExpired) {
    return (
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>
            <strong>Plan Expired:</strong> Choose a plan to resume public online patient bookings.
          </span>
        </div>
        <Link
          href="/doctor/subscription"
          className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300 hover:underline ml-3 flex-shrink-0"
        >
          <span>Choose Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Do not render banner during normal status
  return null;
}
