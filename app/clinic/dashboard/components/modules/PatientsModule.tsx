"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Eye,
  Phone,
  Calendar,
  Activity,
  Heart,
  FileText,
  CreditCard,
  X,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { DashboardPatient, DashboardAppointment, DashboardInvoice } from "../../types";

interface PatientsModuleProps {
  patients: DashboardPatient[];
  appointments: DashboardAppointment[];
  invoices: DashboardInvoice[];
  onOpenQuickRegister: () => void;
  onBookAppointmentForPatient: (patientId: string) => void;
}

export const PatientsModule: React.FC<PatientsModuleProps> = ({
  patients,
  appointments,
  invoices,
  onOpenQuickRegister,
  onBookAppointmentForPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<DashboardPatient | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<
    "overview" | "history" | "prescriptions" | "billing"
  >("overview");

  const filteredPatients = patients.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP TOOLBAR & QUICK STATS */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or MRN..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="follow-up">Follow-up Needed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">
            Total: {patients.length} Registered
          </span>
          <button
            onClick={onOpenQuickRegister}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Register</span>
          </button>
        </div>
      </div>

      {/* 2. PATIENTS DIRECTORY TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="py-3 px-4">MRN</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Phone & City</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Blood Group</th>
                <th className="py-3 px-3">Last Visit</th>
                <th className="py-3 px-3">Total Visits</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                      {patient.mrn}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {patient.name}
                      </span>
                      {patient.notes && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                          {patient.notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-800 dark:text-slate-200 font-mono block">
                        {patient.phone}
                      </span>
                      <span className="text-[10px] text-slate-400">{patient.city}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {patient.age} Y • {patient.gender}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                        {patient.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {patient.lastVisit}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white font-mono">
                      {patient.totalVisits}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          patient.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => onBookAppointmentForPatient(patient.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition-colors cursor-pointer"
                          title="Book new appointment"
                        >
                          + Appt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No patients found matching current query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. PATIENT PROFILE MODAL / DRAWER */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-black text-base flex items-center justify-center">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {selectedPatient.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 dark:bg-sky-950 text-sky-600">
                      {selectedPatient.mrn}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedPatient.phone} • {selectedPatient.gender}, {selectedPatient.age} yrs • Blood: {selectedPatient.bloodGroup}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Subtabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveProfileTab("overview")}
                className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
                  activeProfileTab === "overview"
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Vitals & Medical Summary
              </button>
              <button
                onClick={() => setActiveProfileTab("history")}
                className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
                  activeProfileTab === "history"
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Appointment Timeline
              </button>
              <button
                onClick={() => setActiveProfileTab("prescriptions")}
                className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
                  activeProfileTab === "prescriptions"
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Prescriptions & Rx
              </button>
              <button
                onClick={() => setActiveProfileTab("billing")}
                className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
                  activeProfileTab === "billing"
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Billing & Receipts
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {activeProfileTab === "overview" && (
                <div className="space-y-4">
                  {/* Vitals Strip */}
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Blood Pressure
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-1 block">
                        {selectedPatient.recentVitals?.bp || "120/80"}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Pulse Rate
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-1 block">
                        {selectedPatient.recentVitals?.pulse || "74 bpm"}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Body Temp
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-1 block">
                        {selectedPatient.recentVitals?.temp || "98.6 F"}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Weight
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-1 block">
                        {selectedPatient.recentVitals?.weight || "72 kg"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      Clinical Notes & Allergies
                    </span>
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedPatient.notes || "No chronic alerts recorded."}
                    </p>
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="font-bold text-rose-600">
                          Allergies: {selectedPatient.allergies.join(", ")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold block">
                        No known drug allergies.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {activeProfileTab === "history" && (
                <div className="space-y-3">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    Past Visits at this Clinic
                  </span>
                  {appointments
                    .filter((a) => a.patientId === selectedPatient.id || a.patientName === selectedPatient.name)
                    .map((a) => (
                      <div
                        key={a.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {a.date} at {a.timeSlot}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {a.doctorName} • {a.department} ({a.type})
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                          {a.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {activeProfileTab === "prescriptions" && (
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-center space-y-2">
                  <FileText className="w-8 h-8 text-sky-600 mx-auto" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Authorized E-Prescription Archive
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Prescription records are signed by Dr. Tariq Mahmood. PDF downloads synced with patient mobile app.
                  </p>
                  <button className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer shadow-sm">
                    View Last Prescription (Rx)
                  </button>
                </div>
              )}

              {activeProfileTab === "billing" && (
                <div className="space-y-2">
                  {invoices
                    .filter((i) => i.patientId === selectedPatient.id || i.patientName === selectedPatient.name)
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white block">
                            {inv.invoiceNo}
                          </span>
                          <span className="text-[11px] text-slate-500">{inv.service} • {inv.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 dark:text-white block">
                            PKR {inv.totalAmount}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">{inv.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onBookAppointmentForPatient(selectedPatient.id);
                  setSelectedPatient(null);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
