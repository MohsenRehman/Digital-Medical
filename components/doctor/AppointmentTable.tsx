"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  HelpCircle,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { DoctorAppointment, AppointmentStatus } from "@/lib/types/doctor";
import { LoadingSpinner } from "@/components/doctor/loading/LoadingSpinner";

interface AppointmentTableProps {
  showAllAppointments?: boolean;
  limit?: number;
}

export default function AppointmentTable({ showAllAppointments = false, limit }: AppointmentTableProps) {
  const router = useRouter();
  const { appointments, updateAppointmentStatus } = useDoctor();

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [startingAptId, setStartingAptId] = useState<string | null>(null);

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
      // Date filter: if not showAllAppointments, restrict to today (2026-09-24)
      if (!showAllAppointments && apt.scheduledAt !== "2026-09-24") {
        return false;
      }
      // Status filter
      if (statusFilter !== "all" && apt.status !== statusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== "all" && apt.consultationType !== typeFilter) {
        return false;
      }
      // Text search
      if (searchFilter.trim().length > 0) {
        const query = searchFilter.toLowerCase();
        const matchesName = apt.patientName.toLowerCase().includes(query);
        const matchesToken = apt.tokenNumber.toLowerCase().includes(query);
        const matchesPhone = apt.patientPhone.includes(query);
        return matchesName || matchesToken || matchesPhone;
      }
      return true;
    });
  }, [appointments, showAllAppointments, statusFilter, typeFilter, searchFilter]);

  const displayedList = limit ? filteredAppointments.slice(0, limit) : filteredAppointments;

  const handleStartConsultation = (appointmentId: string) => {
    if (startingAptId) return;
    setStartingAptId(appointmentId);
    updateAppointmentStatus(appointmentId, "in_progress");
    router.push(`/doctor/consultations/${appointmentId}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-3.5 sm:p-4 md:p-4.5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
            Today&apos;s Appointments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {displayedList.length} of {filteredAppointments.length} appointments for Thursday, 24 Sep 2026
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by patient/token..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-2.5 py-1 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="waiting">Waiting in Clinic</option>
            <option value="in_progress">In Progress</option>
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Consultation Types</option>
            <option value="in_clinic">In-Clinic Visits</option>
            <option value="video">Telehealth Video</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3 sm:px-3.5">Time</th>
              <th className="py-2.5 px-3 sm:px-3.5">Patient</th>
              <th className="py-2.5 px-3 sm:px-3.5">Type</th>
              <th className="py-2.5 px-3 sm:px-3.5">Status</th>
              <th className="py-2.5 px-3 sm:px-3.5">Token</th>
              <th className="py-2.5 px-3 sm:px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <CalendarDays className="w-7 h-7 text-slate-300 dark:text-slate-700" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No appointments found</p>
                    <p className="text-[11px] text-slate-400">
                      {searchFilter || statusFilter !== "all" || typeFilter !== "all"
                        ? "No appointments match your active search or filter criteria."
                        : "No appointments scheduled for this date."}
                    </p>
                    {(searchFilter || statusFilter !== "all" || typeFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchFilter("");
                          setStatusFilter("all");
                          setTypeFilter("all");
                        }}
                        className="mt-1.5 px-2.5 py-1 text-xs text-sky-600 dark:text-sky-400 font-semibold border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/50"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              displayedList.map((apt) => {
                const statusMeta = statusConfig[apt.status] || statusConfig.scheduled;
                const StatusIcon = statusMeta.icon;

                return (
                  <tr
                    key={apt.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Time */}
                    <td className="py-2.5 px-3 sm:px-3.5 font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {apt.timeSlot}
                    </td>

                    {/* Patient */}
                    <td className="py-2.5 px-3 sm:px-3.5">
                      <div>
                        <Link
                          href={`/doctor/patients/${apt.patientProfileId}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        >
                          {apt.patientName}
                        </Link>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{apt.patientAge} yrs • {apt.patientGender}</span>
                          <span>•</span>
                          <span>{apt.patientPhone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Consultation Type */}
                    <td className="py-2.5 px-3 sm:px-3.5 whitespace-nowrap">
                      {apt.consultationType === "video" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>In-Clinic</span>
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 sm:px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusMeta.label}</span>
                      </span>
                    </td>

                    {/* Token */}
                    <td className="py-2.5 px-3 sm:px-3.5 whitespace-nowrap">
                      {apt.tokenNumber ? (
                        <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {apt.tokenNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-2.5 px-3 sm:px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === "waiting" || apt.status === "confirmed" ? (
                          <button
                            onClick={() => handleStartConsultation(apt.id)}
                            disabled={startingAptId !== null}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            {startingAptId === apt.id ? (
                              <>
                                <LoadingSpinner size="xs" color="text-white" />
                                <span>Starting...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                <span>Start</span>
                              </>
                            )}
                          </button>
                        ) : apt.status === "in_progress" ? (
                          <Link
                            href={`/doctor/consultations/${apt.id}`}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Resume</span>
                          </Link>
                        ) : null}

                        <Link
                          href={`/doctor/patients/${apt.patientProfileId}`}
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer link to view full schedule if limited */}
      {limit && filteredAppointments.length > limit && (
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
          <Link
            href="/doctor/appointments"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            View all {filteredAppointments.length} appointments →
          </Link>
        </div>
      )}
    </div>
  );
}
