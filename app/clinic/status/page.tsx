"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  PhoneCall,
  Mail,
} from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";

export default function ClinicStatusPage() {
  const router = useRouter();
  const { application, simulateAdminApproval, simulateAdminReset, isLoaded } = useClinicAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Fallback if accessed directly without submitting
  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-500 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">No Application Found</h1>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          You haven't submitted a clinic registration yet. Register your clinic now to join our network.
        </p>
        <Link
          href="/clinic/register"
          className="px-6 py-3 rounded-full bg-sky-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-500 transition-all shadow-md"
        >
          Start Clinic Registration
        </Link>
      </div>
    );
  }

  const isApproved = application.status === "approved";

  const handleSimulateApprove = () => {
    simulateAdminApproval();
    router.push("/clinic/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100 dark:from-slate-950 dark:via-[#0c1424] dark:to-black text-slate-900 dark:text-white selection:bg-sky-500 selection:text-white py-8 px-3.5 sm:px-6">
      {/* Top Header */}
      <header className="max-w-3xl mx-auto flex items-center justify-between gap-4 mb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Digital<span className="text-sky-600 dark:text-sky-400">Medical</span>
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
              Application Status
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          Return to Homepage
        </Link>
      </header>

      {/* Main Status Container */}
      <main className="max-w-3xl mx-auto space-y-6">
        {/* Status Hero Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-sky-950/10 dark:shadow-cyan-950/20 text-center relative overflow-hidden">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
               style={{
                 backgroundColor: isApproved ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                 color: isApproved ? "#10b981" : "#f59e0b",
                 border: isApproved ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
               }}>
            {isApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Application Approved & Account Active</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
                <span>Under Admin Verification</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isApproved
              ? "Welcome to Digital Medical Network!"
              : "Application Submitted Successfully"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
            {isApproved
              ? "Your payment proof has been verified and your clinic dashboard is fully unlocked."
              : "Admin will verify the payment and the clinic will access the dashboard."}
          </p>

          {/* Reference ID Pill */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <span>Reference No:</span>
            <span className="text-sky-600 dark:text-sky-400 font-extrabold">{application.referenceNo}</span>
          </div>

          {/* Primary Action Button */}
          <div className="mt-6 pt-4">
            {isApproved ? (
              <Link
                href="/clinic/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>Open Clinic Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 max-w-md mx-auto text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold block mb-1">⏳ Verification Timeline:</span>
                Admin verification typically takes <strong>2 to 4 business hours</strong>. You will receive an automated confirmation email once activated.
              </div>
            )}
          </div>
        </div>

        {/* Demo Admin Verification Controller Banner (For Testing Only) */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-purple-500/10 via-sky-500/10 to-teal-500/10 border-2 border-dashed border-purple-300 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                Testing Sandbox Controller
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Instantly simulate Admin verifying the payment slip to test the dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isApproved ? (
              <button
                type="button"
                onClick={simulateAdminReset}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Reset to Pending
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSimulateApprove}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                Simulate Admin Approval
              </button>
            )}
          </div>
        </div>

        {/* Application Details Summary Card */}
        <div className="rounded-3xl p-6 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" />
            <span>Submitted Clinic Summary</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clinic Name</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {application.clinicName}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Doctor / Owner</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {application.ownerFullName}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Contact Info</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
                {application.mobileNumber}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
                {application.email}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Location & Speciality</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {application.speciality} • {application.city}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
                {application.physicalAddress}
              </span>
            </div>
          </div>

          {/* Payment Proof Card */}
          <div className="mt-4 p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wider block">
                Payment Proof Submitted
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                TID: {application.paymentProof.transactionId}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                Paid via {application.paymentProof.bankName} on {application.paymentProof.paymentDate}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {application.paymentProof.paymentReceiptPreview && (
                <img
                  src={application.paymentProof.paymentReceiptPreview}
                  alt="Receipt Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
              )}
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Amount</span>
                <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                  Rs. {application.totalMonthlyAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 space-y-1">
          <p>Need urgent activation or assistance?</p>
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            Helpline: <strong>+92 (042) 111-344-482</strong> • Email: <strong>support@digitalmedical.pk</strong>
          </p>
        </div>
      </main>
    </div>
  );
}
