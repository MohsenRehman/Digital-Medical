import React from "react";
import { subscriptionOverview } from "../data/mockData";
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SubscriptionOverview() {
  const getIcon = (plan: string) => {
    switch (plan) {
      case "Basic":
        return <Shield className="text-blue-500" size={18} />;
      case "Professional":
        return <ShieldCheck className="text-emerald-500" size={18} />;
      case "Enterprise":
        return <ShieldAlert className="text-purple-500" size={18} />;
      default:
        return <ShieldQuestion className="text-slate-800 dark:text-zinc-500" size={18} />;
    }
  };

  const getBarColor = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-500";
      case "Professional":
        return "bg-emerald-500";
      case "Enterprise":
        return "bg-purple-500";
      default:
        return "bg-zinc-500";
    }
  };

  return (
    <div className="bg-white/60 dark:bg-[#131315]/60 backdrop-blur-xl rounded-[20px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-white/50 dark:border-zinc-800 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-50">Subscription Overview</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Plan distribution across clinics</p>
        </div>
        <Link href="/admin/billing" className="group relative inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0084d1] dark:bg-zinc-800 px-4 py-1.5 text-xs font-bold text-white dark:text-zinc-200 shadow-sm hover:bg-[#0073b6] dark:hover:bg-zinc-700 transition-all duration-300 border border-transparent dark:border-zinc-700 dark:hover:border-zinc-600">
          <span>View All</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>

      <motion.div 
        className="space-y-5 flex-1"
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
        {subscriptionOverview.distribution.map((item, i) => (
          <motion.div 
            key={i} 
            className="flex items-center gap-4"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
              {getIcon(item.plan)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">
                  {item.plan} Plan
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-50 dark:bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className={clsx("h-1.5 rounded-full", getBarColor(item.plan))}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                ></motion.div>
              </div>
              <p className="text-xs text-slate-800 dark:text-zinc-500 mt-2">{item.count} clinics</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-zinc-800 flex gap-4">
        <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-xs text-emerald-500 font-medium mb-1">Active</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-zinc-50">{subscriptionOverview.status.active}</p>
        </div>
        <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-amber-500 font-medium mb-1">Expiring Soon</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-zinc-50">{subscriptionOverview.status.expiringSoon}</p>
        </div>
      </div>
    </div>
  );
}


