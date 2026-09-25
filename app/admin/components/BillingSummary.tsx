import React from "react";
import { billingSummary } from "../data/mockData";
import { CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BillingSummary() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Billing Summary</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Platform billing status</p>
        </div>
        <Link href="/admin/billing" className="text-sm font-medium text-[#0ea5e9] hover:text-[#0284c7] transition-colors hover:underline">
          View All &rarr;
        </Link>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6 text-center border border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Outstanding</p>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{billingSummary.outstanding}</h2>
      </div>

      <motion.div 
        className="space-y-4 flex-1"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <motion.div 
          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700">Paid Payments</span>
          </div>
          <span className="text-base font-bold text-gray-800 dark:text-gray-100">{billingSummary.paidPayments}</span>
        </motion.div>

        <motion.div 
          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f8f9fa] dark:bg-gray-900mber-100 flex items-center justify-center">
              <Clock className="text-amber-600" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700">Pending Payments</span>
          </div>
          <span className="text-base font-bold text-gray-800 dark:text-gray-100">{billingSummary.pendingPayments}</span>
        </motion.div>

        <motion.div 
          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="text-red-600" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700">Failed Payments</span>
          </div>
          <span className="text-base font-bold text-gray-800 dark:text-gray-100">{billingSummary.failedPayments}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}


