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
        return <Shield className="text-blue-500" size={20} />;
      case "Professional":
        return <ShieldCheck className="text-emerald-500" size={20} />;
      case "Enterprise":
        return <ShieldAlert className="text-purple-500" size={20} />;
      default:
        return <ShieldQuestion className="text-gray-500 dark:text-gray-400" size={20} />;
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
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Subscription Overview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Plan distribution across clinics</p>
        </div>
        <Link href="/admin/billing" className="text-sm font-medium text-[#0ea5e9] hover:text-[#0284c7] transition-colors hover:underline">
          View All &rarr;
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
            <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
              {getIcon(item.plan)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {item.plan} Plan
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={clsx("h-2 rounded-full", getBarColor(item.plan))}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                ></motion.div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.count} clinics</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-4">
        <div className="flex-1 bg-emerald-50 rounded-lg p-3">
          <p className="text-xs text-emerald-600 font-medium mb-1">Active</p>
          <p className="text-xl font-bold text-emerald-700">{subscriptionOverview.status.active}</p>
        </div>
        <div className="flex-1 bg-[#f8f9fa] dark:bg-gray-900mber-50 rounded-lg p-3">
          <p className="text-xs text-amber-600 font-medium mb-1">Expiring Soon</p>
          <p className="text-xl font-bold text-amber-700">{subscriptionOverview.status.expiringSoon}</p>
        </div>
      </div>
    </div>
  );
}


