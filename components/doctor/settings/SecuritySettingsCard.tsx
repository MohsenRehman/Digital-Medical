"use client";

import React, { useState } from "react";
import {
  Key,
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Lock,
  LogOut,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { DoctorProfile, ActiveSessionItem } from "@/lib/types/doctor";

interface SecuritySettingsCardProps {
  doctor: DoctorProfile;
  onSave: (updates: Partial<DoctorProfile>) => void;
}

export default function SecuritySettingsCard({
  doctor,
  onSave,
}: SecuritySettingsCardProps) {
  const currentSecurity = doctor.securitySettings || {
    twoFactorEnabled: true,
    twoFactorMethod: "app",
    lastPasswordChange: "15 Aug 2026",
    activeSessions: [
      {
        id: "sess-01",
        device: "Desktop PC",
        browser: "Chrome 128 (Windows 11)",
        location: "Peshawar, Khyber Pakhtunkhwa",
        ip: "182.185.142.61",
        lastActive: "Just now",
        current: true,
      },
      {
        id: "sess-02",
        device: "iPhone 15 Pro",
        browser: "Digital Medical Doctor App (iOS 18)",
        location: "Islamabad, ICT",
        ip: "111.68.98.22",
        lastActive: "2 hours ago",
        current: false,
      },
    ],
  };

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentSecurity.twoFactorEnabled);
  const [sessions, setSessions] = useState<ActiveSessionItem[]>(currentSecurity.activeSessions);

  // Password change modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  // Sign out modal
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [signoutSuccess, setSignoutSuccess] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!currentPassword) {
      setPassError("Please provide your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPassError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    setPassSuccess(true);
    setPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleSignOutOthers = () => {
    setSessions(sessions.filter((s) => s.current));
    setSignOutModalOpen(false);
    setSignoutSuccess(true);
    setTimeout(() => setSignoutSuccess(false), 3000);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Account Security & Authentication
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Password security, Two-Factor Authentication (MFA), and active device sessions.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          SECURITY & PRIVACY
        </span>
      </div>

      {passSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Doctor account password updated successfully.</span>
        </div>
      )}

      {signoutSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>All other device sessions have been terminated.</span>
        </div>
      )}

      {/* Password & MFA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Password Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Account Password
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Last modified on: <strong className="text-slate-700 dark:text-slate-300">{currentSecurity.lastPasswordChange}</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Protect your clinical prescription authority by rotating passwords regularly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs self-start"
          >
            Change Password
          </button>
        </div>

        {/* 2FA Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Two-Factor Authentication (2FA)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {twoFactorEnabled ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Method: <strong>Authenticator App (TOTP / Google Authenticator)</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Requires a 6-digit one-time passcode upon every new browser sign-in.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              onSave({
                securitySettings: {
                  ...currentSecurity,
                  twoFactorEnabled: !twoFactorEnabled,
                },
              });
            }}
            className={`px-4 py-2 rounded-xl font-semibold text-xs self-start border transition-colors ${
              twoFactorEnabled
                ? "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {twoFactorEnabled ? "Disable Two-Factor" : "Enable Two-Factor"}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
            Active Logged-in Devices ({sessions.length})
          </label>
          {sessions.length > 1 && (
            <button
              type="button"
              onClick={() => setSignOutModalOpen(true)}
              className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out All Other Devices</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-850 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                  {sess.device.includes("iPhone") || sess.device.includes("Mobile") ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{sess.device}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{sess.browser}</span>
                    {sess.current && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                        This Session
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sess.location} • IP {sess.ip} • Active {sess.lastActive}
                  </p>
                </div>
              </div>

              {!sess.current && (
                <button
                  type="button"
                  onClick={() => setSessions(sessions.filter((s) => s.id !== sess.id))}
                  className="px-2.5 py-1 rounded-lg text-[11px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Password Change Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <form
            onSubmit={handlePasswordSubmit}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Update Account Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passError && (
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  New Password (Minimum 8 characters)
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sign Out Others Confirmation Modal */}
      {signOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Sign Out All Other Sessions?
                </h3>
                <p className="text-xs text-slate-500">Device Security</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All other computers and mobile devices currently logged into your doctor account will be immediately signed out. You will remain signed in on this browser.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSignOutModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOutOthers}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
