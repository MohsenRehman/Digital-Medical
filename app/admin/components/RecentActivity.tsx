import React from "react";
import { recentActivity } from "../data/mockData";
import { CheckCircle, UserPlus, CreditCard, RefreshCw } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="text-emerald-500" size={18} />;
      case "registration":
        return <UserPlus className="text-blue-500" size={18} />;
      case "subscription":
        return <RefreshCw className="text-amber-500" size={18} />;
      case "payment":
        return <CreditCard className="text-purple-500" size={18} />;
      default:
        return <CheckCircle className="text-gray-500 dark:text-gray-400" size={18} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "approval":
        return "bg-emerald-50";
      case "registration":
        return "bg-blue-50";
      case "subscription":
        return "bg-[#f8f9fa] dark:bg-gray-900mber-50";
      case "payment":
        return "bg-purple-50";
      default:
        return "bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Recent Platform Activity</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest platform activities</p>
        </div>
        <Link href="/admin/reports" className="text-sm font-medium text-[#0ea5e9] hover:text-[#0284c7] transition-colors hover:underline">
          View All &rarr;
        </Link>
      </div>

      <div className="relative pl-2">
        {/* Timeline line */}
        <div className="absolute top-4 bottom-4 left-[1.15rem] w-px bg-gray-200"></div>
        
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
          {recentActivity.map((activity, index) => (
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
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-[#f0f4ff]",
                  getBgColor(activity.type)
                )}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="pt-1.5 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{activity.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}


