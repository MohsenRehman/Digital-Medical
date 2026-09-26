"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { LabOrder, LabOrderStatus } from "@/lib/types/doctor";

export default function DoctorLabsPage() {
  const { labOrders, createLabOrder, activeClinic } = useDoctor();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);

  // New order state
  const [newTestName, setNewTestName] = useState("");
  const [newCategory, setNewCategory] = useState("Biochemistry");
  const [newPriority, setNewPriority] = useState<"routine" | "urgent" | "stat">("routine");
  const [newNotes, setNewNotes] = useState("");

  const statusPills: Record<
    LabOrderStatus,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string }
  > = {
    ordered: {
      label: "Pending Order",
      icon: Clock,
      bg: "bg-blue-50 dark:bg-blue-950/50",
      text: "text-blue-700 dark:text-blue-300",
    },
    sample_collected: {
      label: "Sample Collected",
      icon: FlaskConical,
      bg: "bg-amber-50 dark:bg-amber-950/50",
      text: "text-amber-700 dark:text-amber-300",
    },
    results_available: {
      label: "Results Ready",
      icon: AlertCircle,
      bg: "bg-purple-50 dark:bg-purple-950/50",
      text: "text-purple-700 dark:text-purple-300",
    },
    reviewed: {
      label: "Reviewed & Signed",
      icon: CheckCircle2,
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      text: "text-emerald-700 dark:text-emerald-300",
    },
  };

  const filteredOrders = labOrders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        order.testName.toLowerCase().includes(q) ||
        order.category.toLowerCase().includes(q) ||
        (order.resultSummary && order.resultSummary.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    createLabOrder({
      testName: newTestName.trim(),
      category: newCategory,
      priority: newPriority,
      notes: newNotes,
      status: "ordered",
    });
    setNewTestName("");
    setNewNotes("");
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Investigations & Laboratory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pathology tests, cardiac diagnostics, reference ranges, and abnormal biomarker flags at {activeClinic.name}.
          </p>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Order New Diagnostic Test</span>
        </button>
      </div>

      {/* Status Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            { id: "all", label: "All Tests", count: labOrders.length },
            { id: "ordered", label: "Pending Orders", count: labOrders.filter((l) => l.status === "ordered").length },
            { id: "results_available", label: "Results Ready", count: labOrders.filter((l) => l.status === "results_available").length },
            { id: "reviewed", label: "Reviewed & Signed", count: labOrders.filter((l) => l.status === "reviewed").length },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              statusFilter === tab.id
                ? "bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 shadow-xs"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{tab.label}</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search test name, category (e.g. Lipid, ECG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Lab Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No lab investigations found matching the selected filter.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = statusPills[order.status] || statusPills.ordered;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-teal-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {order.testName}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                          {order.category}
                        </span>
                        {order.abnormalFlag && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Abnormal Result</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ordered Date: {order.orderedAt} • Priority:{" "}
                        <strong className="uppercase text-slate-700 dark:text-slate-300">{order.priority}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{statusConfig.label}</span>
                  </span>
                </div>

                {/* Result Details / Reference Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Findings & Value Summary</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                      {order.resultSummary || "Specimen collected at laboratory desk. Analyzer run in queue."}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Reference Clinical Range</span>
                    <p className="font-mono text-slate-600 dark:text-slate-400 mt-0.5">
                      {order.referenceRange || "Standard clinical assay range"}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    Doctor Note: {order.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Order Test Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Order Diagnostic Investigation
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Investigation / Test Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24-Hour Ambulatory Blood Pressure Monitoring (ABPM)"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                    Department / Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Cardiology Diagnostics">Cardiology Diagnostics</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Endocrinology">Endocrinology</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "routine" | "urgent" | "stat")}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT Immediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Clinical Indication Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Reason for requesting investigation..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
