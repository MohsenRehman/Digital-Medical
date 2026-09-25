"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  Clock,
  MapPin,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";

interface SettingsModuleProps {
  clinicName: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  onSaveSettings: (message: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  clinicName: initialName,
  city: initialCity,
  address: initialAddress,
  phone: initialPhone,
  email: initialEmail,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "shifts" | "rooms" | "notifications" | "security">("profile");

  // Profile Form state
  const [clinicName, setClinicName] = useState(initialName || "Al-Hakeem Medical Complex");
  const [city, setCity] = useState(initialCity || "Lahore");
  const [address, setAddress] = useState(initialAddress || "Plot 14-B, Main Boulevard, Gulberg III");
  const [phone, setPhone] = useState(initialPhone || "+92 42 35871928");
  const [email, setEmail] = useState(initialEmail || "admin@alhakeemclinic.pk");
  const [license, setLicense] = useState("PHC-LHR-91824");

  // Rooms
  const [rooms, setRooms] = useState([
    { id: "1", name: "Room 101", doctor: "Dr. Tariq Mahmood", type: "General Medicine" },
    { id: "2", name: "Room 104", doctor: "Dr. Ayesha Malik", type: "Pediatrics" },
    { id: "3", name: "Room 202", doctor: "Dr. Hamza Siddiqui", type: "Cardiology" },
    { id: "4", name: "Room 107", doctor: "Dr. Maryam Khalid", type: "Gynecology" },
  ]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState("Consultation");

  // Notifications
  const [whatsappConfirmations, setWhatsappConfirmations] = useState(true);
  const [smsTokenAlerts, setSmsTokenAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings("Clinic profile information updated successfully.");
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setRooms([
      ...rooms,
      {
        id: `${Date.now()}`,
        name: newRoomName.trim(),
        doctor: "Unassigned",
        type: newRoomType,
      },
    ]);
    setNewRoomName("");
    onSaveSettings("Consultation room added to clinic directory.");
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
    onSaveSettings("Room removed from directory.");
  };

  return (
    <div className="space-y-6">
      {/* 1. TABS HEADER */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          Clinic Profile & Licencing
        </button>
        <button
          onClick={() => setActiveTab("shifts")}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "shifts"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          Operating Hours & Shifts
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "rooms"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          Consultation Rooms ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "notifications"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          SMS & WhatsApp Alerts
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          Account Security
        </button>
      </div>

      {/* 2. TAB: CLINIC PROFILE */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 max-w-2xl text-xs"
        >
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Official Clinic Profile
            </h3>
            <p className="text-slate-500">
              Details printed on patient token receipts and online booking cards
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Clinic Name *
            </label>
            <input
              type="text"
              required
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Healthcare Commission / PMDC License
              </label>
              <input
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Physical Street Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Reception Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Clinic Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. TAB: OPERATING HOURS & SHIFTS */}
      {activeTab === "shifts" && (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 max-w-2xl text-xs">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Clinic Working Schedule
            </h3>
            <p className="text-slate-500">OPD hours available for online patient bookings</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { day: "Monday — Friday", hours: "08:00 AM — 10:00 PM", status: "Active" },
              { day: "Saturday", hours: "09:00 AM — 09:00 PM", status: "Active" },
              { day: "Sunday", hours: "10:00 AM — 04:00 PM (Emergency Only)", status: "Limited" },
            ].map((shift, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {shift.day}
                  </span>
                  <span className="text-[11px] text-slate-500">{shift.hours}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  {shift.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: ROOMS */}
      {activeTab === "rooms" && (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 max-w-2xl text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Consultation Rooms Directory
              </h3>
              <p className="text-slate-500">Assigned rooms on electronic token display screens</p>
            </div>
          </div>

          {/* Add Room Mini Form */}
          <form
            onSubmit={handleAddRoom}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center gap-2.5"
          >
            <input
              type="text"
              required
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="e.g. Room 205"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold flex-1"
            />
            <select
              value={newRoomType}
              onChange={(e) => setNewRoomType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="Consultation">Consultation Room</option>
              <option value="Procedure">Procedure / Dressing</option>
              <option value="Triage">Triage Station</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold cursor-pointer"
            >
              Add Room
            </button>
          </form>

          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between"
              >
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    {room.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {room.type} • Assigned: {room.doctor}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Remove Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 max-w-2xl text-xs">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Automated Patient & Staff Alerts
            </h3>
            <p className="text-slate-500">Digital communication preferences</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  WhatsApp Appointment Slips
                </span>
                <span className="text-slate-500 text-[11px]">
                  Instantly send booking token and Google Map pin to patient's WhatsApp
                </span>
              </div>
              <input
                type="checkbox"
                checked={whatsappConfirmations}
                onChange={(e) => {
                  setWhatsappConfirmations(e.target.checked);
                  onSaveSettings("WhatsApp preference saved.");
                }}
                className="w-4 h-4 rounded text-sky-600 cursor-pointer accent-sky-600"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  SMS Queue Token Reminders
                </span>
                <span className="text-slate-500 text-[11px]">
                  Alert patient when 3 patients remain before their token
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsTokenAlerts}
                onChange={(e) => {
                  setSmsTokenAlerts(e.target.checked);
                  onSaveSettings("SMS alert preference saved.");
                }}
                className="w-4 h-4 rounded text-sky-600 cursor-pointer accent-sky-600"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Pharmacy Low-Stock Daily Digest
                </span>
                <span className="text-slate-500 text-[11px]">
                  Notify clinic admin via email when stock drops below threshold
                </span>
              </div>
              <input
                type="checkbox"
                checked={lowStockAlerts}
                onChange={(e) => {
                  setLowStockAlerts(e.target.checked);
                  onSaveSettings("Low stock alert preference saved.");
                }}
                className="w-4 h-4 rounded text-sky-600 cursor-pointer accent-sky-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB: SECURITY */}
      {activeTab === "security" && (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 max-w-2xl text-xs">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Clinic Authentication & Passwords
            </h3>
            <p className="text-slate-500">Security credentials for clinic administrator account</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSaveSettings("Clinic password successfully updated.")}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
