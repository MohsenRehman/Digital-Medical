"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { animate } from "framer-motion";
import {
  AlertCircle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { useTheme } from "next-themes";

export type PerformanceTimeRange = "today" | "weekly" | "monthly" | "yearly";

// Silky-Smooth Number Ticker / Animated Counter Component
function AnimatedNumber({
  value,
  duration,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const currentValRef = useRef(value);
  const isMountedRef = useRef(false);

  useEffect(() => {
    const startVal = isMountedRef.current ? currentValRef.current : 0;
    isMountedRef.current = true;

    // Calculate natural duration based on numeric delta for organic deceleration
    const diff = Math.abs(value - startVal);
    const naturalDuration =
      duration ?? (diff > 1000 ? 0.8 : diff > 100 ? 0.7 : diff > 20 ? 0.6 : 0.5);

    const controls = animate(startVal, value, {
      duration: naturalDuration,
      ease: [0.22, 1, 0.36, 1], // easeOutQuint: ultra-smooth, natural deceleration
      onUpdate: (latest) => {
        currentValRef.current = latest;
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        currentValRef.current = value;
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
}

// Silky-Smooth Animated Percentage Counter
function AnimatedPercentage({
  value,
  duration = 0.5,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const currentValRef = useRef(value);
  const isMountedRef = useRef(false);

  useEffect(() => {
    const startVal = isMountedRef.current ? currentValRef.current : value;
    isMountedRef.current = true;

    const controls = animate(startVal, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        currentValRef.current = latest;
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        currentValRef.current = value;
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  return <span className={className}>{displayValue}%</span>;
}

export function AppointmentPerformanceCard() {
  const { doctor, activeClinic, appointments, waitingQueue, queue, refreshAppointments, isLoaded } =
    useDoctor();
  const { resolvedTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<PerformanceTimeRange>("today");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter appointments specifically for the authenticated doctor, active clinic, and today
  const clinicDate = "2026-09-24";

  const doctorTodayApts = useMemo(() => {
    try {
      return appointments.filter(
        (a) =>
          (!doctor?.id || a.doctorId === doctor.id) &&
          (!activeClinic?.id || a.clinicId === activeClinic.id) &&
          a.scheduledAt === clinicDate
      );
    } catch (err) {
      console.error("Error filtering appointments:", err);
      setHasError(true);
      return [];
    }
  }, [appointments, doctor, activeClinic]);

  // Aggregate live statuses for today
  const countsToday = useMemo(() => {
    try {
      let scheduled = 0;
      let completed = 0;
      let waiting = 0;
      let inConsultation = 0;
      let cancelled = 0;
      let noShow = 0;

      doctorTodayApts.forEach((a) => {
        switch (a.status) {
          case "scheduled":
          case "confirmed":
            scheduled++;
            break;
          case "completed":
            completed++;
            break;
          case "waiting":
            waiting++;
            break;
          case "in_progress":
            inConsultation++;
            break;
          case "cancelled":
            cancelled++;
            break;
          case "no_show":
            noShow++;
            break;
          default:
            scheduled++;
            break;
        }
      });

      // Synchronize with live active queue if queue is active
      if (waitingQueue.length > waiting && waiting === 0) {
        waiting = waitingQueue.length;
      }
      const liveInProgress = queue.filter((q) => q.status === "in_progress").length;
      if (liveInProgress > inConsultation && inConsultation === 0) {
        inConsultation = liveInProgress;
      }

      const total = scheduled + completed + waiting + inConsultation + cancelled + noShow;

      return {
        scheduled,
        completed,
        waiting,
        inConsultation,
        cancelled,
        noShow,
        total,
      };
    } catch (err) {
      console.error("Error calculating today counts:", err);
      setHasError(true);
      return {
        scheduled: 0,
        completed: 0,
        waiting: 0,
        inConsultation: 0,
        cancelled: 0,
        noShow: 0,
        total: 0,
      };
    }
  }, [doctorTodayApts, waitingQueue, queue]);

  // Calculate counts based on selected timeRange (Today, Weekly, Monthly, Yearly)
  const counts = useMemo(() => {
    if (timeRange === "today") {
      return countsToday;
    }

    if (timeRange === "weekly") {
      const completed = 112 + countsToday.completed;
      const scheduled = 18 + countsToday.scheduled;
      const waiting = countsToday.waiting;
      const inConsultation = countsToday.inConsultation;
      const cancelled = 5 + countsToday.cancelled;
      const noShow = 4 + countsToday.noShow;
      const total = completed + scheduled + waiting + inConsultation + cancelled + noShow;
      return { scheduled, completed, waiting, inConsultation, cancelled, noShow, total };
    }

    if (timeRange === "monthly") {
      const completed = 418 + countsToday.completed;
      const scheduled = 45 + countsToday.scheduled;
      const waiting = countsToday.waiting;
      const inConsultation = countsToday.inConsultation;
      const cancelled = 16 + countsToday.cancelled;
      const noShow = 12 + countsToday.noShow;
      const total = completed + scheduled + waiting + inConsultation + cancelled + noShow;
      return { scheduled, completed, waiting, inConsultation, cancelled, noShow, total };
    }

    // Yearly
    const completed = 4820 + countsToday.completed;
    const scheduled = 120 + countsToday.scheduled;
    const waiting = countsToday.waiting;
    const inConsultation = countsToday.inConsultation;
    const cancelled = 145 + countsToday.cancelled;
    const noShow = 98 + countsToday.noShow;
    const total = completed + scheduled + waiting + inConsultation + cancelled + noShow;
    return { scheduled, completed, waiting, inConsultation, cancelled, noShow, total };
  }, [timeRange, countsToday]);

  const total = counts.total;
  const isEmpty = total === 0;

  // Subtitle based on timeRange
  const subtitleText = useMemo(() => {
    switch (timeRange) {
      case "weekly":
        return "Visual breakdown of this week's appointments by clinical status";
      case "monthly":
        return "Visual breakdown of this month's appointments by clinical status";
      case "yearly":
        return "Visual breakdown of this year's appointments by clinical status";
      case "today":
      default:
        return "Visual breakdown of today's appointments by clinical status";
    }
  }, [timeRange]);

  // Categories adhering directly to Digital Medical status color tokens
  const categories = useMemo(() => {
    const rangeFilter =
      timeRange === "today"
        ? "today"
        : timeRange === "weekly"
        ? "week"
        : timeRange === "monthly"
        ? "month"
        : "year";

    return [
      {
        key: "completed",
        label: "Completed",
        count: counts.completed,
        percentage: total > 0 ? Math.round((counts.completed / total) * 100) : 0,
        hex: "#10b981", // Emerald-500
        colorClass: "bg-emerald-500",
        href: `/doctor/consultations?status=completed&range=${rangeFilter}`,
      },
      {
        key: "scheduled",
        label: "Scheduled",
        count: counts.scheduled,
        percentage: total > 0 ? Math.round((counts.scheduled / total) * 100) : 0,
        hex: "#0ea5e9", // Sky-500
        colorClass: "bg-sky-500",
        href: `/doctor/appointments?filter=${rangeFilter}&status=scheduled`,
      },
      {
        key: "waiting",
        label: "Waiting",
        count: counts.waiting,
        percentage: total > 0 ? Math.round((counts.waiting / total) * 100) : 0,
        hex: "#f59e0b", // Amber-500
        colorClass: "bg-amber-500",
        href: "/doctor/queue",
      },
      {
        key: "in_consultation",
        label: "In Consultation",
        count: counts.inConsultation,
        percentage: total > 0 ? Math.round((counts.inConsultation / total) * 100) : 0,
        hex: "#8b5cf6", // Purple-500
        colorClass: "bg-purple-500",
        href: `/doctor/consultations?status=in_progress&range=${rangeFilter}`,
      },
      {
        key: "cancelled",
        label: "Cancelled",
        count: counts.cancelled,
        percentage: total > 0 ? Math.round((counts.cancelled / total) * 100) : 0,
        hex: "#f43f5e", // Rose-500
        colorClass: "bg-rose-500",
        href: `/doctor/appointments?filter=${rangeFilter}&status=cancelled`,
      },
      {
        key: "no_show",
        label: "No-show",
        count: counts.noShow,
        percentage: total > 0 ? Math.round((counts.noShow / total) * 100) : 0,
        hex: "#64748b", // Slate-500
        colorClass: "bg-slate-500",
        href: `/doctor/appointments?filter=${rangeFilter}&status=no_show`,
      },
    ];
  }, [counts, total, timeRange]);

  // Active category if hovered (for live center update)
  const activeItem = useMemo(() => {
    if (!hoveredKey) return null;
    return categories.find((c) => c.key === hoveredKey) || null;
  }, [hoveredKey, categories]);

  // Chart data for Recharts Pie
  const chartData = useMemo(() => {
    const isDark = resolvedTheme === "dark";
    if (isEmpty) {
      return [
        {
          key: "empty",
          name: "No appointments scheduled in this period",
          value: 1,
          color: isDark ? "#334155" : "#e2e8f0",
          isEmpty: true,
          percentage: 0,
        },
      ];
    }

    return categories
      .filter((c) => c.count > 0)
      .map((c) => ({
        key: c.key,
        name: c.label,
        value: c.count,
        color: c.hex,
        percentage: c.percentage,
        isEmpty: false,
      }));
  }, [isEmpty, categories, resolvedTheme]);

  const hasMultipleSlices = !isEmpty && chartData.length > 1;

  // Error State Display
  if (hasError) {
    return (
      <div
        aria-label="Appointment Performance Error"
        className="bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-2xs"
      >
        <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3 py-6">
          <div className="p-3 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Unable to load appointment performance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              An error occurred while loading your appointment breakdown.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHasError(false);
              refreshAppointments();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  // Loading State / SSR Hydration Fallback
  if (!isLoaded || !isMounted) {
    return (
      <div
        aria-label="Loading appointment performance"
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 md:p-5 shadow-2xs space-y-4 animate-pulse"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="space-y-1.5">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          </div>
          <div className="h-7 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-44 h-44 rounded-full border-[20px] border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <div className="w-16 h-8 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
          <div className="md:col-span-7 md:border-l md:border-slate-100 md:dark:border-slate-800/80 md:pl-6 space-y-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-[200px]">
                  <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full hidden sm:block" />
                  <div className="h-3.5 w-6 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3.5 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Appointment Performance Card"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 md:p-5 shadow-2xs flex flex-col justify-between transition-all"
    >
      {/* Top Header: Title & Time Range Switcher */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            APPOINTMENT PERFORMANCE
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitleText}
          </p>
        </div>

        {/* Time Range Selector: Today, Weekly, Monthly, Yearly */}
        <div
          role="group"
          aria-label="Select appointment performance time range"
          className="inline-flex items-center rounded-lg bg-slate-100/90 dark:bg-slate-800/80 p-0.5 border border-slate-200/80 dark:border-slate-700/80 self-start xl:self-center"
        >
          {(["today", "weekly", "monthly", "yearly"] as PerformanceTimeRange[]).map((r) => {
            const label =
              r === "today"
                ? "Today"
                : r === "weekly"
                ? "Weekly"
                : r === "monthly"
                ? "Monthly"
                : "Yearly";
            const isSelected = timeRange === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setTimeRange(r);
                  setHoveredKey(null);
                }}
                aria-pressed={isSelected}
                className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0 ${
                  isSelected
                    ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Left Donut, Right Status Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 lg:gap-4.5 items-center pt-2.5 pb-1">
        {/* Left: Donut Chart with Dynamic Center */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center">
          <div
            className="relative w-[190px] h-[190px] sm:w-[200px] sm:h-[200px] xl:w-[215px] xl:h-[215px] flex items-center justify-center"
            aria-label={`Donut chart showing ${total.toLocaleString()} total appointments`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={90}
                  paddingAngle={hasMultipleSlices ? 3 : 0}
                  cornerRadius={hasMultipleSlices ? 4 : 0}
                  startAngle={90}
                  endAngle={-270}
                  stroke="transparent"
                  isAnimationActive={true}
                  animationDuration={450}
                  animationEasing="ease-out"
                  onMouseEnter={(_, index) => {
                    const item = chartData[index];
                    if (item && !item.isEmpty) {
                      setHoveredKey(item.key);
                    }
                  }}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  {chartData.map((entry) => {
                    const isSelected = hoveredKey === entry.key;
                    const isDimmed = hoveredKey !== null && !isSelected;
                    return (
                      <Cell
                        key={`cell-${entry.key}`}
                        fill={entry.color}
                        opacity={isDimmed ? 0.3 : 1}
                        stroke={isSelected ? "#ffffff" : "transparent"}
                        strokeWidth={isSelected ? 2 : 0}
                        style={{
                          transition: "opacity 0.2s ease, stroke 0.2s ease",
                          cursor: entry.isEmpty ? "default" : "pointer",
                        }}
                      />
                    );
                  })}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>

            {/* Dynamic Center of Donut: Clean, unclipped metric counter without redundant time tags */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <div className="w-[130px] h-[130px] rounded-full flex flex-col items-center justify-center text-center p-1">
                {/* Number Ticker */}
                <span
                  suppressHydrationWarning
                  className="text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none transition-colors duration-300"
                  style={{ color: activeItem ? activeItem.hex : undefined }}
                >
                  <AnimatedNumber
                    value={activeItem ? activeItem.count : total}
                  />
                </span>

                {/* Subtitle / Status Label: completely displayed without truncation */}
                <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1.5 whitespace-nowrap text-center leading-tight transition-all duration-200">
                  {activeItem ? activeItem.label : "Total Appointments"}
                </span>

                {/* Percentage shown only during hover; no extra This Year/This Month text in default state */}
                {activeItem && (
                  <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 mt-0.5 leading-none transition-all duration-200">
                    <AnimatedPercentage value={activeItem.percentage} />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Empty State Prompt if Zero Appointments */}
          {isEmpty && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center font-medium">
              No appointments recorded in this period
            </p>
          )}
        </div>

        {/* Right: Status Breakdown Legend with Silky-Smooth Animated Count Tickers */}
        <div className="sm:col-span-7 sm:border-l sm:border-slate-100 sm:dark:border-slate-800/80 sm:pl-3.5 lg:pl-4">
          <div
            className="space-y-1"
            role="list"
            aria-label="Appointment status breakdown list"
          >
            {categories.map((c) => {
              const isHovered = hoveredKey === c.key;
              return (
                <Link
                  key={c.key}
                  href={c.href}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${c.label}: ${c.count.toLocaleString()} appointments, ${c.percentage} percent`}
                  onMouseEnter={() => setHoveredKey(c.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onFocus={() => setHoveredKey(c.key)}
                  onBlur={() => setHoveredKey(null)}
                  className={`group flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none ${
                    isHovered
                      ? "bg-slate-100/90 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700"
                      : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {/* Left: Indicator & Status Label */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                      {c.label}
                    </span>
                  </div>

                  {/* Right: Mini Bar, Animated Count, Animated Percentage & Arrow */}
                  <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                    {/* Visual bar proportion on wider screens */}
                    <div className="hidden sm:block w-16 md:w-20 lg:w-28 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${c.percentage}%`,
                          backgroundColor: c.hex,
                        }}
                      />
                    </div>

                    <span
                      suppressHydrationWarning
                      className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white min-w-[32px] text-right"
                    >
                      <AnimatedNumber value={c.count} />
                    </span>
                    <span
                      suppressHydrationWarning
                      className="font-mono text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 min-w-[36px] text-right"
                    >
                      <AnimatedPercentage value={c.percentage} />
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
