"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users2,
  Play,
  SkipForward,
  UserX,
  CheckCircle2,
  Clock,
  Video,
  Building2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Volume2,
  RefreshCw,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { QueueEntry } from "@/lib/types/doctor";
import { LoadingSpinner } from "@/components/doctor/loading/LoadingSpinner";
import { useDoctorToast } from "@/components/doctor/loading/DoctorToast";

export default function DoctorQueuePage() {
  const router = useRouter();
  const { showToast } = useDoctorToast();
  const {
    queue,
    currentQueuePatient,
    waitingQueue,
    callNextPatient,
    startConsultationFromQueue,
    skipQueuePatient,
    markQueueNoShow,
    activeClinic,
  } = useDoctor();

  // Action states
  const [confirmNoShowEntry, setConfirmNoShowEntry] = useState<QueueEntry | null>(null);
  const [announcementPlayed, setAnnouncementPlayed] = useState(false);
  const [isCallingNext, setIsCallingNext] = useState(false);
  const [startingQueueId, setStartingQueueId] = useState<string | null>(null);
  const [isSubmittingNoShow, setIsSubmittingNoShow] = useState(false);

  const completedQueue = queue.filter((q) => q.status === "completed");
  const nextPatient = waitingQueue[0];

  const handleCallNext = () => {
    if (isCallingNext) return;
    setIsCallingNext(true);
    callNextPatient();
    showToast("Calling next queued patient...", "info");
    setTimeout(() => setIsCallingNext(false), 450);
  };

  const handleStartConsultation = (entry: QueueEntry) => {
    if (startingQueueId) return;
    setStartingQueueId(entry.id);
    startConsultationFromQueue(entry.id);
    router.push(`/doctor/consultations/${entry.appointmentId}`);
  };

  const handlePlayAnnouncement = (token: string, name: string) => {
    setAnnouncementPlayed(true);
    setTimeout(() => setAnnouncementPlayed(false), 3000);
  };

  const handleConfirmNoShow = () => {
    if (confirmNoShowEntry) {
      setIsSubmittingNoShow(true);
      setTimeout(() => {
        markQueueNoShow(confirmNoShowEntry.id);
        showToast(`Patient ${confirmNoShowEntry.patientName} marked as No Show`, "warning");
        setIsSubmittingNoShow(false);
        setConfirmNoShowEntry(null);
      }, 300);
    }
  };

  return (
    <div className="space-y-6">
      {/* Queue Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live OPD Queue Station
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Clinic Queue Controller
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {activeClinic.name} • {activeClinic.roomNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentQueuePatient) {
                handlePlayAnnouncement(currentQueuePatient.tokenNumber, currentQueuePatient.patientName);
              }
            }}
            disabled={!currentQueuePatient}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>Chime Audio Call</span>
          </button>

          <button
            onClick={handleCallNext}
            disabled={waitingQueue.length === 0 || isCallingNext}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            {isCallingNext ? (
              <>
                <LoadingSpinner size="xs" color="text-white" />
                <span>Calling...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Call Next Patient</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Announcement Banner */}
      {announcementPlayed && (
        <div className="p-3 bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 rounded-2xl text-xs font-medium text-sky-800 dark:text-sky-300 flex items-center justify-between animate-fadeInUp">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-sky-600 animate-bounce" />
            <span>
              Lobby PA: &quot;Token {currentQueuePatient?.tokenNumber}, {currentQueuePatient?.patientName}, please proceed to {activeClinic.roomNumber}.&quot;
            </span>
          </div>
          <span className="text-[10px] text-sky-500">Broadcasting...</span>
        </div>
      )}

      {/* Grid: Current & Next Patient Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CURRENT PATIENT */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-50/30 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 border-2 border-sky-400 dark:border-sky-600 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-600 text-white shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Current In Consultation
              </span>
              {currentQueuePatient && (
                <span className="text-2xl font-mono font-black text-sky-700 dark:text-sky-300">
                  {currentQueuePatient.tokenNumber}
                </span>
              )}
            </div>

            {currentQueuePatient ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {currentQueuePatient.patientName}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {currentQueuePatient.age} years • {currentQueuePatient.gender} • Token Ref {currentQueuePatient.tokenNumber}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Chief Reason for Encounter</div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {currentQueuePatient.reason}
                  </p>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Slot: {currentQueuePatient.appointmentTime}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{currentQueuePatient.consultationType.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                <p className="font-semibold text-slate-600 dark:text-slate-300">No Patient in Room</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ready to call the next waiting patient from reception.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            {currentQueuePatient ? (
              <Link
                href={`/doctor/consultations/${currentQueuePatient.appointmentId}`}
                className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Continue Consultation Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={callNextPatient}
                disabled={waitingQueue.length === 0}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <span>Call Next Patient</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* NEXT UP PATIENT */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Up Next In Line
              </span>
              {nextPatient && (
                <span className="text-xl font-mono font-bold text-amber-700 dark:text-amber-400">
                  {nextPatient.tokenNumber}
                </span>
              )}
            </div>

            {nextPatient ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {nextPatient.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {nextPatient.age} years • {nextPatient.gender} • Waiting for {nextPatient.waitingSinceMinutes} minutes
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Scheduled Visit</div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{nextPatient.reason}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">No Upcoming Patients</p>
                <p className="text-[11px] text-slate-400 mt-0.5">The waiting lounge is currently clear.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            {nextPatient && (
              <>
                <button
                  onClick={() => handleStartConsultation(nextPatient)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Call & Start</span>
                </button>
                <button
                  onClick={() => skipQueuePatient(nextPatient.id)}
                  title="Move to back of queue"
                  className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setConfirmNoShowEntry(nextPatient)}
                  title="Mark as No Show"
                  className="px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <UserX className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* WAITING LIST TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Patients In Reception Queue ({waitingQueue.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Patients who have checked in at reception desk
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">
            Average Wait: ~18 mins
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {waitingQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                    {item.tokenNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {item.patientName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {item.age} yrs • {item.gender}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {item.waitingSinceMinutes} mins
                  </td>
                  <td className="py-3 px-4 capitalize">{item.consultationType.replace("_", " ")}</td>
                  <td className="py-3 px-4">
                    {item.priority === "urgent" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        Urgent
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStartConsultation(item)}
                        disabled={startingQueueId !== null}
                        className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-xs shadow-xs flex items-center gap-1"
                      >
                        {startingQueueId === item.id ? (
                          <>
                            <LoadingSpinner size="xs" color="text-white" />
                            <span>Starting...</span>
                          </>
                        ) : (
                          <span>Start</span>
                        )}
                      </button>
                      <button
                        onClick={() => skipQueuePatient(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                        title="Skip"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmNoShowEntry(item)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Mark No Show"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLETED PATIENTS LIST */}
      {completedQueue.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Completed Consultations Today ({completedQueue.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {completedQueue.map((item) => (
              <span
                key={item.id}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono font-bold">{item.tokenNumber}</span>
                <span>{item.patientName}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal for No-Show */}
      {confirmNoShowEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Mark as No Show?
                </h3>
                <p className="text-xs text-slate-500">Token {confirmNoShowEntry.tokenNumber}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure patient <strong>{confirmNoShowEntry.patientName}</strong> is not present in the waiting lounge? This will update their appointment status to No Show.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmNoShowEntry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNoShow}
                disabled={isSubmittingNoShow}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                {isSubmittingNoShow ? (
                  <>
                    <LoadingSpinner size="xs" color="text-white" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <span>Confirm No Show</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
