"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Download,
  X,
  Play,
  Check,
} from "lucide-react";
import { DashboardLabOrder, DashboardPatient } from "../../types";

interface LaboratoryModuleProps {
  labOrders: DashboardLabOrder[];
  patients: DashboardPatient[];
  onUpdateSampleStatus: (id: string, status: DashboardLabOrder["sampleStatus"]) => void;
  onUpdateResultStatus: (id: string, status: DashboardLabOrder["resultStatus"]) => void;
  onOrderLabTest: (order: DashboardLabOrder) => void;
}

export const LaboratoryModule: React.FC<LaboratoryModuleProps> = ({
  labOrders,
  patients,
  onUpdateSampleStatus,
  onUpdateResultStatus,
  onOrderLabTest,
}) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [testName, setTestName] = useState("Complete Blood Count (CBC)");
  const [category, setCategory] = useState<DashboardLabOrder["category"]>("Hematology");
  const [fee, setFee] = useState(950);

  const sampleNeededCount = labOrders.filter((o) => o.sampleStatus === "Sample Needed").length;
  const processingCount = labOrders.filter((o) => o.sampleStatus === "Processing").length;
  const verifiedCount = labOrders.filter((o) => o.resultStatus === "Verified").length;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
    if (!patient) return;

    const newOrder: DashboardLabOrder = {
      id: `lab-${Date.now()}`,
      orderNo: `LAB-24-0${Math.floor(890 + Math.random() * 100)}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorName: "Dr. Tariq Mahmood",
      testName,
      category,
      orderDate: "Today, Just now",
      sampleStatus: "Sample Needed",
      resultStatus: "Pending",
      fee,
      assignedTechnician: "Saad Farooq",
    };

    onOrderLabTest(newOrder);
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP LAB STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Total Orders
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {labOrders.length}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">
            Daily diagnostic load
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Specimen Needed
          </span>
          <div className="text-2xl font-black text-amber-500 mt-1">{sampleNeededCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
            Awaiting phlebotomy
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            In Processing
          </span>
          <div className="text-2xl font-black text-sky-500 mt-1">{processingCount}</div>
          <span className="text-[11px] text-sky-600 font-semibold mt-0.5 block">
            Inside analyzer
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Verified Reports
          </span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{verifiedCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Signed by pathologist
          </span>
        </div>
      </div>

      {/* 2. TOOLBAR */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Diagnostic Orders & Sample Workflow
          </h3>
          <p className="text-xs text-slate-500">
            Technician processing, result validation, and doctor delivery
          </p>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lab Order</span>
        </button>
      </div>

      {/* 3. ORDERS TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Test Name & Category</th>
                <th className="py-3 px-3">Referring Doctor</th>
                <th className="py-3 px-3">Fee</th>
                <th className="py-3 px-3">Sample Status</th>
                <th className="py-3 px-3">Result Status</th>
                <th className="py-3 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {labOrders.map((ord) => (
                <tr
                  key={ord.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {ord.orderNo}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {ord.patientName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{ord.orderDate}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-800 dark:text-slate-200 font-bold block">
                      {ord.testName}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-semibold">
                      {ord.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {ord.doctorName}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    PKR {ord.fee}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.sampleStatus === "Sample Needed"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                          : ord.sampleStatus === "Processing"
                          ? "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                      }`}
                    >
                      {ord.sampleStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.resultStatus === "Verified"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {ord.resultStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ord.sampleStatus === "Sample Needed" && (
                        <button
                          onClick={() => onUpdateSampleStatus(ord.id, "Collected")}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"
                        >
                          Collect Sample
                        </button>
                      )}
                      {ord.sampleStatus === "Collected" && (
                        <button
                          onClick={() => onUpdateSampleStatus(ord.id, "Processing")}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 cursor-pointer"
                        >
                          Run Test
                        </button>
                      )}
                      {ord.sampleStatus === "Processing" && ord.resultStatus !== "Verified" && (
                        <button
                          onClick={() => onUpdateResultStatus(ord.id, "Verified")}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                        >
                          Verify & Sign
                        </button>
                      )}
                      {ord.resultStatus === "Verified" && (
                        <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. NEW LAB ORDER MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Create Diagnostic Lab Order
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Patient *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Investigation Test *
                </label>
                <select
                  value={testName}
                  onChange={(e) => {
                    setTestName(e.target.value);
                    if (e.target.value.includes("CBC")) {
                      setCategory("Hematology");
                      setFee(950);
                    } else if (e.target.value.includes("HbA1c")) {
                      setCategory("Biochemistry");
                      setFee(1450);
                    } else if (e.target.value.includes("Lipid")) {
                      setCategory("Biochemistry");
                      setFee(1800);
                    } else {
                      setCategory("Pathology");
                      setFee(500);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Complete Blood Count (CBC) with ESR">
                    Complete Blood Count (CBC) with ESR
                  </option>
                  <option value="HbA1c & Fasting Blood Glucose">
                    HbA1c & Fasting Blood Glucose
                  </option>
                  <option value="Lipid Profile (Cholesterol, HDL, LDL)">
                    Lipid Profile (Cholesterol, HDL, LDL)
                  </option>
                  <option value="Routine Urine Examination (Urine R/E)">
                    Routine Urine Examination (Urine R/E)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    disabled
                    value={category}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Confirm Lab Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
