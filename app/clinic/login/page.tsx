"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";

export default function ClinicLoginPage() {
  const router = useRouter();
  const { clinicLogin, application } = useClinicAuth();

  const [email, setEmail] = useState(application?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid official clinic email.");
      return;
    }
    if (!password) {
      setError("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = clinicLogin(email, password);
      setIsSubmitting(false);

      if (res.success) {
        router.push("/clinic/dashboard");
      } else {
        setError(res.error || "Login failed. Please check credentials or approval status.");
      }
    }, 600);
  };

  const handleDemoFill = () => {
    if (application) {
      setEmail(application.email);
      setPassword("admin123");
    } else {
      setEmail("demo@clinic.pk");
      setPassword("admin123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-100 dark:from-slate-950 dark:via-[#0c1424] dark:to-black text-slate-900 dark:text-white selection:bg-sky-500 selection:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Digital<span className="text-sky-600 dark:text-sky-400">Medical</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
              Clinic Portal Login
            </span>
          </div>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Sign In to Your Clinic Desk
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Manage your doctors, appointment schedules, and pharmacy inventory.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-2xl shadow-sky-950/10 dark:shadow-cyan-950/20 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-5">
          {/* Quick Demo Helper */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 dark:from-slate-800 dark:to-sky-950/50 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span className="text-slate-600 dark:text-slate-300">Test with Demo Credentials</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-sm"
            >
              Fill Demo
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                Clinic Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clinic@digitalmedical.pk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/clinic/status"
                  className="text-[11px] font-semibold text-sky-600 hover:underline"
                >
                  Check Status?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In to Clinic Desk"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Register Link */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Want to register your medical clinic?{" "}
            <Link
              href="/clinic/register"
              className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Register Clinic Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
