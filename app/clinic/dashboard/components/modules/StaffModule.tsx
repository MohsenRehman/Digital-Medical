"use client";

import React, { useState } from "react";
import {
  UserCog,
  Plus,
  Shield,
  Check,
  X,
  Phone,
  Mail,
  Clock,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { DashboardStaff } from "../../types";

interface StaffModuleProps {
  staff: DashboardStaff[];
  onAddStaff: (newStaff: DashboardStaff) => void;
}

export const StaffModule: React.FC<StaffModuleProps> = ({ staff, onAddStaff }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<DashboardStaff["role"]>("Receptionist");
  const [phone, setPhone] = useState("+92 3");
  const [email, setEmail] = useState("");
  const [shift, setShift] = useState<DashboardStaff["shift"]>("Morning (08 AM - 04 PM)");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: DashboardStaff = {
      id: `stf-${Date.now()}`,
      employeeId: `EMP-0${Math.floor(50 + Math.random() * 40)}`,
      name: name.trim(),
      role,
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@clinic.pk`,
      shift,
      status: "Active",
      joiningDate: "Today",
      department:
        role === "Receptionist"
          ? "Front Desk"
          : role === "Cashier"
          ? "Billing Counter"
          : role === "Pharmacist"
          ? "In-house Pharmacy"
          : role === "Lab Technician"
          ? "Diagnostic Lab"
          : "Clinical Triage",
    };

    onAddStaff(newMember);
    setShowAddModal(false);
    setName("");
    setPhone("+92 3");
    setEmail("");
  };

  // Role permissions matrix
  const permissionsMatrix = [
    { module: "Live OPD Queue & Tokens", receptionist: true, cashier: false, nurse: true, pharmacist: false, lab: false, admin: true },
    { module: "Patient Check-in & Register", receptionist: true, cashier: false, nurse: true, pharmacist: false, lab: false, admin: true },
    { module: "Clinical Prescriptions (Read)", receptionist: false, cashier: false, nurse: true, pharmacist: true, lab: false, admin: true },
    { module: "Pharmacy Medicine Dispensing", receptionist: false, cashier: false, nurse: false, pharmacist: true, lab: false, admin: true },
    { module: "Laboratory Specimen & Reports", receptionist: false, cashier: false, nurse: false, pharmacist: false, lab: true, admin: true },
    { module: "Billing & Cash Collection", receptionist: true, cashier: true, nurse: false, pharmacist: false, lab: false, admin: true },
    { module: "Clinic Analytics & Settings", receptionist: false, cashier: false, nurse: false, pharmacist: false, lab: false, admin: true },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ADD STAFF */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Staff Members & Role Permissions
          </h3>
          <p className="text-xs text-slate-500">
            {staff.length} Active Clinic Employees • Department Shift Rosters
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* 2. STAFF DIRECTORY TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-3">Staff Name</th>
                <th className="py-3 px-3">Designation & Dept</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Shift Hours</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Joining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {staff.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                    {member.employeeId}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {member.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 inline-block">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {member.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-800 dark:text-slate-200 font-mono block">
                      {member.phone}
                    </span>
                    <span className="text-[10px] text-slate-400">{member.email}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {member.shift}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                    {member.joiningDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. ACCESS CONTROL MATRIX */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Role-Based Access Control (RBAC) Matrix</span>
            </h4>
            <p className="text-xs text-slate-500">
              Department permissions enforced strictly at the database & API boundary
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5">Clinic Module</th>
                <th className="py-2.5 text-center">Receptionist</th>
                <th className="py-2.5 text-center">Cashier</th>
                <th className="py-2.5 text-center">Nurse</th>
                <th className="py-2.5 text-center">Pharmacist</th>
                <th className="py-2.5 text-center">Lab Tech</th>
                <th className="py-2.5 text-center">Clinic Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                    {row.module}
                  </td>
                  <td className="py-2.5 text-center">
                    {row.receptionist ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {row.cashier ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {row.nurse ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {row.pharmacist ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {row.lab ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {row.admin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADD STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add New Staff Member
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Noman Javed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Receptionist">Receptionist / Front Desk</option>
                  <option value="Cashier">Cashier / Billing Counter</option>
                  <option value="Nurse">Staff Nurse / Triage</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Admin Staff">Admin / Support Staff</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Shift
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Morning (08 AM - 04 PM)">Morning Shift</option>
                    <option value="Evening (02 PM - 10 PM)">Evening Shift</option>
                    <option value="Night (10 PM - 08 AM)">Night Shift</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
