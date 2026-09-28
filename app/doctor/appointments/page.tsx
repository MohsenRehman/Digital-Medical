"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  AlertCircle,
  Play,
  Eye,
  Search,
  Filter,
  UserCheck,
  XCircle,
  Calendar,
  AlertTriangle,
  UserX,
  RefreshCw,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { DoctorAppointment, AppointmentStatus } from "@/lib/types/doctor";

function DoctorAppointmentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { appointments, updateAppointmentStatus, activeClinic } = useDoctor();

  const filterParam = searchParams.get("filter");
  const statusParam = searchParams.get("status");
  const dateParam = searchParams.get("date");

  const getInitialDateFilter = (): "today" | "tomorrow" | "this_week" | "all" => {
    if (filterParam === "tomorrow" || dateParam === "tomorrow") return "tomorrow";
    if (filterParam === "this_week" || dateParam === "this_week") return "this_week";
    if (filterParam === "all" || dateParam === "all") return "all";
    return "today";
  };

  const getInitialStatusFilter = (): string => {
    if (filterParam === "upcoming" || statusParam === "upcoming") return "upcoming";
    if (
      statusParam &&
      ["waiting", "in_progress", "confirmed", "scheduled", "completed", "no_show", "cancelled"].includes(
        statusParam
      )
    ) {
      return statusParam;
    }
    return "all";
  };

  // Filters
  const [dateFilter, setDateFilter] = useState<"today" | "tomorrow" | "this_week" | "all">(getInitialDateFilter);
  const [statusFilter, setStatusFilter] = useState<string>(getInitialStatusFilter);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync filters if URL search params change
  useEffect(() => {
    if (filterParam === "upcoming" || statusParam === "upcoming") {
      setStatusFilter("upcoming");
    } else if (statusParam) {
      setStatusFilter(statusParam);
    } else if (filterParam === "today") {
      setStatusFilter("all");
    }

    if (filterParam === "today" || dateParam === "today") {
      setDateFilter("today");
    } else if (filterParam === "tomorrow" || dateParam === "tomorrow") {
      setDateFilter("tomorrow");
    } else if (filterParam === "this_week" || dateParam === "this_week") {
      setDateFilter("this_week");
    } else if (filterParam === "all" || dateParam === "all") {
      setDateFilter("all");
    }
  }, [filterParam, statusParam, dateParam]);

  // Action modal state
  const [cancelModalApt, setCancelModalApt] = useState<DoctorAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const statusConfig: Record<
    AppointmentStatus,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }
  > = {
    scheduled: {
      label: "Scheduled",
      icon: Clock,
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle2,
      bg: "bg-sky-50 dark:bg-sky-950/40",
      text: "text-sky-700 dark:text-sky-300",
      border: "border-sky-200 dark:border-sky-800",
    },
    waiting: {
      label: "Waiting",
      icon: AlertCircle,
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
    },
    in_progress: {
      label: "In Progress",
      icon: Play,
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle2,
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-200 dark:border-rose-800",
    },
    no_show: {
      label: "No Show",
      icon: XCircle,
      bg: "bg-slate-100 dark:bg-slate-800",
      text: "text-slate-600 dark:text-slate-400",
      border: "border-slate-200 dark:border-slate-700",
    },
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Date filter
      if (dateFilter === "today" && apt.scheduledAt !== "2026-09-24") return false;
      if (dateFilter === "tomorrow" && apt.scheduledAt !== "2026-09-25") return false;
      // Status filter
      if (statusFilter === "upcoming") {
        if (apt.status !== "scheduled" && apt.status !== "confirmed") return false;
      } else if (statusFilter !== "all" && apt.status !== statusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== "all" && apt.consultationType !== typeFilter) return false;
      // Search
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const mName = apt.patientName.toLowerCase().includes(q);
        const mToken = apt.tokenNumber.toLowerCase().includes(q);
        const mPhone = apt.patientPhone.includes(q);
        const mRef = apt.bookingRef.toLowerCase().includes(q);
        return mName || mToken || mPhone || mRef;
      }
      return true;
    });
  }, [appointments, dateFilter, statusFilter, typeFilter, searchQuery]);

  const handleStart = (apt: DoctorAppointment) => {
    updateAppointmentStatus(apt.id, "in_progress");
    router.push(`/doctor/consultations/${apt.id}`);
  };

  const handleMarkNoShow = (apt: DoctorAppointment) => {
    updateAppointmentStatus(apt.id, "no_show");
  };

  const handleConfirmCancel = () => {
    if (cancelModalApt) {
      updateAppointmentStatus(cancelModalApt.id, "cancelled");
      setCancelModalApt(null);
      setCancelReason("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clinical Appointments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your daily patient slots, in-clinic consultations, and video telehealth appointments.
          </p>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {(
            [
              { id: "today", label: "Today (24 Sep)" },
              { id: "tomorrow", label: "Tomorrow" },
              { id: "this_week", label: "This Week" },
              { id: "all", label: "All Dates" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dateFilter === tab.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, token (e.g. A-20), or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="upcoming">Upcoming (Scheduled & Confirmed)</option>
            <option value="waiting">Waiting in Clinic</option>
            <option value="in_progress">In Progress</option>
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type selector */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Visit Types</option>
            <option value="in_clinic">In-Clinic Consultations</option>
            <option value="video">Telehealth Video Calls</option>
          </select>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Time & Token</th>
                <th className="py-3.5 px-4">Patient Information</th>
                <th className="py-3.5 px-4">Consultation Mode</th>
                <th className="py-3.5 px-4">Clinical Status</th>
                <th className="py-3.5 px-4">Reason for Visit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No appointments match your filters
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Reset filters or change dates to view scheduled patients.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const statusMeta = statusConfig[apt.status] || statusConfig.scheduled;
                  const StatusIcon = statusMeta.icon;

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Time & Token */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                            {apt.timeSlot}
                          </span>
                          {apt.tokenNumber && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-mono font-bold text-[11px]">
                              {apt.tokenNumber}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{apt.bookingRef}</span>
                      </td>

                      {/* Patient Details */}
                      <td className="py-3.5 px-4">
                        <div>
                          <Link
                            href={`/doctor/patients/${apt.patientProfileId}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 text-xs transition-colors"
                          >
                            {apt.patientName}
                          </Link>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>
                              {apt.patientAge} yrs • {apt.patientGender}
                            </span>
                            <span>•</span>
                            <span>{apt.patientPhone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Consultation Mode */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {apt.consultationType === "video" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                            <Video className="w-3 h-3" />
                            <span>Video Call</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>In-Clinic</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusMeta.label}</span>
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-600 dark:text-slate-400">
                        {apt.reasonForVisit}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === "waiting" || apt.status === "confirmed" ? (
                            <button
                              onClick={() => handleStart(apt)}
                              className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Start</span>
                            </button>
                          ) : apt.status === "in_progress" ? (
                            <Link
                              href={`/doctor/consultations/${apt.id}`}
                              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Resume</span>
                            </Link>
                          ) : null}

                          <Link
                            href={`/doctor/patients/${apt.patientProfileId}`}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            title="View Patient Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {apt.status === "waiting" && (
                            <button
                              onClick={() => handleMarkNoShow(apt)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-400 hover:text-amber-600 transition-colors"
                              title="Mark No Show"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {apt.status !== "completed" && apt.status !== "cancelled" && (
                            <button
                              onClick={() => setCancelModalApt(apt)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Appointment Cancellation */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cancel Appointment?
                </h3>
                <p className="text-xs text-slate-500">Ref: {cancelModalApt.bookingRef}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to cancel the appointment for{" "}
              <strong>{cancelModalApt.patientName}</strong> scheduled at{" "}
              <strong>{cancelModalApt.timeSlot}</strong>? The patient will be notified via SMS/WhatsApp.
            </p>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Reason for cancellation
              </label>
              <input
                type="text"
                placeholder="e.g. Emergency procedure, patient requested reschedule"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
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

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading appointments...</div>}>
      <DoctorAppointmentsContent />
    </Suspense>
  );
}

