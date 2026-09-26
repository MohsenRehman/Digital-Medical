"use client";

import React, { useState } from "react";
import {
  Users,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  RotateCcw,
  UserCheck,
  Stethoscope,
  Filter,
  Plus,
  Play,
  Check,
  X,
} from "lucide-react";
import { DashboardQueueItem, DashboardDoctor } from "../../types";

interface LiveQueueModuleProps {
  queue: DashboardQueueItem[];
  doctors: DashboardDoctor[];
  onOpenGenerateToken: () => void;
  onCallToken: (id: string) => void;
  onStartConsultation: (id: string) => void;
  onCompleteToken: (id: string) => void;
  onMarkNoShow: (id: string) => void;
  onRecallToken: (tokenNo: number, patientName: string) => void;
}

export const LiveQueueModule: React.FC<LiveQueueModuleProps> = ({
  queue,
  doctors,
  onOpenGenerateToken,
  onCallToken,
  onStartConsultation,
  onCompleteToken,
  onMarkNoShow,
  onRecallToken,
}) => {
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("all");
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");

  const filteredQueue = queue.filter((item) => {
    const matchesDoc = selectedDoctorFilter === "all" || item.doctorId === selectedDoctorFilter;
    const matchesRoom = selectedRoomFilter === "all" || item.room === selectedRoomFilter;
    return matchesDoc && matchesRoom;
  });

  const activeInRoom = queue.find((q) => q.status === "in-consultation");
  const calledPatient = queue.find((q) => q.status === "called");
  const waitingList = filteredQueue.filter((q) => q.status === "waiting" || q.status === "called");
  const completedList = filteredQueue.filter((q) => q.status === "completed");

  const rooms = Array.from(new Set(doctors.map((d) => d.room)));

  return (
    <div className="space-y-6">
      {/* 1. BIG DIGITAL HOSPITAL QUEUE BOARD (TV DISPLAY SIMULATION) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                Hospital OPD Electronic Token Display
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Live Patient Calling Board
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenGenerateToken}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Issue New Token</span>
            </button>
          </div>
        </div>

        {/* 2 Main Spotlight Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Tile 1: Now Calling (Flashing Token) */}
          <div className="p-6 rounded-3xl bg-white/5 border border-amber-500/30 backdrop-blur-md relative">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                Now Calling to Room
              </span>
              {calledPatient && (
                <button
                  onClick={() => onRecallToken(calledPatient.tokenNo, calledPatient.patientName)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Repeat token announcement"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recall Audio</span>
                </button>
              )}
            </div>

            {calledPatient ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-black font-mono text-amber-400 tracking-tight">
                    #{calledPatient.tokenNo}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white uppercase">
                    {calledPatient.room}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-white">{calledPatient.patientName}</h3>
                  <p className="text-xs text-slate-300">
                    Consultation with {calledPatient.doctorName} ({calledPatient.department})
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onStartConsultation(calledPatient.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Enter Consultation Room</span>
                  </button>
                  <button
                    onClick={() => onMarkNoShow(calledPatient.id)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Mark No-Show
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No token currently being called. Select a patient below to announce next token.
              </div>
            )}
          </div>

          {/* Tile 2: Inside Consultation Room */}
          <div className="p-6 rounded-3xl bg-white/5 border border-sky-500/30 backdrop-blur-md">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/40 block w-max mb-3">
              Currently Inside Room
            </span>

            {activeInRoom ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-black font-mono text-sky-400 tracking-tight">
                    #{activeInRoom.tokenNo}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white uppercase">
                    {activeInRoom.room}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-white">{activeInRoom.patientName}</h3>
                  <p className="text-xs text-slate-300">
                    With {activeInRoom.doctorName} • In consultation since{" "}
                    {activeInRoom.checkInTime}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onCompleteToken(activeInRoom.id)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Finish & Complete Visit</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Doctor consultation room is currently open and ready for next patient.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. FILTERS & QUEUE BREAKDOWN TOOLBAR */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-sky-600" />
            <span>Filter Queue:</span>
          </span>

          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.room})
              </option>
            ))}
          </select>

          <select
            value={selectedRoomFilter}
            onChange={(e) => setSelectedRoomFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Consultation Rooms</option>
            {rooms.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>
            {waitingList.length} Waiting • {completedList.length} Completed
          </span>
        </div>
      </div>

      {/* 3. ACTIVE WAITING LIST TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Waiting Queue Table ({waitingList.length})
          </h3>
          <span className="text-xs text-slate-400">Tokens ordered by check-in timestamp</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Doctor Assigned</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Check-in</th>
                <th className="py-3 px-3">Est. Wait</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {waitingList.length > 0 ? (
                waitingList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-black text-sm text-sky-600 dark:text-sky-400">
                      #{item.tokenNo}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {item.patientName}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold block">
                        {item.doctorName}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.department}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {item.room}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 font-mono">{item.checkInTime}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        ~{item.estimatedWaitMins} mins
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.priority === "Urgent"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : item.priority === "Elderly"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {item.status === "called" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse">
                          Calling...
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Waiting
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === "waiting" && (
                          <button
                            onClick={() => onCallToken(item.id)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Call</span>
                          </button>
                        )}
                        {item.status === "called" && (
                          <button
                            onClick={() => onStartConsultation(item.id)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Start</span>
                          </button>
                        )}
                        <button
                          onClick={() => onMarkNoShow(item.id)}
                          className="px-2 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Patient No-show"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No waiting tokens in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
