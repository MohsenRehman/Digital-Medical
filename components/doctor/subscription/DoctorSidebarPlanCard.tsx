"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, AlertTriangle, XCircle, RotateCcw, ShieldCheck, Crown } from "lucide-react";
import { useDoctorSubscription } from "@/app/context/DoctorSubscriptionContext";

interface DoctorSidebarPlanCardProps {
  collapsed?: boolean;
  onShowTooltip?: (text: string, top: number, badge?: string | number) => void;
  onHideTooltip?: () => void;
}

export default function DoctorSidebarPlanCard({
  collapsed = false,
  onShowTooltip,
  onHideTooltip,
}: DoctorSidebarPlanCardProps) {
  const { isLoaded, isLoading, error, subscription, entitlement, refreshSubscription } = useDoctorSubscription();

  // Helper date formatter
  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  // ----------------------------------------------------
  // 1. COLLAPSED VIEW: Compact icon badge with tooltip
  // ----------------------------------------------------
  if (collapsed) {
    if (!isLoaded || isLoading) {
      return (
        <div className="w-10 h-10 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
      );
    }

    if (error || !subscription || !entitlement) {
      return (
        <button
          type="button"
          onClick={() => refreshSubscription()}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onShowTooltip?.("Plan unavailable — Click to retry", rect.top + rect.height / 2);
          }}
          onMouseLeave={onHideTooltip}
          className="w-10 h-10 mx-auto rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          aria-label="Retry loading subscription"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      );
    }

    // Determine tooltip text
    let tooltipText = "";
    let badgeText: string | undefined = undefined;
    if (subscription.status === "CANCELLED") {
      tooltipText = "Plan Cancelled — Bookings Blocked";
    } else if (subscription.status === "EXPIRED") {
      tooltipText = "Plan Expired — Choose a Plan";
    } else if (subscription.planId === "FREE") {
      const remaining = entitlement.bookingsRemaining ?? 0;
      tooltipText = `Free Plan — ${subscription.bookingsUsed}/50 bookings (${remaining} left)`;
      badgeText = `${subscription.bookingsUsed}/50`;
    } else {
      tooltipText = `${subscription.planName} — Unlimited bookings (Active)`;
      badgeText = "Unlimited";
    }

    const isLimitReached = subscription.planId === "FREE" && subscription.bookingsUsed >= 50;
    const isCancelledOrExpired = subscription.status === "CANCELLED" || subscription.status === "EXPIRED";

    return (
      <Link
        href="/doctor/subscription"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onShowTooltip?.(tooltipText, rect.top + rect.height / 2, badgeText);
        }}
        onMouseLeave={onHideTooltip}
        onFocus={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onShowTooltip?.(tooltipText, rect.top + rect.height / 2, badgeText);
        }}
        onBlur={onHideTooltip}
        aria-label={tooltipText}
        className={`relative w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all group outline-none focus:outline-none focus:ring-0 ${
          isCancelledOrExpired
            ? "bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400"
            : isLimitReached
            ? "bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400"
            : subscription.planId === "PREMIUM"
            ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/20"
            : subscription.planId === "PRO"
            ? "bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-sm shadow-sky-500/20"
            : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 hover:border-sky-400"
        }`}
      >
        {subscription.planId === "PREMIUM" ? (
          <Crown className="w-4 h-4" />
        ) : subscription.planId === "PRO" ? (
          <Sparkles className="w-4 h-4" />
        ) : isCancelledOrExpired ? (
          <XCircle className="w-4 h-4" />
        ) : isLimitReached ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <span className="font-extrabold text-xs">✦</span>
        )}

        {/* Small notification pip for limit or alert */}
        {(isLimitReached || isCancelledOrExpired) && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        )}
      </Link>
    );
  }

  // ----------------------------------------------------
  // 2. EXPANDED VIEW: Loading Skeleton
  // ----------------------------------------------------
  if (!isLoaded || isLoading) {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 animate-pulse space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-slate-300 dark:bg-slate-700 rounded-md" />
          <div className="h-4 w-12 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
        <div className="h-7 w-full bg-slate-300 dark:bg-slate-700 rounded-xl" />
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. EXPANDED VIEW: Error State with Retry
  // ----------------------------------------------------
  if (error || !subscription || !entitlement) {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Plan unavailable
          </span>
          <button
            type="button"
            onClick={() => refreshSubscription()}
            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Retry
          </button>
        </div>
        <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 leading-tight">
          Could not verify doctor plan status from server.
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. EXPANDED VIEW: State-Driven Cards
  // ----------------------------------------------------
  const status = subscription.status;
  const planId = subscription.planId;
  const isFree = planId === "FREE";
  const used = subscription.bookingsUsed;
  const limit = subscription.bookingLimit ?? 50;
  const remaining = entitlement.bookingsRemaining ?? Math.max(0, limit - used);
  const percentage = isFree ? Math.min(100, Math.round((used / limit) * 100)) : 100;
  const isNearLimit = isFree && status === "ACTIVE" && percentage >= 80 && used < limit;
  const isLimitReached = isFree && (used >= limit || entitlement.code === "BOOKING_LIMIT_REACHED");

  // STATE F: CANCELLED
  if (status === "CANCELLED") {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/5 dark:from-rose-950/40 dark:to-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Plan Cancelled</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
            Blocked
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
          Online bookings are currently unavailable.
        </p>
        <Link
          href="/doctor/subscription"
          className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all cursor-pointer"
        >
          <span>Choose Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // STATE G: EXPIRED
  if (status === "EXPIRED") {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Plan Expired</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
            Expired
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
          Choose a plan to receive new online bookings. Existing data is safe.
        </p>
        <Link
          href="/doctor/subscription"
          className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs shadow-amber-600/20 transition-all cursor-pointer"
        >
          <span>Choose Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // STATE D: PRO ACTIVE
  if (planId === "PRO") {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-sky-500/10 via-teal-500/5 to-white dark:to-slate-900 border border-sky-200/90 dark:border-sky-800/60 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-sky-700 dark:text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
            <span>✦ Pro Plan</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
            Active
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Online Bookings</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Unlimited
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {subscription.cancelAtPeriodEnd ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Ends {formatDate(subscription.currentPeriodEnd)}
              </span>
            ) : (
              <span>Active until {formatDate(subscription.currentPeriodEnd)}</span>
            )}
          </div>
        </div>

        <Link
          href="/doctor/subscription"
          className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <span>Manage Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    );
  }

  // STATE E: PREMIUM ACTIVE
  if (planId === "PREMIUM") {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-white dark:to-slate-900 border border-purple-200/90 dark:border-purple-800/60 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 dark:text-purple-300">
            <Crown className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            <span>✦ Premium Plan</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
            VIP
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Online Bookings</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Unlimited
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {subscription.cancelAtPeriodEnd ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Ends {formatDate(subscription.currentPeriodEnd)}
              </span>
            ) : (
              <span>Active until {formatDate(subscription.currentPeriodEnd)}</span>
            )}
          </div>
        </div>

        <Link
          href="/doctor/subscription"
          className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs shadow-purple-600/20 transition-all cursor-pointer"
        >
          <span>Manage Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // STATE C: FREE LIMIT REACHED (50/50)
  if (isLimitReached) {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-white dark:to-slate-900 border border-rose-300 dark:border-rose-800/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>✦ Free Plan</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
            50/50 Full
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            Booking limit reached
          </div>
          <p className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-tight">
            Upgrade to receive unlimited bookings. Existing records remain safe.
          </p>
          {/* 100% Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full w-full" />
          </div>
        </div>

        <Link
          href="/doctor/subscription"
          className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all cursor-pointer"
        >
          <span>Upgrade Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // STATE B: FREE NEAR LIMIT (>= 80% usage, e.g. 40/50 used, 10 remaining)
  if (isNearLimit) {
    return (
      <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-sky-500/5 to-white dark:to-slate-900 border border-amber-300/80 dark:border-amber-800/60 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
            <span className="text-amber-500">✦</span>
            <span>Free Plan</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
            {remaining} left
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Online Bookings</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {used} / {limit} used
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="text-[10.5px] font-medium text-amber-600 dark:text-amber-400">
            {remaining} booking{remaining === 1 ? "" : "s"} remaining
          </div>
        </div>

        <Link
          href="/doctor/subscription"
          className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs shadow-amber-600/20 transition-all cursor-pointer"
        >
          <span>Upgrade</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // STATE A: FREE UNDER LIMIT (e.g. 37/50 used, 13 remaining)
  return (
    <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-sky-500/10 via-slate-50 to-white dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
          <span className="text-sky-500">✦</span>
          <span>Free Plan</span>
        </div>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          Starter
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Online Bookings</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {used} / {limit} used
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-[10.5px] text-slate-500 dark:text-slate-400">
          {remaining} booking{remaining === 1 ? "" : "s"} remaining
        </div>
      </div>

      <Link
        href="/doctor/subscription"
        className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs shadow-sky-600/20 transition-all cursor-pointer"
      >
        <span>Upgrade</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
