"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { clinicGrowthData } from "../data/mockData";

export default function ClinicGrowthChart() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');
  const lineColor = isDark ? "#10b981" : "#0084d1";
  const gridColor = isDark ? "#27272a" : "#f1f5f9";
  const textColor = isDark ? "#a1a1aa" : "#64748b";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#27272a" : "#e2e8f0";
  const tooltipText = isDark ? "#fafafa" : "#1e293b";

  return (
    <div className="bg-white dark:bg-[#131315] p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-50">Clinic Growth</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Total registered clinics across the platform over time.
        </p>
      </div>

      <div className="flex-1 w-full min-h-[300px] focus:outline-none" style={{ outline: 'none', border: 'none' }}>
        <ResponsiveContainer width="100%" height="100%" className="focus:outline-none" style={{ outline: 'none', border: 'none' }}>
          <LineChart
            data={clinicGrowthData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            style={{ outline: 'none', border: 'none' }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderRadius: "12px",
                border: `1px solid ${tooltipBorder}`,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: tooltipText
              }}
              itemStyle={{ color: tooltipText }}
            />
            <Line
              type="monotone"
              dataKey="clinics"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: tooltipBg }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


