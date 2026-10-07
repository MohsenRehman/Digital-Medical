import React from "react";
import { billingSummary } from "../data/mockData";
import { CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BillingSummary() {
  return (
    <div className="bg-white dark:bg-[#131315] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-50">Billing Summary</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Platform billing status</p>
        </div>
        <Link href="/admin/billing" className="group relative inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0084d1] dark:bg-zinc-800 px-4 py-1.5 text-xs font-bold text-white dark:text-zinc-200 shadow-sm hover:bg-[#0073b6] dark:hover:bg-zinc-700 transition-all duration-300 border border-transparent dark:border-zinc-700 dark:hover:border-zinc-600">
          <span>View All</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-6 mb-6 text-center border border-slate-200 dark:border-zinc-800">
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-1 font-medium">Total Outstanding</p>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-zinc-50 tracking-tight">{billingSummary.outstanding}</h2>
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
          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="text-emerald-500" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Paid Payments</span>
          </div>
          <span className="text-base font-semibold text-slate-800 dark:text-zinc-50">{billingSummary.paidPayments}</span>
        </motion.div>

        <motion.div 
          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Clock className="text-amber-500" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Pending Payments</span>
          </div>
          <span className="text-base font-semibold text-slate-800 dark:text-zinc-50">{billingSummary.pendingPayments}</span>
        </motion.div>

        <motion.div 
          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <XCircle className="text-red-500" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Failed Payments</span>
          </div>
          <span className="text-base font-semibold text-slate-800 dark:text-zinc-50">{billingSummary.failedPayments}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}


