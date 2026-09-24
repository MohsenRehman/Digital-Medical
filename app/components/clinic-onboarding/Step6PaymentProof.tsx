"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Copy,
  Check,
  UploadCloud,
  FileText,
  X,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Info,
  Calendar,
} from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";
import { PaymentProof } from "@/lib/types/clinic";

interface Step6PaymentProofProps {
  onBack: () => void;
}

export default function Step6PaymentProof({ onBack }: Step6PaymentProofProps) {
  const router = useRouter();
  const { draft, submitApplication, calculateTotalMonthly } = useClinicAuth();

  const [activeBankTab, setActiveBankTab] = useState<"meezan" | "raast">("meezan");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("2026-09-24");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string>("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = calculateTotalMonthly();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setReceiptName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      setError("Please provide your bank Transaction Reference ID (TID / Ref #).");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const proof: PaymentProof = {
      bankName: activeBankTab === "meezan" ? "Meezan Bank" : "Raast Instant Pay",
      accountTitle: "Digital Medical Technologies Pvt Ltd",
      transactionId: transactionId.trim(),
      paymentReceiptName: receiptName || "Bank_Transfer_Receipt.png",
      paymentReceiptPreview: receiptPreview || undefined,
      paymentDate,
      amountPaid: totalAmount,
    };

    setTimeout(() => {
      submitApplication(proof);
      setIsSubmitting(false);
      router.push("/clinic/status");
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Final Step: Account Verification
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verify Your Clinic Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Transfer subscription fees via online banking, then upload payment proof for swift admin activation.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </div>
      )}

      {/* Payable Amount Highlight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-sky-600/20">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-sky-100 font-bold block">
            Payable Amount
          </span>
          <div className="text-2xl sm:text-3xl font-black">
            Rs. {totalAmount.toLocaleString()} <span className="text-xs font-normal text-sky-100">PKR</span>
          </div>
        </div>
        <div className="text-xs text-sky-100 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
          Plan: <strong>{draft.selectedPlan.toUpperCase()}</strong>
          {draft.pharmacyAddon.isAdded && " + Pharmacy POS Suite"}
        </div>
      </div>

      {/* Part 1: Bank Transfer Options */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-500" />
            <span>Bank Transfer Options</span>
          </h3>

          {/* Bank selector tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveBankTab("meezan")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeBankTab === "meezan"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Meezan Bank
            </button>
            <button
              type="button"
              onClick={() => setActiveBankTab("raast")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeBankTab === "raast"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Raast Instant
            </button>
          </div>
        </div>

        {/* Bank Details Container */}
        {activeBankTab === "meezan" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Account Title
              </span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                Digital Medical Technologies Pvt Ltd
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Account Number
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">
                  0201-0104829103
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("02010104829103", "acc")}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                title="Copy Account Number"
              >
                {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 sm:col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  IBAN (International / Raast Transfer)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block text-[11px] sm:text-xs">
                  PK82 MEZN 0002 0101 0482 9103
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("PK82MEZN0002010104829103", "iban")}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                title="Copy IBAN"
              >
                {copiedField === "iban" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Raast Receiver Name
              </span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                Digital Medical Pvt
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Raast ID / Registered Mobile
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">
                  03001234567
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("03001234567", "raast")}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                title="Copy Raast ID"
              >
                {copiedField === "raast" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Upload Proof & Transaction ID */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-teal-500" />
          <span>Step 2: Upload Payment Proof</span>
        </h3>

        {/* Transaction ID */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Transaction ID / Bank Ref # <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              setError("");
            }}
            placeholder="e.g. TRX-9842104 or 12-digit Bank Ref"
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold tracking-wider font-mono bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            required
          />
        </div>

        {/* Date of Payment */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Payment Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* File Drag & Drop Zone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Attach Screenshot / Receipt Slip
          </label>

          {receiptPreview ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={receiptPreview}
                  alt="Receipt Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {receiptName || "Payment_Receipt.jpg"}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Ready for admin review
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReceiptPreview(null);
                  setReceiptName("");
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/40 relative group"
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drag & drop payment receipt
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                PNG, JPG or PDF up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Notice as per diagram */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Admin will verify the payment</strong> and the clinic will immediately receive an email notification and unlock access to the clinic dashboard.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 hover:from-emerald-500 hover:to-sky-500 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 cursor-pointer"
        >
          <span>{isSubmitting ? "Submitting Application..." : "Submit Proof & Verify Account"}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}
