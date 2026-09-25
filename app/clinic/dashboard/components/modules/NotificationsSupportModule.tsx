"use client";

import React, { useState } from "react";
import {
  Bell,
  LifeBuoy,
  History,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Send,
  MessageSquare,
  Search,
  Plus,
  ShieldAlert,
} from "lucide-react";
import {
  DashboardActivityLog,
  DashboardSupportTicket,
  DashboardNavModule,
} from "../../types";

interface NotificationsSupportModuleProps {
  initialTab?: "notifications" | "support" | "activity";
  activityLogs: DashboardActivityLog[];
  supportTickets: DashboardSupportTicket[];
  onSubmitTicket: (subject: string, category: DashboardSupportTicket["category"], message: string) => void;
  onClearNotifications: () => void;
}

export const NotificationsSupportModule: React.FC<NotificationsSupportModuleProps> = ({
  initialTab = "notifications",
  activityLogs,
  supportTickets,
  onSubmitTicket,
  onClearNotifications,
}) => {
  const [tab, setTab] = useState<"notifications" | "support" | "activity">(initialTab);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState<DashboardSupportTicket["category"]>("Technical");
  const [ticketMessage, setTicketMessage] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const notificationsList = [
    {
      id: "n-1",
      title: "Online Booking Confirmed",
      desc: "Fatima Noor booked Dr. Ayesha Malik for today 11:00 AM.",
      time: "10 mins ago",
      type: "info",
    },
    {
      id: "n-2",
      title: "Low Stock Alert: Softin 10mg",
      desc: "Only 14 packs left in pharmacy inventory. Reorder suggested.",
      time: "35 mins ago",
      type: "warning",
    },
    {
      id: "n-3",
      title: "Diagnostic Report Ready",
      desc: "Pathologist verified CBC report for Muhammad Usman.",
      time: "1 hour ago",
      type: "success",
    },
    {
      id: "n-4",
      title: "Cash Drawer Float Opened",
      desc: "Morning shift opened by Bilal Cheema with PKR 5,000 float.",
      time: "3 hours ago",
      type: "info",
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    onSubmitTicket(ticketSubject, ticketCategory, ticketMessage);
    setShowNewTicketModal(false);
    setTicketSubject("");
    setTicketMessage("");
  };

  return (
    <div className="space-y-6">
      {/* 1. TABS HEADER */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setTab("notifications")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === "notifications"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications & Alerts</span>
        </button>

        <button
          onClick={() => setTab("support")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === "support"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Support Desk & Tickets</span>
        </button>

        <button
          onClick={() => setTab("activity")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === "activity"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Activity Audit Trail</span>
        </button>
      </div>

      {/* 2. TAB: NOTIFICATIONS */}
      {tab === "notifications" && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              System Notifications
            </h3>
            <button
              onClick={onClearNotifications}
              className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
            >
              Mark All as Read
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {notificationsList.map((item) => (
              <div key={item.id} className="py-3.5 flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === "warning"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                      : item.type === "success"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
                  }`}
                >
                  {item.type === "warning" ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : item.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: SUPPORT DESK */}
      {tab === "support" && (
        <div className="space-y-4 max-w-3xl">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Technical Support & Super-Admin Desk
              </h3>
              <p className="text-xs text-slate-500">
                Direct ticketing pipeline with platform engineers
              </p>
            </div>

            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Your Open Tickets</h4>
            <div className="space-y-3 text-xs">
              {supportTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-600">{tkt.ticketNo}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {tkt.category}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white mt-1">
                        {tkt.subject}
                      </h5>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tkt.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Latest Response:</strong> {tkt.lastReply}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: ACTIVITY AUDIT TRAIL */}
      {tab === "activity" && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden max-w-4xl">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Compliance & Operational Audit Log
            </h3>
            <span className="text-xs text-slate-400">Read-only cryptographic event trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-3">Actor / User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Module</th>
                  <th className="py-3 px-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {activityLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {log.user}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-3 px-3 text-sky-600 dark:text-sky-400 font-medium">
                      {log.module}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. NEW TICKET MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Submit Support Request
              </h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Subject *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Thermal slip printer alignment issue"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Hardware/Printer">Hardware / Slip Printer</option>
                  <option value="Technical">Technical Bug / System</option>
                  <option value="Billing">Billing & Plan Addon</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue or steps to reproduce..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-24"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold cursor-pointer shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
