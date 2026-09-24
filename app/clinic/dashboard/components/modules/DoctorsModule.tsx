"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Plus,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  DollarSign,
  Star,
  Users,
  Eye,
  Edit,
  X,
} from "lucide-react";
import { DashboardDoctor } from "../../types";

interface DoctorsModuleProps {
  doctors: DashboardDoctor[];
  onOpenAddDoctor: () => void;
  onUpdateDoctorStatus: (id: string, newStatus: DashboardDoctor["status"]) => void;
}

export const DoctorsModule: React.FC<DoctorsModuleProps> = ({
  doctors,
  onOpenAddDoctor,
  onUpdateDoctorStatus,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<DashboardDoctor | null>(null);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ADD DOCTOR BUTTON */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Clinic Doctors & Specialists Roster
          </h3>
          <p className="text-xs text-slate-500">
            {doctors.length} Verified Consultants • Shift Management & Room Allocation
          </p>
        </div>

        <button
          onClick={onOpenAddDoctor}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Specialist</span>
        </button>
      </div>

      {/* 2. DOCTOR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 hover:border-purple-500/40 hover:shadow-lg transition-all"
          >
            {/* Header info */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                {doc.name.replace("Dr. ", "").charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                    {doc.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                    {doc.room}
                  </span>
                </div>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold block truncate">
                  {doc.specialization}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {doc.qualifications}
                </span>
              </div>
            </div>

            {/* Quick Details */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Shift:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{doc.shifts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">License / PMDC:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {doc.licenseNo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">OPD Consultation Fee:</span>
                <span className="font-mono font-bold text-emerald-600">
                  PKR {doc.consultationFee.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono block">
                  {doc.todayAppointmentsCount}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Today</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-sm font-black text-amber-500 font-mono block">
                  {doc.waitingCount}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Waiting</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-sm font-black text-emerald-500 font-mono block">
                  {doc.completedTodayCount}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Done</span>
              </div>
            </div>

            {/* Status Change Selector & View Details */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <select
                value={doc.status}
                onChange={(e) => onUpdateDoctorStatus(doc.id, e.target.value as any)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                  doc.status === "Available"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : doc.status === "In Consultation"
                    ? "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/60 dark:text-sky-400"
                    : doc.status === "On Break"
                    ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400"
                    : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <option value="Available">Available</option>
                <option value="In Consultation">In Consultation</option>
                <option value="On Break">On Break</option>
                <option value="Off Duty">Off Duty</option>
              </select>

              <button
                onClick={() => setSelectedDoctor(doc)}
                className="px-3 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. DOCTOR DETAIL MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {selectedDoctor.name}
                </h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                  {selectedDoctor.specialization} • {selectedDoctor.room}
                </span>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    PMDC Registration
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white mt-1 block">
                    {selectedDoctor.licenseNo}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Monthly Patient Volume
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white mt-1 block">
                    {selectedDoctor.monthlyPatients} Patients
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Working Days & Schedule
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedDoctor.workingDays.map((d) => (
                    <span
                      key={d}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <span className="text-slate-500 text-[11px] block mt-1">
                  Shift: {selectedDoctor.shifts}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
