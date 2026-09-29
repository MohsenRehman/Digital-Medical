"use client";

import React, { useState } from "react";
import {
  Activity,
  FileText,
  FlaskConical,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Stethoscope,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  DashboardDoctor,
  DashboardAppointment,
  DashboardLabOrder,
} from "../../types";

interface ClinicalModuleProps {
  doctors: DashboardDoctor[];
  appointments: DashboardAppointment[];
  labOrders: DashboardLabOrder[];
}

export const ClinicalModule: React.FC<ClinicalModuleProps> = ({
  doctors,
  appointments,
  labOrders,
}) => {
  const [activeTab, setActiveTab] = useState<"consultations" | "prescriptions" | "investigations">("consultations");

  const todayCompleted = appointments.filter((a) => a.status === "completed");
  const inProgress = appointments.filter((a) => a.status === "in-consultation");

  return (
    <div className="space-y-6">
      {/* 1. SAFETY & COMPLIANCE BANNER */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 dark:from-sky-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-sky-200/80 dark:border-sky-900/50 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-extrabold text-slate-900 dark:text-white">
            Clinical Safety & Governance Notice
          </h4>
          <p className="text-slate-600 dark:text-slate-300 mt-0.5">
            Prescriptions, diagnoses, and medical dosages can only be created and signed by authorized licensed doctors inside their dedicated Doctor Desk. The Clinic Admin interface provides operational auditing, patient turnaround tracking, and prescription dispensing status.
          </p>
        </div>
      </div>

      {/* 2. CLINICAL WORKLOAD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Completed Consultations
          </span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {todayCompleted.length + 12}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            100% digital Rx archived
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            In Active Consultation
          </span>
          <div className="text-2xl font-black text-sky-500 mt-1">
            {inProgress.length > 0 ? inProgress.length : 1}
          </div>
          <span className="text-[11px] text-sky-600 font-semibold mt-0.5 block">
            Room 101 currently busy
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Lab Diagnostic Orders
          </span>
          <div className="text-2xl font-black text-indigo-500 mt-1">
            {labOrders.length}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">
            Ordered by consultants
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Avg. Consultation Time
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            14.2 min
          </div>
          <span className="text-[11px] text-slate-400 font-semibold mt-0.5 block">
            Optimal patient care
          </span>
        </div>
      </div>

      {/* 3. TABS CONTROLLER */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("consultations")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "consultations"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Doctor Consultation Workload</span>
        </button>

        <button
          onClick={() => setActiveTab("prescriptions")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "prescriptions"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Prescription Flow (Rx)</span>
        </button>

        <button
          onClick={() => setActiveTab("investigations")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "investigations"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Investigation Orders ({labOrders.length})</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      {activeTab === "consultations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {doc.name}
                  </h4>
                  <span className="text-xs text-sky-600 dark:text-sky-400">
                    {doc.specialization} • {doc.room}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {doc.shifts}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono block">
                    {doc.todayAppointmentsCount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Scheduled</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-base font-black text-amber-500 font-mono block">
                    {doc.waitingCount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">In Queue</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-base font-black text-emerald-500 font-mono block">
                    {doc.completedTodayCount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "prescriptions" && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Recent Clinical Prescriptions Issued
            </h4>
            <span className="text-xs text-slate-500">Auto-synced with Pharmacy POS</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Muhammad Usman (MRN-24-00184)
                </span>
                <span className="text-[11px] text-slate-500">
                  By Dr. Tariq Mahmood • Losartan 50mg, Panadol Extra • Today 10:25 AM
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                Dispensed by Pharmacy
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Fatima Noor (MRN-24-00185)
                </span>
                <span className="text-[11px] text-slate-500">
                  By Dr. Ayesha Malik • Amoxil Syrup 125mg, Panadol Drops • Today 11:10 AM
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                Pending Dispensing
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "investigations" && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Active Laboratory Investigations
          </h4>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {labOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {ord.testName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Patient: {ord.patientName} • Ordered by {ord.doctorName} ({ord.orderDate})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {ord.sampleStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {ord.resultStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
