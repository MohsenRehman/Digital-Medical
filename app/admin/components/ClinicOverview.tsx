"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
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

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[450px]">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Clinic Overview</h3>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] text-gray-700 dark:text-gray-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] text-gray-700 dark:text-gray-200"
          >
            <option value="All Plans">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 w-full mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }} 
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                color: "#374151",
              }}
              itemStyle={{ color: "#374151" }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ top: -10, right: 20, fontSize: "12px", color: "#6b7280" }}
            />
            <Bar dataKey="Total Clinics" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


