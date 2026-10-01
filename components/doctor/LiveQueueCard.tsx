"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  Play,
  ArrowRight,
  UserCheck,
  Activity,
  AlertCircle,
  Video,
  Building2,
  CheckCircle2,
  SkipForward,
  UserX,
  RefreshCw,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { LoadingSpinner } from "@/components/doctor/loading/LoadingSpinner";
import { useDoctorToast } from "@/components/doctor/loading/DoctorToast";

export default function LiveQueueCard() {
  const router = useRouter();
  const { showToast } = useDoctorToast();
  const {
    currentQueuePatient,
    waitingQueue,
    callNextPatient,
    startConsultationFromQueue,
    skipQueuePatient,
    markQueueNoShow,
  } = useDoctor();

  const [isCallingNext, setIsCallingNext] = useState(false);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const handleCallNext = () => {
    if (isCallingNext) return;
    setIsCallingNext(true);
    callNextPatient();
    showToast("Calling next patient into consultation room...", "info");
    setTimeout(() => {
      setIsCallingNext(false);
    }, 450);
  };

  const handleStartConsultation = (queueId: string, appointmentId: string) => {
    if (actionInProgressId) return;
    setActionInProgressId(queueId);
    startConsultationFromQueue(queueId);
    router.push(`/doctor/consultations/${appointmentId}`);
  };

  const handleSkip = (queueId: string) => {
    if (actionInProgressId) return;
    setActionInProgressId(`skip-${queueId}`);
    skipQueuePatient(queueId);
    showToast("Patient deferred to later in queue", "info");
    setTimeout(() => setActionInProgressId(null), 300);
  };

  const handleNoShow = (queueId: string) => {
    if (actionInProgressId) return;
    setActionInProgressId(`noshow-${queueId}`);
    markQueueNoShow(queueId);
    showToast("Patient marked as No Show", "warning");
    setTimeout(() => setActionInProgressId(null), 300);
  };

  const handleOpenCurrent = () => {
    if (currentQueuePatient) {
      router.push(`/doctor/consultations/${currentQueuePatient.appointmentId}`);
    }
  };

  const totalWaitMinutes = waitingQueue.reduce((acc, q) => acc + (q.estimatedWaitMinutes || 15), 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Queue Header & Live Metrics Banner */}
      <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-sky-50/60 via-slate-50/40 to-teal-50/30 dark:from-sky-950/20 dark:via-slate-900 dark:to-teal-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                  LIVE PATIENT QUEUE
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Operational
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                City Medical Center • OPD Queue Controller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCallNext}
              disabled={waitingQueue.length === 0 || isCallingNext}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              {isCallingNext ? (
                <>
                  <LoadingSpinner size="xs" color="text-white" />
                  <span>Calling...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Call Next Patient</span>
                </>
              )}
            </button>
            <Link
              href="/doctor/queue"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Full Queue View
            </Link>
          </div>
        </div>

        {/* 3 Metrics Pills */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CURRENT TOKEN
            </span>
            <p className="text-lg md:text-xl font-extrabold text-sky-600 dark:text-sky-400 font-mono mt-0.5">
              {currentQueuePatient ? currentQueuePatient.tokenNumber : "None"}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PATIENTS WAITING
            </span>
            <p className="text-lg md:text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
              {waitingQueue.length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              EST. WAIT TIME
            </span>
            <p className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
              ~{Math.max(totalWaitMinutes, 15)} min
            </p>
          </div>
        </div>
      </div>

      {/* Main Queue Split: Now Consulting vs Next Waiting */}
      <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): NOW CONSULTING */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-sky-50/50 to-indigo-50/30 dark:from-slate-800/70 dark:to-slate-800/40 border border-sky-200/60 dark:border-slate-700">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Now Consulting
              </span>
              {currentQueuePatient && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-600 text-white shadow-xs">
                  {currentQueuePatient.tokenNumber}
                </span>
              )}
            </div>

            {currentQueuePatient ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentQueuePatient.patientName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {currentQueuePatient.age} yrs • {currentQueuePatient.gender}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Encounter Reason</div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {currentQueuePatient.reason}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-2">
                    <span>Slot: {currentQueuePatient.appointmentTime}</span>
                    <span>•</span>
                    <span className="capitalize">{currentQueuePatient.consultationType.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                <p>No consultation currently in progress.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click &quot;Call Next Patient&quot; to bring in the next queued patient.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700">
            {currentQueuePatient ? (
              <button
                onClick={handleOpenCurrent}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Open Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={callNextPatient}
                disabled={waitingQueue.length === 0}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>Call Waiting Patient</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): WAITING QUEUE LIST */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Waiting ({waitingQueue.length})
            </span>
            <span className="text-[11px] text-slate-500">Ordered by arrival time</span>
          </div>

          {waitingQueue.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 flex-1 flex flex-col items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Queue is clear</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No patients are currently waiting in the clinic reception.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
              {waitingQueue.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-sky-300 dark:hover:border-slate-700 transition-all shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-mono font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                      {entry.tokenNumber}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {entry.patientName}
                        </span>
                        {entry.priority === "urgent" && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 text-[10px] font-bold">
                            Urgent
                          </span>
                        )}
                        {entry.consultationType === "video" && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 text-[10px] font-bold flex items-center gap-1">
                            <Video className="w-2.5 h-2.5" /> Video
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {entry.age} yrs • {entry.gender} • Waiting {entry.waitingSinceMinutes} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleStartConsultation(entry.id, entry.appointmentId)}
                      disabled={actionInProgressId !== null}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs"
                    >
                      {actionInProgressId === entry.id ? (
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
                    <button
                      onClick={() => handleSkip(entry.id)}
                      disabled={actionInProgressId !== null}
                      title="Move patient back in queue"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      {actionInProgressId === `skip-${entry.id}` ? (
                        <LoadingSpinner size="xs" />
                      ) : (
                        <SkipForward className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleNoShow(entry.id)}
                      disabled={actionInProgressId !== null}
                      title="Mark as No Show"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-50"
                    >
                      {actionInProgressId === `noshow-${entry.id}` ? (
                        <LoadingSpinner size="xs" />
                      ) : (
                        <UserX className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
