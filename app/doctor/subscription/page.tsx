"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  AlertTriangle,
  XCircle,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  Crown,
  Zap,
  ArrowRight,
  RotateCcw,
  History,
  Info,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Building2,
  Layers,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { useDoctorSubscription } from "@/app/context/DoctorSubscriptionContext";
import { SubscriptionPlanId, BillingCycle } from "@/lib/doctor/subscription/types";

export default function DoctorSubscriptionPage() {
  const {
    isLoaded,
    isLoading,
    error,
    subscription,
    entitlement,
    plans,
    comparison,
    auditLogs,
    refreshSubscription,
    changePlan,
    cancelSubscription,
    reactivateSubscription,
  } = useDoctorSubscription();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [isChangingPlan, setIsChangingPlan] = useState<SubscriptionPlanId | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelImmediate, setCancelImmediate] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Acceptance Test Simulator State
  const [simulatingTest, setSimulatingTest] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ name: string; success: boolean; message: string } | null>(null);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return isoString;
    }
  };

  const handlePlanSelect = async (targetPlanId: SubscriptionPlanId) => {
    if (subscription?.planId === targetPlanId && subscription?.status === "ACTIVE") return;
    setIsChangingPlan(targetPlanId);
    setActionSuccessMessage(null);
    setActionErrorMessage(null);

    const res = await changePlan(targetPlanId, billingCycle);
    setIsChangingPlan(null);

    if (res.success) {
      setActionSuccessMessage(`Successfully switched plan to ${targetPlanId}!`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionErrorMessage(res.error || "Failed to switch plan.");
    }
  };

  const handleConfirmCancel = async () => {
    setActionSuccessMessage(null);
    setActionErrorMessage(null);
    const res = await cancelSubscription(cancelImmediate, cancelReason);
    setCancelModalOpen(false);
    if (res.success) {
      setActionSuccessMessage(
        cancelImmediate
          ? "Subscription cancelled immediately. New public online bookings are now blocked."
          : `Subscription will end on ${formatDate(subscription?.currentPeriodEnd)}. Public bookings remain active until period end.`
      );
      setTimeout(() => setActionSuccessMessage(null), 6000);
    } else {
      setActionErrorMessage(res.error || "Failed to cancel subscription.");
    }
  };

  const handleReactivate = async () => {
    setActionSuccessMessage(null);
    setActionErrorMessage(null);
    const res = await reactivateSubscription();
    if (res.success) {
      setActionSuccessMessage("Subscription reactivated! Continuous auto-renewal restored.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionErrorMessage(res.error || "Failed to reactivate subscription.");
    }
  };

  // Run a quick deterministic test scenario
  const runTestScenario = async (scenario: string) => {
    setSimulatingTest(scenario);
    setTestResult(null);

    try {
      let statePatch: Record<string, unknown> = {};
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
      const pastEnd = new Date(now.getTime() - 86400000).toISOString(); // yesterday

      if (scenario === "free_0_50") {
        statePatch = {
          planId: "FREE",
          planName: "Free Plan",
          status: "ACTIVE",
          bookingLimit: 50,
          bookingsUsed: 0,
          cancelAtPeriodEnd: false,
          currentPeriodStart: monthStart,
          currentPeriodEnd: monthEnd,
        };
      } else if (scenario === "free_49_50") {
        statePatch = {
          planId: "FREE",
          planName: "Free Plan",
          status: "ACTIVE",
          bookingLimit: 50,
          bookingsUsed: 49,
          cancelAtPeriodEnd: false,
          currentPeriodStart: monthStart,
          currentPeriodEnd: monthEnd,
        };
      } else if (scenario === "free_50_50") {
        statePatch = {
          planId: "FREE",
          planName: "Free Plan",
          status: "ACTIVE",
          bookingLimit: 50,
          bookingsUsed: 50,
          cancelAtPeriodEnd: false,
          currentPeriodStart: monthStart,
          currentPeriodEnd: monthEnd,
        };
      } else if (scenario === "pro_active") {
        statePatch = {
          planId: "PRO",
          planName: "Pro Plan",
          status: "ACTIVE",
          bookingLimit: null,
          bookingsUsed: 120,
          cancelAtPeriodEnd: false,
          currentPeriodStart: monthStart,
          currentPeriodEnd: monthEnd,
        };
      } else if (scenario === "pro_cancel_period_end") {
        statePatch = {
          planId: "PRO",
          planName: "Pro Plan",
          status: "ACTIVE",
          bookingLimit: null,
          bookingsUsed: 88,
          cancelAtPeriodEnd: true,
          cancelledAt: now.toISOString(),
          currentPeriodStart: monthStart,
          currentPeriodEnd: monthEnd,
        };
      } else if (scenario === "pro_cancel_immediate") {
        statePatch = {
          planId: "PRO",
          planName: "Pro Plan",
          status: "CANCELLED",
          bookingLimit: null,
          bookingsUsed: 88,
          cancelAtPeriodEnd: false,
          cancelledAt: now.toISOString(),
          currentPeriodStart: monthStart,
          currentPeriodEnd: monthEnd,
        };
      } else if (scenario === "expired_plan") {
        statePatch = {
          planId: "PRO",
          planName: "Pro Plan",
          status: "EXPIRED",
          bookingLimit: null,
          bookingsUsed: 65,
          cancelAtPeriodEnd: true,
          expiredAt: pastEnd,
          currentPeriodStart: monthStart,
          currentPeriodEnd: pastEnd,
        };
      }

      const res = await fetch("/api/doctor/subscription/test-fixtures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: subscription?.doctorId || "doc-tariq-01",
          state: statePatch,
        }),
      });

      const data = await res.json();
      await refreshSubscription();

      setTestResult({
        name: scenario,
        success: data.success,
        message: data.entitlement?.canReceiveBookings
          ? `Booking ALLOWED (${data.entitlement.message})`
          : `Booking BLOCKED (${data.entitlement.code}: ${data.entitlement.message})`,
      });
    } catch (err) {
      setTestResult({
        name: scenario,
        success: false,
        message: String(err),
      });
    } finally {
      setSimulatingTest(null);
    }
  };

  if (!isLoaded && isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse p-4">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  const isFree = subscription?.planId === "FREE";
  const isPro = subscription?.planId === "PRO";
  const isPremium = subscription?.planId === "PREMIUM";
  const isCancelled = subscription?.status === "CANCELLED";
  const isExpired = subscription?.status === "EXPIRED";
  const isAtLimit = isFree && (subscription?.bookingsUsed ?? 0) >= 50;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Independent Practice
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                  subscription?.status === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : subscription?.status === "CANCELLED"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-400/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                }`}
              >
                Status: {subscription?.status || "ACTIVE"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Doctor Subscription & Practice Entitlements
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your subscription controls public patient online booking entitlements across Digital Medical.
              Clinical charts, prescriptions, and historical medical records permanently belong to you and remain
              accessible even if a plan expires.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshSubscription()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
            <Link
              href="/doctor"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Notifications / Feedback Toasts */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {actionErrorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{actionErrorMessage}</span>
          </div>
          <button onClick={() => setActionErrorMessage(null)} className="text-rose-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Current Entitlement Status Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Entitlement Dashboard */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">
                Current Active Subscription
              </span>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {subscription?.planName || "Free Plan"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {subscription?.billingCycle || "MONTHLY"}
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div className="text-right">
              {entitlement?.canReceiveBookings ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Public Bookings Active</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold text-xs">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Bookings Blocked</span>
                </div>
              )}
            </div>
          </div>

          {/* Quota Progress Bar for Free Plan */}
          {isFree ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-sky-500" />
                  Public Online Booking Quota
                </span>
                <span className="font-mono text-sm text-slate-900 dark:text-white font-extrabold">
                  {subscription?.bookingsUsed ?? 0} / 50 used
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAtLimit
                      ? "bg-rose-500"
                      : (subscription?.bookingsUsed ?? 0) >= 40
                      ? "bg-amber-500"
                      : "bg-sky-500"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.round(((subscription?.bookingsUsed ?? 0) / 50) * 100))}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  {isAtLimit ? (
                    <strong className="text-rose-600 dark:text-rose-400">
                      0 bookings remaining. Public online booking is currently BLOCKED.
                    </strong>
                  ) : (
                    <span>
                      {50 - (subscription?.bookingsUsed ?? 0)} bookings remaining this billing period
                    </span>
                  )}
                </span>
                <span>Limit resets on: {formatDate(subscription?.currentPeriodEnd)}</span>
              </div>
            </div>
          ) : (
            // Unlimited state for Pro and Premium
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Unlimited Online Bookings Active</span>
                </div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  Total online bookings received this period: <strong>{subscription?.bookingsUsed ?? 0}</strong>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                Uncapped
              </span>
            </div>
          )}

          {/* Period Details & Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Billing Cycle</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {subscription?.billingCycle}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Period Start</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(subscription?.currentPeriodStart)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {subscription?.cancelAtPeriodEnd ? "Scheduled Expiry" : "Renewal Date"}
              </span>
              <span
                className={`font-semibold ${
                  subscription?.cancelAtPeriodEnd
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-800 dark:text-slate-200"
                }`}
              >
                {formatDate(subscription?.currentPeriodEnd)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Auto-Renew</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {subscription?.cancelAtPeriodEnd ? "Disabled" : isFree ? "Monthly Auto-Reset" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Actions & Policy Safety Guarantee */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>Doctor Data Guarantee</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In accordance with Digital Medical clinical governance, plan expiration or cancellation
              <strong> never locks or deletes your medical data</strong>.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Existing patients & history remain accessible</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>All completed consultations & EMR records safe</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Reception walk-ins & manual visits unaffected</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {subscription?.cancelAtPeriodEnd ? (
              <button
                type="button"
                onClick={handleReactivate}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reactivate Subscription</span>
              </button>
            ) : subscription?.planId !== "FREE" ? (
              <button
                type="button"
                onClick={() => {
                  setCancelImmediate(false);
                  setCancelModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Cancel Subscription</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 3. Available Plans & Pricing Table */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Choose or Upgrade Your Practice Tier
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate entitlement activation upon plan selection.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setBillingCycle("MONTHLY")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                billingCycle === "MONTHLY"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("ANNUAL")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "ANNUAL"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* FREE PLAN */}
          <div
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between transition-all ${
              isFree && subscription?.status === "ACTIVE"
                ? "border-sky-500 shadow-md ring-2 ring-sky-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wider uppercase text-slate-400">
                  Starter Solo
                </span>
                {isFree && subscription?.status === "ACTIVE" && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                    Current Plan
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Free Plan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Essential solo doctor workspace with 50 monthly public bookings.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">Rs. 0</span>
                <span className="text-xs text-slate-400"> / forever</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>50 Online bookings</strong> / billing period
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>1 Doctor & 1 Clinic Location</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Clinical EMR & Digital Prescriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Permanent access to historical records</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                disabled={isFree && subscription?.status === "ACTIVE"}
                onClick={() => handlePlanSelect("FREE")}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isFree && subscription?.status === "ACTIVE"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                    : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                }`}
              >
                {isFree && subscription?.status === "ACTIVE" ? "Current Tier" : "Downgrade to Free"}
              </button>
            </div>
          </div>

          {/* PRO PLAN (RECOMMENDED) */}
          <div
            className={`p-6 rounded-3xl bg-gradient-to-b from-sky-50/50 via-white to-white dark:from-sky-950/20 dark:via-slate-900 dark:to-slate-900 border flex flex-col justify-between relative shadow-lg ${
              isPro && subscription?.status === "ACTIVE"
                ? "border-sky-500 ring-2 ring-sky-500/20 shadow-sky-500/10"
                : "border-sky-300 dark:border-sky-800"
            }`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-teal-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wider uppercase text-sky-600 dark:text-sky-400">
                  High Volume
                </span>
                {isPro && subscription?.status === "ACTIVE" && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                    Current Plan
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Pro Plan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Unlimited patient bookings with boosted public directory placement.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  Rs. {billingCycle === "ANNUAL" ? "2,499" : "2,999"}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
                {billingCycle === "ANNUAL" && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Billed annually (Rs. 29,990/yr)
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5 font-bold" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Unlimited Online Patient Bookings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Priority Public Directory Placement</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Custom Schedule & Buffer Automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>WhatsApp & SMS Patient Reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Priority Clinical Support (4-hr SLA)</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                disabled={isChangingPlan === "PRO" || (isPro && subscription?.status === "ACTIVE")}
                onClick={() => handlePlanSelect("PRO")}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isPro && subscription?.status === "ACTIVE"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                    : "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25"
                }`}
              >
                {isChangingPlan === "PRO"
                  ? "Processing..."
                  : isPro && subscription?.status === "ACTIVE"
                  ? "Current Tier"
                  : "Upgrade to Pro"}
              </button>
            </div>
          </div>

          {/* PREMIUM PLAN */}
          <div
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between transition-all ${
              isPremium && subscription?.status === "ACTIVE"
                ? "border-purple-500 shadow-md ring-2 ring-purple-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wider uppercase text-purple-600 dark:text-purple-400">
                  Consultant Suite
                </span>
                {isPremium && subscription?.status === "ACTIVE" && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                    Current Plan
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Premium Plan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Multi-clinic consultant practice with VIP account management.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  Rs. {billingCycle === "ANNUAL" ? "5,830" : "6,999"}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
                {billingCycle === "ANNUAL" && (
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Billed annually (Rs. 69,990/yr)
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5 font-bold" />
                  <span className="font-semibold text-purple-700 dark:text-purple-400">
                    Unlimited Online Patient Bookings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Up to 5 Hospital & Clinic Affiliations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Lab & Diagnostic Investigation Dispatch</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Dedicated Medical Account Manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>24/7 Dedicated Emergency Tech Support</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                disabled={isChangingPlan === "PREMIUM" || (isPremium && subscription?.status === "ACTIVE")}
                onClick={() => handlePlanSelect("PREMIUM")}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isPremium && subscription?.status === "ACTIVE"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25"
                }`}
              >
                {isChangingPlan === "PREMIUM"
                  ? "Processing..."
                  : isPremium && subscription?.status === "ACTIVE"
                  ? "Current Tier"
                  : "Upgrade to Premium"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Plan Comparison Matrix */}
      {comparison && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Comprehensive Tier Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Free Plan</th>
                  <th className="py-3 px-4 text-sky-600 dark:text-sky-400 font-bold">Pro Plan</th>
                  <th className="py-3 px-4 text-purple-600 dark:text-purple-400 font-bold">Premium Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {comparison.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {typeof item.free === "boolean" ? (
                        item.free ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-slate-400">—</span>
                      ) : (
                        item.free
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                      {typeof item.pro === "boolean" ? (
                        item.pro ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-slate-400">—</span>
                      ) : (
                        item.pro
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                      {typeof item.premium === "boolean" ? (
                        item.premium ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-slate-400">—</span>
                      ) : (
                        item.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Interactive Acceptance Test Matrix Simulator */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 block">
              QA Acceptance Testing Console
            </span>
            <h3 className="text-lg font-black text-white">
              Deterministic Subscription & Entitlement Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              Instantly toggle doctor subscription state to verify any acceptance condition across the sidebar, dashboard, and public booking API.
            </p>
          </div>
        </div>

        {/* Test scenario buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <button
            onClick={() => runTestScenario("free_0_50")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-sky-400">1. Free (0/50)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Booking allowed</div>
          </button>

          <button
            onClick={() => runTestScenario("free_49_50")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-amber-400">2. Free (49/50)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">1 slot remaining</div>
          </button>

          <button
            onClick={() => runTestScenario("free_50_50")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-rose-400">3. Free (50/50 Limit)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Public booking blocked</div>
          </button>

          <button
            onClick={() => runTestScenario("pro_active")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-emerald-400">4. Pro (Unlimited)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Booking allowed</div>
          </button>

          <button
            onClick={() => runTestScenario("pro_cancel_period_end")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-amber-300">5. Pro Period-End Cancel</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active until period end</div>
          </button>

          <button
            onClick={() => runTestScenario("pro_cancel_immediate")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-rose-300">6. Immediate Cancel</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Immediately blocked</div>
          </button>

          <button
            onClick={() => runTestScenario("expired_plan")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-red-400">7. Expired Plan</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Data safe, booking blocked</div>
          </button>

          <button
            onClick={() => runTestScenario("free_0_50")}
            disabled={simulatingTest !== null}
            className="p-2.5 rounded-xl bg-sky-900/60 hover:bg-sky-800/80 border border-sky-700 text-left text-xs transition-colors cursor-pointer"
          >
            <div className="font-bold text-sky-300">8. Period Rollover</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Auto-reset to 0/50</div>
          </button>
        </div>

        {testResult && (
          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs flex items-center justify-between">
            <span className="font-semibold text-sky-300">
              Test Scenario Executed: <strong className="text-white">{testResult.name}</strong>
            </span>
            <span className="font-mono text-emerald-400">{testResult.message}</span>
          </div>
        )}
      </div>

      {/* 6. Subscription Audit Log Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Subscription & Entitlement Audit Trail
            </h3>
          </div>
          <span className="text-xs text-slate-400">Permanent Compliance History</span>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-500">No audit records logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {log.eventType}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                      actor: {log.actorRole}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {log.description}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Cancel Doctor Subscription
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your clinical EMR data, patient charts, and prescriptions are permanent and will remain
              completely accessible. Only new public online patient bookings will be affected.
            </p>

            <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                <input
                  type="radio"
                  name="cancelType"
                  checked={!cancelImmediate}
                  onChange={() => setCancelImmediate(false)}
                />
                <span>Cancel at end of current period ({formatDate(subscription?.currentPeriodEnd)})</span>
              </label>
              <p className="pl-5 text-[11px] text-slate-500 dark:text-slate-400">
                Recommended: Keep receiving online patient bookings until the paid term ends.
              </p>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200 pt-2 border-t border-slate-200 dark:border-slate-700">
                <input
                  type="radio"
                  name="cancelType"
                  checked={cancelImmediate}
                  onChange={() => setCancelImmediate(true)}
                />
                <span>Cancel immediately</span>
              </label>
              <p className="pl-5 text-[11px] text-rose-600 dark:text-rose-400">
                New public bookings will be blocked right now.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Reason (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Taking leave, Switching clinics..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 cursor-pointer"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
