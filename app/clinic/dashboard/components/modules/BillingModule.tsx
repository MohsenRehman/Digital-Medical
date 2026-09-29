"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Receipt,
  Search,
  Plus,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Printer,
  FileText,
  Calculator,
  AlertTriangle,
  ArrowRight,
  X,
} from "lucide-react";
import { DashboardInvoice, DashboardPatient } from "../../types";

interface BillingModuleProps {
  invoices: DashboardInvoice[];
  patients: DashboardPatient[];
  onOpenCreateInvoice: () => void;
  onPayInvoice: (invoiceId: string) => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({
  invoices,
  patients,
  onOpenCreateInvoice,
  onPayInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<"invoices" | "reconciliation">("invoices");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<DashboardInvoice | null>(null);

  // Cash Counter Reconciliation State
  const [openingBalance, setOpeningBalance] = useState(5000);
  const [countedCash, setCountedCash] = useState(12500);
  const [expenses, setExpenses] = useState(500);
  const [closingNotes, setClosingNotes] = useState("");
  const [isReconciled, setIsReconciled] = useState(false);

  // Financial aggregates
  const totalCollections = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0);
  const cashCollected = invoices
    .filter((inv) => inv.paymentMethod === "Cash")
    .reduce((acc, inv) => acc + inv.paidAmount, 0);
  const digitalCollected = totalCollections - cashCollected;

  // Expected Cash in Drawer = Opening Balance + Cash Collections - Expenses
  const expectedClosingCash = openingBalance + cashCollected - expenses;
  const cashDifference = countedCash - expectedClosingCash;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesMethod = methodFilter === "all" || inv.paymentMethod === methodFilter;
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP FINANCIAL CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Today's Total Paid
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            <span className="text-sm font-bold text-slate-400 mr-1">PKR</span>
            {totalCollections.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> All counters combined
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Physical Cash In Drawer
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            <span className="text-sm font-bold text-slate-400 mr-1">PKR</span>
            {cashCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
            Cash register float
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Digital / POS / Raast
          </span>
          <div className="text-2xl font-black text-sky-600 mt-1">
            <span className="text-sm font-bold text-slate-400 mr-1">PKR</span>
            {digitalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-sky-600 font-semibold mt-0.5 block">
            Card & JazzCash QR
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Outstanding Balances
          </span>
          <div className="text-2xl font-black text-rose-500 mt-1">
            <span className="text-sm font-bold text-slate-400 mr-1">PKR</span>
            {totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-500 font-semibold mt-0.5 block">
            Awaiting settlement
          </span>
        </div>
      </div>

      {/* 2. SUBTABS: INVOICES VS END-OF-DAY CASH RECONCILIATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "invoices"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>All Invoices & Receipts</span>
        </button>

        <button
          onClick={() => setActiveTab("reconciliation")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "reconciliation"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>End-of-Day Cash Counter Closing</span>
        </button>
      </div>

      {/* 3. TAB 1: INVOICES TABLE */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[220px] flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search invoice #, patient, service..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="JazzCash/EasyPaisa">JazzCash / EasyPaisa</option>
                <option value="Online Bank Transfer">Online Transfer</option>
              </select>
            </div>

            <button
              onClick={onOpenCreateInvoice}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Billing Invoice</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                  <tr>
                    <th className="py-3 px-4">Invoice No</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Paid</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {inv.patientName}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {inv.service}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">{inv.date}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {inv.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        PKR {inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-600">
                        PKR {inv.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status !== "Paid" && (
                            <button
                              onClick={() => onPayInvoice(inv.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                            >
                              Collect Fee
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            title="Print receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: CASH COUNTER RECONCILIATION DESK */}
      {activeTab === "reconciliation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Daily Cash Drawer Closing & Settlement
              </h3>
              <p className="text-xs text-slate-500">
                Front desk cash reconciliation sheet for end of shift audit
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-500 block">Opening Cash Float</span>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-base"
                />
                <span className="text-[10px] text-slate-400">Cash in drawer at 08:00 AM</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-500 block">Today's Cash Inflows (Invoices)</span>
                <div className="text-base font-black text-emerald-600 font-mono py-1.5">
                  PKR {cashCollected.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400">System calculated from receipts</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-500 block">Clinic Petty Cash Expenses</span>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-base"
                />
                <span className="text-[10px] text-slate-400">Tea, postage, cleaning supplies</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-slate-500 block">Actual Physical Cash Counted</span>
                <input
                  type="number"
                  value={countedCash}
                  onChange={(e) => setCountedCash(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-base"
                />
                <span className="text-[10px] text-slate-400">Physically counted notes in hand</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs mb-1">
                Closing Auditor Notes
              </label>
              <textarea
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                placeholder="Enter shift handover notes or variance explanation..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white h-20"
              />
            </div>
          </div>

          {/* Reconciliation Summary Card */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4 text-xs">
              <h4 className="font-black text-base text-slate-900 dark:text-white">
                Closing Register Calculation
              </h4>

              <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Opening Balance:</span>
                  <span className="font-mono font-bold">PKR {openingBalance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cash Collections:</span>
                  <span className="font-mono font-bold text-emerald-600">+ PKR {cashCollected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expenses Deducted:</span>
                  <span className="font-mono font-bold text-rose-500">- PKR {expenses}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold">
                  <span>Expected Cash:</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    PKR {expectedClosingCash.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Actual Counted:</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    PKR {countedCash.toLocaleString()}
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-center justify-between font-bold ${
                  cashDifference === 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400"
                    : cashDifference > 0
                    ? "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950 dark:text-sky-400"
                    : "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-400"
                }`}
              >
                <span>Reconciliation Variance:</span>
                <span className="font-mono">
                  {cashDifference === 0
                    ? "Matched (0.00)"
                    : `${cashDifference > 0 ? "+" : ""}PKR ${cashDifference}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsReconciled(true)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isReconciled ? "Shift Closed & Reconciled" : "Submit Shift Closing Report"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. PRINT RECEIPT MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <h3 className="font-black text-sm uppercase">Digital Medical Clinic</h3>
              <p className="text-[10px] text-slate-500">Official Patient Receipt</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Invoice #:</span>
                <span className="font-bold">{selectedInvoice.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span>Patient:</span>
                <span className="font-bold">{selectedInvoice.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{selectedInvoice.service}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span>{selectedInvoice.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-dashed border-slate-300 font-bold text-sm">
                <span>Total Paid:</span>
                <span>PKR {selectedInvoice.paidAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 font-sans">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setSelectedInvoice(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
