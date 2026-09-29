"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Calendar,
  Ticket,
  Stethoscope,
  Receipt,
  Pill,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  CreditCard,
} from "lucide-react";
import {
  DashboardPatient,
  DashboardDoctor,
  DashboardAppointment,
  DashboardQueueItem,
  DashboardInvoice,
  DashboardMedicine,
} from "../types";

// ==========================================
// 1. QUICK REGISTER PATIENT MODAL
// ==========================================
interface QuickRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (patient: DashboardPatient) => void;
}

export const QuickRegisterPatientModal: React.FC<QuickRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+92 3");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPatient: DashboardPatient = {
      id: `pat-${Date.now()}`,
      mrn: `MRN-24-00${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      phone: phone.trim(),
      age: Number(age) || 30,
      gender,
      bloodGroup,
      city: "Lahore",
      registeredDate: "Today",
      lastVisit: "Just registered",
      totalVisits: 1,
      status: "Active",
      notes: notes.trim() || "Registered at clinic reception desk.",
      allergies: [],
      recentVitals: { bp: "120/80 mmHg", pulse: "74 bpm", temp: "98.6 F", weight: "70 kg" },
    };

    onRegister(newPatient);
    onClose();
    setName("");
    setPhone("+92 3");
    setAge("");
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Quick Patient Registration
              </h3>
              <p className="text-[11px] text-slate-500">10-second front desk patient check-in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Asad Ali Malik"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mobile Number (SMS / WhatsApp) *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                placeholder="Years"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Blood</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Initial Complaint / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Viral fever since 2 days, headache"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. NEW APPOINTMENT MODAL
// ==========================================
interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: DashboardPatient[];
  doctors: DashboardDoctor[];
  onBook: (apt: DashboardAppointment, generateToken: boolean) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  patients,
  doctors,
  onBook,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "");
  const [timeSlot, setTimeSlot] = useState("11:30 AM");
  const [appointmentType, setAppointmentType] = useState<
    "Walk-in" | "Online Booking" | "Follow-up" | "Emergency"
  >("Walk-in");
  const [autoGenerateToken, setAutoGenerateToken] = useState(true);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const doctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !patient) return;

    const newApt: DashboardAppointment = {
      id: `apt-${Date.now()}`,
      bookingRef: `DM-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      date: "Today, 25 Sep",
      timeSlot,
      type: appointmentType,
      status: autoGenerateToken ? "arrived" : "scheduled",
      paymentStatus: "Paid",
      fee: doctor.consultationFee,
      room: doctor.room,
      notes,
    };

    onBook(newApt, autoGenerateToken);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Book Consultation Appointment
              </h3>
              <p className="text-[11px] text-slate-500">Assign doctor, slot, and consultation fee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Patient *
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn}) • {p.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Doctor / Specialist *
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM (Available)</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Booking Type
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                <option value="Walk-in">Walk-in OPD</option>
                <option value="Online Booking">Online Booking</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency Triage</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Fee
              </label>
              <div className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold flex items-center justify-between">
                <span>PKR {doctor?.consultationFee.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-600 font-sans font-bold">Standard</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-sky-600" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Generate Live OPD Queue Token
                </span>
                <span className="text-[10px] text-slate-500">
                  Automatically check patient into {doctor?.room} waiting room
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoGenerateToken}
              onChange={(e) => setAutoGenerateToken(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 cursor-pointer accent-sky-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md shadow-teal-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Confirm Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. GENERATE TOKEN MODAL (DIRECT OPD TICKET)
// ==========================================
interface GenerateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: DashboardPatient[];
  doctors: DashboardDoctor[];
  onGenerate: (token: DashboardQueueItem) => void;
}

export const GenerateTokenModal: React.FC<GenerateTokenModalProps> = ({
  isOpen,
  onClose,
  patients,
  doctors,
  onGenerate,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "");
  const [priority, setPriority] = useState<"Normal" | "Urgent" | "Elderly">("Normal");

  if (!isOpen) return null;

  const doctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !patient) return;

    const nextTokenNo = Math.floor(18 + Math.random() * 5);

    const token: DashboardQueueItem = {
      id: `q-${Date.now()}`,
      tokenNo: nextTokenNo,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      room: doctor.room,
      department: doctor.department,
      checkInTime: "Just now",
      estimatedWaitMins: 15,
      status: "waiting",
      priority,
    };

    onGenerate(token);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Issue Live OPD Token
              </h3>
              <p className="text-[11px] text-slate-500">Print digital token for waiting lounge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Patient *
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Specialist & Room *
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} • {d.room} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Triage Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Normal", "Urgent", "Elderly"] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    priority === p
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Issue Token & Print</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. ADD DOCTOR MODAL
// ==========================================
interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoctor: (doc: DashboardDoctor) => void;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onAddDoctor }) => {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("Consultant Physician");
  const [qualifications, setQualifications] = useState("MBBS, FCPS");
  const [licenseNo, setLicenseNo] = useState("PMC-");
  const [room, setRoom] = useState("Room 105");
  const [department, setDepartment] = useState("General Medicine");
  const [fee, setFee] = useState<number>(2000);
  const [shifts, setShifts] = useState("09:00 AM - 02:00 PM");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDoc: DashboardDoctor = {
      id: `doc-${Date.now()}`,
      name: name.startsWith("Dr.") ? name.trim() : `Dr. ${name.trim()}`,
      specialization,
      qualifications,
      licenseNo,
      room,
      department,
      shifts,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      consultationFee: fee || 2000,
      avatar: "/images/doctor-hd-1.jpg",
      status: "Available",
      todayAppointmentsCount: 0,
      waitingCount: 0,
      completedTodayCount: 0,
      monthlyPatients: 0,
      rating: 5.0,
    };

    onAddDoctor(newDoc);
    onClose();
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Add Clinic Consultant / Doctor
              </h3>
              <p className="text-[11px] text-slate-500">Configure room, shift, and fees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Doctor Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Bilal Naveed"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Dermatologist"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Qualifications
              </label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. MBBS, FCPS"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Room
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 204"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Fee (PKR)
              </label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                placeholder="2500"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Shift Timings
            </label>
            <input
              type="text"
              value={shifts}
              onChange={(e) => setShifts(e.target.value)}
              placeholder="e.g. 05:00 PM - 09:00 PM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Add to Clinic Roster</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 5. CREATE INVOICE MODAL
// ==========================================
interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: DashboardPatient[];
  onCreateInvoice: (inv: DashboardInvoice) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  patients,
  onCreateInvoice,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [service, setService] = useState<
    "OPD Consultation" | "Pharmacy Bill" | "Laboratory Test" | "Procedure"
  >("OPD Consultation");
  const [amount, setAmount] = useState<number>(2500);
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "Credit/Debit Card" | "Online Bank Transfer" | "JazzCash/EasyPaisa"
  >("Cash");

  if (!isOpen) return null;

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    const newInv: DashboardInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-24-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: patient.name,
      service,
      date: "Today, Just now",
      totalAmount: amount,
      paidAmount: amount,
      balanceAmount: 0,
      paymentMethod,
      status: "Paid",
    };

    onCreateInvoice(newInv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Create Billing Invoice
              </h3>
              <p className="text-[11px] text-slate-500">Record cashier payment and issue receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Patient *
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Service Type
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
              >
                <option value="OPD Consultation">OPD Consultation</option>
                <option value="Pharmacy Bill">Pharmacy Bill</option>
                <option value="Laboratory Test">Laboratory Test</option>
                <option value="Procedure">Procedure</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount (PKR) *
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            >
              <option value="Cash">Cash at Counter</option>
              <option value="Credit/Debit Card">Credit/Debit POS Machine</option>
              <option value="JazzCash/EasyPaisa">JazzCash / EasyPaisa QR</option>
              <option value="Online Bank Transfer">Online Bank Transfer (Raast)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Record & Print Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
