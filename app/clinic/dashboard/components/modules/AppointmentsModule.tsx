"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Ticket,
} from "lucide-react";
import { DashboardAppointment, DashboardDoctor, DashboardPatient } from "../../types";

interface AppointmentsModuleProps {
  appointments: DashboardAppointment[];
  doctors: DashboardDoctor[];
  patients: DashboardPatient[];
  onOpenNewAppointment: () => void;
  onCheckIn: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  onCompleteAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, newTime: string) => void;
}

export const AppointmentsModule: React.FC<AppointmentsModuleProps> = ({
  appointments,
  doctors,
  patients,
  onOpenNewAppointment,
  onCheckIn,
  onCancelAppointment,
  onCompleteAppointment,
  onRescheduleAppointment,
}) => {
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardAppointment | null>(null);

  // Filter logic
  const filtered = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === "all" || apt.doctorId === doctorFilter;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.bookingRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDoctor && matchesSearch;
  });

  const scheduledCount = appointments.filter((a) => a.status === "scheduled").length;
  const arrivedCount = appointments.filter((a) => a.status === "arrived" || a.status === "in-consultation").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Scheduled Today
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {scheduledCount}
          </div>
          <span className="text-[11px] text-sky-600 font-semibold mt-0.5 block">
            Awaiting arrival
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            In Queue / Arrived
          </span>
          <div className="text-2xl font-black text-amber-500 mt-1">{arrivedCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
            Tokens assigned
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Completed Visits
          </span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{completedCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Prescriptions issued
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Cancelled / No-shows
          </span>
          <div className="text-2xl font-black text-rose-500 mt-1">{cancelledCount}</div>
          <span className="text-[11px] text-slate-400 font-semibold mt-0.5 block">
            Slots reopened
          </span>
        </div>
      </div>

      {/* 2. FILTER & CONTROLS TOOLBAR */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, phone, or Ref..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="arrived">Arrived (Waiting)</option>
            <option value="in-consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Specialists</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.room})
              </option>
            ))}
          </select>
        </div>

        {/* Right: View Toggle & Book Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500"
              }`}
              title="Calendar Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewAppointment}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* 3. TABLE VIEW */}
      {viewMode === "table" ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Doctor & Specialty</th>
                  <th className="py-3 px-3">Date & Slot</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Fee & Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.length > 0 ? (
                  filtered.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {apt.bookingRef}
                        {apt.tokenNo && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Token #{apt.tokenNo}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {apt.patientName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {apt.patientPhone}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-slate-900 dark:text-white font-semibold block">
                          {apt.doctorName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {apt.department} • {apt.room}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {apt.date}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {apt.timeSlot}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {apt.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          PKR {apt.fee.toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            apt.paymentStatus === "Paid"
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {apt.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {apt.status === "in-consultation" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                            In Room
                          </span>
                        )}
                        {apt.status === "arrived" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            Waiting
                          </span>
                        )}
                        {apt.status === "scheduled" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            Scheduled
                          </span>
                        )}
                        {apt.status === "completed" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Completed
                          </span>
                        )}
                        {apt.status === "cancelled" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === "scheduled" && (
                            <button
                              onClick={() => onCheckIn(apt.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition-colors cursor-pointer flex items-center gap-1"
                              title="Check-in patient & issue token"
                            >
                              <Ticket className="w-3 h-3" />
                              <span>Check-in</span>
                            </button>
                          )}
                          {apt.status === "arrived" && (
                            <button
                              onClick={() => onCompleteAppointment(apt.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {apt.status !== "cancelled" && apt.status !== "completed" && (
                            <button
                              onClick={() => onCancelAppointment(apt.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Cancel"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      No appointments found matching current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 4. CALENDAR GRID VIEW */
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Consultation Schedule — September 2024
            </h4>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>This Week</span>
              <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.map((doc) => {
              const docAppointments = appointments.filter((a) => a.doctorId === doc.id);
              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {doc.name}
                      </h5>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400">
                        {doc.room} • {doc.specialization}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {docAppointments.length} Appts
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {docAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-xs hover:border-sky-500 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>{apt.timeSlot}</span>
                          <span className="text-[10px] font-mono text-sky-600">
                            {apt.bookingRef}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {apt.patientName} ({apt.patientPhone})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. APPOINTMENT DETAIL MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">
                  Appointment Details
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-mono">
                  {selectedAppointment.bookingRef}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedAppointment.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {selectedAppointment.patientPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor Assigned:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedAppointment.doctorName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-900 dark:text-white">
                    {selectedAppointment.department} • {selectedAppointment.room}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedAppointment.date} at {selectedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee & Payment:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    PKR {selectedAppointment.fee} ({selectedAppointment.paymentStatus})
                  </span>
                </div>
                {selectedAppointment.notes && (
                  <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <strong>Complaint:</strong> {selectedAppointment.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              {selectedAppointment.status === "scheduled" && (
                <button
                  onClick={() => {
                    onCheckIn(selectedAppointment.id);
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer"
                >
                  Check-in Patient
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
