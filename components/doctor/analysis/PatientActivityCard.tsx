"use client";

import React, { useState, useId, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { animate } from "framer-motion";
import { useDoctor } from "@/app/context/DoctorContext";

export type RevenueTimeRange = "today" | "weekly" | "monthly" | "yearly";
export type StreamFilter = "all" | "in_clinic" | "video";

export interface RevenuePoint {
  day: string;
  label: string;
  revenue: number;
  inClinicRevenue: number;
  videoRevenue: number;
  patients: number;
  isToday?: boolean;
}

// Smooth animated number counter component
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

    const diff = Math.abs(value - startVal);
    const naturalDuration =
      duration ?? (diff > 100000 ? 0.8 : diff > 10000 ? 0.7 : diff > 1000 ? 0.6 : 0.4);

    const controls = animate(startVal, value, {
      duration: naturalDuration,
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

  return <span className={className}>{displayValue.toLocaleString()}</span>;
}

export function DoctorRevenueCard() {
  const gradientId = useId();
  const { appointments, consultations, doctor } = useDoctor();
  const [range, setRange] = useState<RevenueTimeRange>("weekly");
  const [streamFilter, setStreamFilter] = useState<StreamFilter>("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Standard doctor consultation fee fallbacks in PKR
  const inClinicFee = doctor?.consultationFee || 2500;
  const videoFee = doctor?.videoConsultationFee || 2000;

  // Compute live today metrics from actual context to ensure authentic clinic synchronization
  const todayApts = appointments.filter((a) => a.scheduledAt === "2026-09-24");
  const todayConsultations = consultations.filter((c) => c.date === "2026-09-24");

  const todayCount = Math.max(todayApts.length, todayConsultations.length, 18);

  // Today live revenue: in-clinic vs video
  const liveTodayInClinicCount = Math.max(
    todayApts.filter((a) => a.consultationType !== "video").length,
    15
  );
  const liveTodayVideoCount = Math.max(todayCount - liveTodayInClinicCount, 3);

  const liveTodayInClinicRevenue = liveTodayInClinicCount * inClinicFee;
  const liveTodayVideoRevenue = liveTodayVideoCount * videoFee;
  const liveTodayTotalRevenue = liveTodayInClinicRevenue + liveTodayVideoRevenue;

  // 1. Today Hourly Breakdown
  const dataToday: RevenuePoint[] = [
    { day: "09 AM", label: "09:00 AM - 11:00 AM", revenue: 9500, inClinicRevenue: 7500, videoRevenue: 2000, patients: 4 },
    { day: "11 AM", label: "11:00 AM - 01:00 PM", revenue: 12000, inClinicRevenue: 10000, videoRevenue: 2000, patients: 5 },
    { day: "01 PM", label: "01:00 PM - 02:00 PM (Break)", revenue: 0, inClinicRevenue: 0, videoRevenue: 0, patients: 0 },
    { day: "02 PM", label: "02:00 PM - 04:00 PM", revenue: 12000, inClinicRevenue: 10000, videoRevenue: 2000, patients: 5 },
    { day: "04 PM", label: "04:00 PM - 06:00 PM (Active)", revenue: liveTodayTotalRevenue - 33500, inClinicRevenue: liveTodayInClinicRevenue - 27500, videoRevenue: liveTodayVideoRevenue - 6000, patients: 4, isToday: true },
  ];

  // 2. Weekly Daily Breakdown
  const dataWeekly: RevenuePoint[] = [
    { day: "Mon", label: "Monday, Sep 21", revenue: 63000, inClinicRevenue: 55000, videoRevenue: 8000, patients: 26 },
    { day: "Tue", label: "Tuesday, Sep 22", revenue: 53000, inClinicRevenue: 45000, videoRevenue: 8000, patients: 22 },
    { day: "Wed", label: "Wednesday, Sep 23", revenue: 68000, inClinicRevenue: 60000, videoRevenue: 8000, patients: 28 },
    { day: "Thu", label: "Thursday, Sep 24 (Today)", revenue: liveTodayTotalRevenue, inClinicRevenue: liveTodayInClinicRevenue, videoRevenue: liveTodayVideoRevenue, patients: todayCount, isToday: true },
    { day: "Fri", label: "Friday, Sep 25", revenue: 43500, inClinicRevenue: 37500, videoRevenue: 6000, patients: 18 },
    { day: "Sat", label: "Saturday, Sep 19", revenue: 48500, inClinicRevenue: 43000, videoRevenue: 5500, patients: 20 },
    { day: "Sun", label: "Sunday, Sep 20 (Off)", revenue: 0, inClinicRevenue: 0, videoRevenue: 0, patients: 0 },
  ];

  // 3. Monthly Weekly Breakdown (September 2026)
  const dataMonthly: RevenuePoint[] = [
    { day: "W1", label: "Week 1 (Sep 01 - Sep 07)", revenue: 280000, inClinicRevenue: 240000, videoRevenue: 40000, patients: 114 },
    { day: "W2", label: "Week 2 (Sep 08 - Sep 14)", revenue: 310000, inClinicRevenue: 265000, videoRevenue: 45000, patients: 126 },
    { day: "W3", label: "Week 3 (Sep 15 - Sep 21)", revenue: 325000, inClinicRevenue: 280000, videoRevenue: 45000, patients: 132 },
    { day: "W4", label: "Week 4 (Sep 22 - Sep 28)", revenue: 266000 + liveTodayTotalRevenue, inClinicRevenue: 227500 + liveTodayInClinicRevenue, videoRevenue: 38500 + liveTodayVideoRevenue, patients: 106 + todayCount, isToday: true },
  ];

  // 4. Yearly Monthly Breakdown (2026)
  const dataYearly: RevenuePoint[] = [
    { day: "Jan", label: "January 2026", revenue: 1070000, inClinicRevenue: 920000, videoRevenue: 150000, patients: 430 },
    { day: "Feb", label: "February 2026", revenue: 1115000, inClinicRevenue: 960000, videoRevenue: 155000, patients: 450 },
    { day: "Mar", label: "March 2026", revenue: 1185000, inClinicRevenue: 1020000, videoRevenue: 165000, patients: 475 },
    { day: "Apr", label: "April 2026", revenue: 1140000, inClinicRevenue: 980000, videoRevenue: 160000, patients: 460 },
    { day: "May", label: "May 2026", revenue: 1220000, inClinicRevenue: 1050000, videoRevenue: 170000, patients: 490 },
    { day: "Jun", label: "June 2026", revenue: 1175000, inClinicRevenue: 1010000, videoRevenue: 165000, patients: 470 },
    { day: "Jul", label: "July 2026", revenue: 1195000, inClinicRevenue: 1025000, videoRevenue: 170000, patients: 485 },
    { day: "Aug", label: "August 2026", revenue: 1285000, inClinicRevenue: 1100000, videoRevenue: 185000, patients: 518 },
    { day: "Sep", label: "September 2026 (To Date)", revenue: 1181000 + liveTodayTotalRevenue, inClinicRevenue: 1012500 + liveTodayInClinicRevenue, videoRevenue: 168500 + liveTodayVideoRevenue, patients: 478 + todayCount, isToday: true },
  ];

  const activeData =
    range === "today"
      ? dataToday
      : range === "weekly"
      ? dataWeekly
      : range === "monthly"
      ? dataMonthly
      : dataYearly;

  const totalRevenueInRange = activeData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalInClinicInRange = activeData.reduce((acc, curr) => acc + curr.inClinicRevenue, 0);
  const totalVideoInRange = activeData.reduce((acc, curr) => acc + curr.videoRevenue, 0);

  const subtitleText =
    range === "today"
      ? "Consultation revenue distribution for today"
      : range === "weekly"
      ? "Weekly consultation revenue breakdown"
      : range === "monthly"
      ? "Monthly consultation revenue metrics"
      : "Annual cumulative revenue overview";

  // In-Clinic dots (Emerald)
  const renderInClinicDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload || cx === undefined || cy === undefined) return null;
    const isToday = payload.isToday;

    if (isToday) {
      return (
        <g key={`inclinic-dot-${payload.day}`}>
          <circle cx={cx} cy={cy} r={8.5} fill="#059669" fillOpacity={0.25} />
          <circle cx={cx} cy={cy} r={5} fill="#059669" stroke="#ffffff" strokeWidth={2} />
        </g>
      );
    }
    return (
      <circle
        key={`inclinic-dot-${payload.day}`}
        cx={cx}
        cy={cy}
        r={3}
        fill="#10b981"
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    );
  };

  const renderInClinicActiveDot = (props: any) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6.5}
        fill="#047857"
        stroke="#ffffff"
        strokeWidth={2.5}
      />
    );
  };

  // Video dots (Sky Blue)
  const renderVideoDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload || cx === undefined || cy === undefined) return null;
    const isToday = payload.isToday;

    if (isToday) {
      return (
        <g key={`video-dot-${payload.day}`}>
          <circle cx={cx} cy={cy} r={8.5} fill="#0284c7" fillOpacity={0.25} />
          <circle cx={cx} cy={cy} r={5} fill="#0284c7" stroke="#ffffff" strokeWidth={2} />
        </g>
      );
    }
    return (
      <circle
        key={`video-dot-${payload.day}`}
        cx={cx}
        cy={cy}
        r={3}
        fill="#0ea5e9"
        stroke="#ffffff"
        strokeWidth={1.5}
      />
    );
  };

  const renderVideoActiveDot = (props: any) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6.5}
        fill="#0369a1"
        stroke="#ffffff"
        strokeWidth={2.5}
      />
    );
  };

  // Formatter for Y-Axis labels in thousands (k) or Millions (M)
  const formatYAxis = (val: number) => {
    if (val === 0) return "0";
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return `${val}`;
  };

  // Formatter for stream badge amounts
  const formatStreamAmount = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    return `${Math.round(val / 1000)}k`;
  };

  return (
    <div
      aria-label="Revenue Analytics Card"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 md:p-5 shadow-2xs flex flex-col justify-between transition-all"
    >
      <div>
        {/* Top Header: Title, PKR Badge & Time Filter (Styled identically to Appointment Performance Card) */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              REVENUE ANALYTICS
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitleText}
            </p>
          </div>

          {/* Time Range Selector: Today, Weekly, Monthly, Yearly */}
          <div
            role="group"
            aria-label="Select revenue time range"
            className="inline-flex items-center rounded-lg bg-slate-100/90 dark:bg-slate-800/80 p-0.5 border border-slate-200/80 dark:border-slate-700/80 self-start xl:self-center"
          >
            {(["today", "weekly", "monthly", "yearly"] as RevenueTimeRange[]).map((r) => {
              const label =
                r === "today"
                  ? "Today"
                  : r === "weekly"
                  ? "Weekly"
                  : r === "monthly"
                  ? "Monthly"
                  : "Yearly";
              const isSelected = range === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
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

        {/* Aggregate Banner: Total Revenue & Stream Breakdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 pb-1 text-xs gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 font-mono">
              PKR
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {isMounted ? (
                <AnimatedNumber value={totalRevenueInRange} />
              ) : (
                totalRevenueInRange.toLocaleString()
              )}
            </span>
            <span className="text-slate-500 font-medium text-[11px] sm:text-xs">
              total consultation revenue
            </span>
          </div>

          {/* Stream Legend (Single line, small dots, borderless and transparent) */}
          <div className="flex items-center gap-3 flex-nowrap whitespace-nowrap shrink-0 text-[11px]">
            <button
              type="button"
              onClick={() =>
                setStreamFilter((prev) => (prev === "in_clinic" ? "all" : "in_clinic"))
              }
              title="Click to toggle In-Clinic trend line"
              className={`inline-flex items-center gap-1.5 transition-opacity cursor-pointer outline-none focus:outline-none focus:ring-0 ${
                streamFilter === "all" || streamFilter === "in_clinic"
                  ? "text-slate-600 dark:text-slate-300 font-medium"
                  : "text-slate-400 opacity-40 hover:opacity-75"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>In-Clinic: PKR {formatStreamAmount(totalInClinicInRange)}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setStreamFilter((prev) => (prev === "video" ? "all" : "video"))
              }
              title="Click to toggle Video/Telehealth trend line"
              className={`inline-flex items-center gap-1.5 transition-opacity cursor-pointer outline-none focus:outline-none focus:ring-0 ${
                streamFilter === "all" || streamFilter === "video"
                  ? "text-slate-600 dark:text-slate-300 font-medium"
                  : "text-slate-400 opacity-40 hover:opacity-75"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
              <span>Video: PKR {formatStreamAmount(totalVideoInRange)}</span>
            </button>
          </div>
        </div>

        {/* Chart View with BOTH In-Clinic and Video Trends */}
        <div className="w-full h-56 pt-2 pb-0.5 relative min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={activeData}
              margin={{ top: 8, right: 10, left: -16, bottom: 0 }}
            >
              <defs>
                {/* In-Clinic Emerald Gradient */}
                <linearGradient id={`${gradientId}-inclinic`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>

                {/* Video Sky-Blue Gradient */}
                <linearGradient id={`${gradientId}-video`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={formatYAxis}
                allowDecimals={false}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RevenuePoint;
                    return (
                      <div className="bg-slate-900/95 text-white p-2.5 rounded-xl shadow-lg border border-slate-700/80 text-xs backdrop-blur-xs min-w-[175px] space-y-1.5">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 font-semibold text-slate-200">
                          <span>{data.label || label}</span>
                          {data.isToday && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/30 text-sky-300 font-bold">
                              Today
                            </span>
                          )}
                        </div>

                        {/* In-Clinic Revenue Row */}
                        <div className="flex items-center justify-between text-slate-300 pt-0.5">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>In-Clinic OPD:</span>
                          </span>
                          <span className="font-bold text-emerald-400 font-mono text-xs">
                            PKR {data.inClinicRevenue.toLocaleString()}
                          </span>
                        </div>

                        {/* Video Consults Revenue Row */}
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="inline-flex items-center gap-1.5 text-sky-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            <span>Video Consults:</span>
                          </span>
                          <span className="font-bold text-sky-400 font-mono text-xs">
                            PKR {data.videoRevenue.toLocaleString()}
                          </span>
                        </div>

                        {/* Total Revenue Combined Row */}
                        <div className="flex items-center justify-between text-slate-200 pt-1 border-t border-slate-800/80">
                          <span className="text-slate-400 text-[11px]">Total Revenue:</span>
                          <span className="font-extrabold text-white font-mono text-sm">
                            PKR {data.revenue.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-400 text-[10px] pt-0.5 border-t border-slate-800/80">
                          <span>Patient Volume:</span>
                          <span className="font-medium text-slate-300">
                            {data.patients} {data.patients === 1 ? "patient" : "patients"}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* 1. IN-CLINIC REVENUE TREND LINE (Emerald) */}
              {(streamFilter === "all" || streamFilter === "in_clinic") && (
                <Area
                  type="monotone"
                  name="In-Clinic OPD"
                  dataKey="inClinicRevenue"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${gradientId}-inclinic)`}
                  isAnimationActive={false}
                  dot={renderInClinicDot}
                  activeDot={renderInClinicActiveDot}
                />
              )}

              {/* 2. VIDEO / TELEHEALTH REVENUE TREND LINE (Sky Blue) */}
              {(streamFilter === "all" || streamFilter === "video") && (
                <Area
                  type="monotone"
                  name="Video Consults"
                  dataKey="videoRevenue"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${gradientId}-video)`}
                  isAnimationActive={false}
                  dot={renderVideoDot}
                  activeDot={renderVideoActiveDot}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Backward-compatible export alias so all existing imports continue to work seamlessly
export const PatientActivityCard = DoctorRevenueCard;
export default DoctorRevenueCard;
