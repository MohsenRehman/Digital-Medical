"use client";

import { useTheme } from "next-themes";
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import { useSearch } from "./SearchContext";

// Monthly data to match the provided image
const barChartData = [
  { name: "Apr", "Total Clinics": 15 },
  { name: "May", "Total Clinics": 22 },
  { name: "Jun", "Total Clinics": 12 },
  { name: "Jul", "Total Clinics": 18 },
  { name: "Aug", "Total Clinics": 26 },
  { name: "Sep", "Total Clinics": 15 },
  { name: "Oct", "Total Clinics": 32 },
  { name: "Nov", "Total Clinics": 24 },
  { name: "Dec", "Total Clinics": 21 },
  { name: "Jan", "Total Clinics": 38 },
  { name: "Feb", "Total Clinics": 32 },
  { name: "Mar", "Total Clinics": 44 },
];

export default function ClinicOverview() {
  const { searchTerm } = useSearch();
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    let multiplier = 1;
    if (statusFilter === "Active") multiplier *= 0.8;
    else if (statusFilter === "Pending") multiplier *= 0.15;
    else if (statusFilter === "Suspended") multiplier *= 0.05;

    if (planFilter === "Basic") multiplier *= 0.4;
    else if (planFilter === "Professional") multiplier *= 0.5;
    else if (planFilter === "Enterprise") multiplier *= 0.1;

    return barChartData.map(item => ({
      ...item,
      "Total Clinics": Math.max(1, Math.round(item["Total Clinics"] * multiplier))
    }));
  }, [statusFilter, planFilter]);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');
  const barColor = isDark ? "#10b981" : "#0084d1";
  const gridColor = isDark ? "#27272a" : "#f1f5f9";
  const textColor = isDark ? "#a1a1aa" : "#64748b";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#27272a" : "#e2e8f0";
  const tooltipText = isDark ? "#fafafa" : "#1e293b";

  return (
    <div className="bg-white/60 dark:bg-[#131315]/60 backdrop-blur-xl rounded-[20px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-white/50 dark:border-zinc-800 overflow-hidden flex flex-col h-[450px]">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-50">Clinic Overview</h3>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-zinc-700 text-slate-700 dark:text-zinc-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-zinc-700 text-slate-700 dark:text-zinc-200"
          >
            <option value="All Plans">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 w-full mt-2 relative focus:outline-none" style={{ outline: 'none', border: 'none' }}>
        <ResponsiveContainer width="100%" height="100%" className="focus:outline-none" style={{ outline: 'none', border: 'none' }}>
          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }} style={{ border: 'none', outline: 'none' }}>
            <defs>
              <linearGradient id="colorClinics" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={barColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={barColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 12 }} 
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "12px",
                color: tooltipText,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: tooltipText }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ top: -10, right: 20, fontSize: "12px", color: textColor }}
            />
            <Area 
              type="monotone" 
              dataKey="Total Clinics" 
              stroke={barColor} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorClinics)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


