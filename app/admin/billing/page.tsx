"use client";

import React, { useState } from "react";
import { payments } from "../data/mockData";
import { Search, Receipt, DollarSign, XCircle, Clock } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.clinic.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        {/* Removed title as requested */}
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Rs. 845,000</h3>
          </div>
        </motion.div>
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Paid Payments</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">96</h3>
          </div>
        </motion.div>
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] dark:bg-gray-900mber-50 text-amber-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Payments</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">12</h3>
          </div>
        </motion.div>
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Failed Payments</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">4</h3>
          </div>
        </motion.div>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by invoice ID or clinic..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Clinic</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <motion.tbody 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="divide-y divide-gray-100"
            >
              {filteredPayments.map(payment => (
                <motion.tr 
                  key={payment.id} 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="hover:bg-gray-50 dark:bg-gray-800 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#0ea5e9]">
                    {payment.invoiceId}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">{payment.clinic}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{payment.plan}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Rs. {payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{payment.date}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-emerald-100 text-emerald-800": payment.status === "Paid",
                        "bg-[#f8f9fa] dark:bg-gray-900mber-100 text-amber-800": payment.status === "Pending",
                        "bg-red-100 text-red-800": payment.status === "Failed",
                      }
                    )}>
                      {payment.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filteredPayments.length === 0 && (
                <motion.tr variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No payments found.</td>
                </motion.tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

