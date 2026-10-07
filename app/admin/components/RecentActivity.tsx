import React from "react";
import { CheckCircle, UserPlus, CreditCard, AlertCircle, Ban } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";

const newRecentActivities = [
  {
    id: "a1",
    title: "New Clinic Registration",
    description: "Life Care Clinic submitted a registration application.",
    type: "registration",
    time: "10 mins ago",
    status: "Pending"
  },
  {
    id: "a2",
    title: "Clinic Approved",
    description: "City Medical Clinic was approved by Super Admin.",
    type: "approval",
    time: "1 hour ago",
    status: "Approved"
  },
  {
    id: "a3",
    title: "Subscription Activated",
    description: "Health Plus Clinic activated its Professional plan.",
    type: "subscription",
    time: "2 hours ago",
    status: "Active"
  },
  {
    id: "a4",
    title: "Payment Received",
    description: "Payment received from Wellness Hospital.",
    type: "payment",
    time: "3 hours ago",
    status: "Completed"
  },
  {
    id: "a5",
    title: "Clinic Suspended",
    description: "A clinic account was suspended by Super Admin.",
    type: "suspension",
    time: "1 day ago",
    status: "Suspended"
  }
];

export default function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="text-[#0084d1] dark:text-emerald-500" size={16} />;
      case "registration":
        return <UserPlus className="text-blue-600 dark:text-blue-500" size={16} />;
      case "subscription":
        return <CheckCircle className="text-[#0084d1] dark:text-emerald-500" size={16} />;
      case "payment":
        return <CreditCard className="text-purple-600 dark:text-purple-500" size={16} />;
      case "suspension":
        return <Ban className="text-red-600 dark:text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-slate-500 dark:text-zinc-500" size={16} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "approval":
      case "subscription":
        return "bg-emerald-50 dark:bg-emerald-500/10";
      case "registration":
        return "bg-blue-50 dark:bg-blue-500/10";
      case "payment":
        return "bg-purple-50 dark:bg-purple-500/10";
      case "suspension":
        return "bg-red-50 dark:bg-red-500/10";
      default:
        return "bg-slate-100 dark:bg-zinc-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 px-2 py-0.5 rounded-full border dark:border-amber-500/20">{status}</span>;
      case "Approved":
      case "Active":
      case "Completed":
        return <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 px-2 py-0.5 rounded-full border dark:border-emerald-500/20">{status}</span>;
      case "Suspended":
        return <span className="text-[10px] font-semibold bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-500 px-2 py-0.5 rounded-full border dark:border-red-500/20">{status}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#131315] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-[450px]">
      <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-50">Recent Activities</h3>
        <Link href="/admin/reports" className="group relative inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0084d1] dark:bg-zinc-800 px-4 py-1.5 text-xs font-bold text-white dark:text-zinc-200 shadow-sm hover:bg-[#0073b6] dark:hover:bg-zinc-700 transition-all duration-300 border border-transparent dark:border-zinc-700 dark:hover:border-zinc-600"><span>View All</span><span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span></Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="relative pl-2">
          {/* Timeline line */}
          <div className="absolute top-4 bottom-4 left-[1.15rem] w-px bg-slate-200 dark:bg-zinc-800"></div>
          
          <motion.div 
            className="space-y-6 relative"
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
            {newRecentActivities.map((activity) => (
              <motion.div 
                key={activity.id} 
                className="flex gap-4"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                }}
              >
                <div
                  className={clsx(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-[3px] border-white dark:border-[#131315]",
                    getBgColor(activity.type)
                  )}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="pt-1 flex-1 pb-4 border-b border-slate-100 dark:border-zinc-800/50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1 leading-relaxed">{activity.description}</p>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}


