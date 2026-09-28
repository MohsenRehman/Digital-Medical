"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Send,
} from "lucide-react";
import { DoctorReview } from "@/lib/types/doctor";

interface PatientReviewsTabProps {
  reviews: DoctorReview[];
  rating: number;
  reviewCount: number;
}

export default function PatientReviewsTab({
  reviews,
  rating,
  reviewCount,
}: PatientReviewsTabProps) {
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeReviews, setActiveReviews] = useState<DoctorReview[]>(reviews);

  const starBreakdown = [
    { stars: 5, count: 340, percent: 88 },
    { stars: 4, count: 32, percent: 8 },
    { stars: 3, count: 8, percent: 2 },
    { stars: 2, count: 3, percent: 1 },
    { stars: 1, count: 1, percent: 1 },
  ];

  const handleSendReply = (revId: string) => {
    if (!replyText.trim()) return;

    setActiveReviews(
      activeReviews.map((r) =>
        r.id === revId ? { ...r, response: replyText.trim() } : r
      )
    );
    setReplyText("");
    setReplyOpenId(null);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Patient Feedback & Verified Clinical Reviews
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reviews left by patients who completed in-clinic and video consultations.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          PUBLIC PATIENT FEEDBACK
        </span>
      </div>

      {/* Aggregate Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-700/60">
          <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-mono">
            {rating}
          </span>
          <div className="flex items-center gap-1 text-amber-500 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on <strong>{reviewCount}</strong> verified patient encounters
          </p>
        </div>

        {/* Star Breakdown Bars */}
        <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
          {starBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 text-xs">
              <span className="w-8 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                {item.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-[11px] text-slate-400">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recent Patient Encounters
        </h3>

        {activeReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2.5 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {rev.patientName}
                </span>
                {rev.verifiedVisit && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Patient Visit</span>
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-400">{rev.date}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              &quot;{rev.comment}&quot;
            </p>

            {/* Doctor's Response */}
            {rev.response ? (
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/40 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300 text-[11px]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Response from Dr. Tariq Mahmood:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 pl-4">{rev.response}</p>
              </div>
            ) : (
              <div>
                {replyOpenId === rev.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a professional physician response..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyOpenId(null)}
                        className="px-3 py-1 rounded-lg border text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendReply(rev.id)}
                        className="px-3 py-1 rounded-lg bg-sky-600 text-white font-semibold text-xs flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post Response</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyOpenId(rev.id);
                      setReplyText("");
                    }}
                    className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1 pt-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply as Attending Physician</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
