"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Stethoscope,
  ArrowLeft,
  User,
  Heart,
  Thermometer,
  Activity,
  Weight,
  Ruler,
  AlertCircle,
  Pill,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  Calendar,
  Clock,
  FlaskConical,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Printer,
  ChevronDown,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import {
  PrescriptionMedicine,
  LabOrder,
  ClinicalVitals,
  DigitalPrescription,
} from "@/lib/types/doctor";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";

export default function DoctorConsultationWorkspace() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.appointmentId as string;

  const {
    appointments,
    getPatientById,
    consultations,
    saveConsultationDraft,
    completeConsultation,
    activeClinic,
    labOrders,
    updateAppointmentStatus,
  } = useDoctor();

  // Find appointment
  const appointment = useMemo(() => {
    return appointments.find((a) => a.id === appointmentId);
  }, [appointments, appointmentId]);

  // Find patient
  const patient = useMemo(() => {
    if (!appointment) return undefined;
    return getPatientById(appointment.patientProfileId);
  }, [appointment, getPatientById]);

  // Existing consultation draft if any
  const existingEncounter = useMemo(() => {
    return consultations.find((c) => c.appointmentId === appointmentId);
  }, [consultations, appointmentId]);

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [symptomsList, setSymptomsList] = useState<string[]>([]);
  const [vitals, setVitals] = useState<ClinicalVitals>({
    bpSystolic: 120,
    bpDiastolic: 80,
    heartRate: 72,
    temperature: 98.6,
    spo2: 98,
    weightKg: 70,
    heightCm: 170,
  });
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [assessment, setAssessment] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [icd10Code, setIcd10Code] = useState("");

  // Medications list
  const [medications, setMedications] = useState<PrescriptionMedicine[]>([]);

  // Lab orders list
  const [orderedLabs, setOrderedLabs] = useState<LabOrder[]>([]);

  // Follow-up state
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpReason, setFollowUpReason] = useState("");

  // New med modal/form inline
  const [newMed, setNewMed] = useState<Partial<PrescriptionMedicine>>({
    name: "",
    dosage: "1 Tablet",
    frequency: "OD (1-0-0) Once Daily",
    duration: "5 Days",
    instructions: "After meals",
    route: "oral",
  });
  const [showAddMedForm, setShowAddMedForm] = useState(false);

  // New lab order inline
  const [newLabTest, setNewLabTest] = useState({
    testName: "",
    category: "Cardiology",
    priority: "routine" as "routine" | "urgent" | "stat",
    notes: "",
  });
  const [showAddLabForm, setShowAddLabForm] = useState(false);

  // Completion modal & preview
  const [generatedPrescription, setGeneratedPrescription] = useState<DigitalPrescription | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Prepopulate form if existing encounter exists
  useEffect(() => {
    if (existingEncounter) {
      setChiefComplaint(existingEncounter.chiefComplaint || "");
      setSymptomsList(existingEncounter.symptoms || []);
      setVitals(existingEncounter.vitals || {});
      setClinicalNotes(existingEncounter.clinicalNotes || "");
      setAssessment(existingEncounter.assessment || "");
      setDiagnosis(existingEncounter.diagnosis || "");
      setIcd10Code(existingEncounter.icd10Code || "");
      setMedications(existingEncounter.medications || []);
      setOrderedLabs(existingEncounter.labOrders || []);
      setFollowUpRequired(!!existingEncounter.followUpRequired);
      setFollowUpDate(existingEncounter.followUpDate || "");
      setFollowUpReason(existingEncounter.followUpReason || "");
      if (existingEncounter.status === "completed") {
        setIsCompleted(true);
      }
    } else if (appointment) {
      setChiefComplaint(appointment.reasonForVisit || "");
    }
  }, [existingEncounter, appointment]);

  // Auto calculate BMI
  const calculatedBMI = useMemo(() => {
    if (vitals.weightKg && vitals.heightCm) {
      const heightM = vitals.heightCm / 100;
      const bmiVal = vitals.weightKg / (heightM * heightM);
      return Math.round(bmiVal * 10) / 10;
    }
    return undefined;
  }, [vitals.weightKg, vitals.heightCm]);

  const handleAddSymptom = () => {
    if (symptomsInput.trim().length > 0) {
      setSymptomsList([...symptomsList, symptomsInput.trim()]);
      setSymptomsInput("");
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptomsList(symptomsList.filter((_, i) => i !== index));
  };

  const handleAddMedicine = () => {
    if (!newMed.name || newMed.name.trim().length === 0) return;
    const medicine: PrescriptionMedicine = {
      id: `med-${Date.now()}`,
      name: newMed.name.trim(),
      genericName: newMed.genericName,
      dosage: newMed.dosage || "1 Tablet",
      frequency: newMed.frequency || "OD (1-0-0)",
      duration: newMed.duration || "5 Days",
      instructions: newMed.instructions || "After meals",
      route: newMed.route || "oral",
    };
    setMedications([...medications, medicine]);
    setNewMed({
      name: "",
      dosage: "1 Tablet",
      frequency: "OD (1-0-0) Once Daily",
      duration: "5 Days",
      instructions: "After meals",
      route: "oral",
    });
    setShowAddMedForm(false);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleAddLabOrder = () => {
    if (!newLabTest.testName || newLabTest.testName.trim().length === 0) return;
    const order: LabOrder = {
      id: `lab-${Date.now()}`,
      testName: newLabTest.testName.trim(),
      category: newLabTest.category,
      priority: newLabTest.priority,
      notes: newLabTest.notes,
      status: "ordered",
      orderedAt: new Date().toISOString().split("T")[0],
    };
    setOrderedLabs([...orderedLabs, order]);
    setNewLabTest({
      testName: "",
      category: "Cardiology",
      priority: "routine",
      notes: "",
    });
    setShowAddLabForm(false);
  };

  const handleRemoveLab = (id: string) => {
    setOrderedLabs(orderedLabs.filter((l) => l.id !== id));
  };

  const handleSaveDraft = () => {
    if (!appointment) return;
    saveConsultationDraft({
      appointmentId: appointment.id,
      patientProfileId: appointment.patientProfileId,
      patientName: appointment.patientName,
      chiefComplaint,
      symptoms: symptomsList,
      vitals: { ...vitals, bmi: calculatedBMI },
      clinicalNotes,
      assessment,
      diagnosis,
      icd10Code,
      medications,
      labOrders: orderedLabs,
      followUpRequired,
      followUpDate,
      followUpReason,
    });
    setNotificationBanner("Draft consultation progress saved successfully.");
    setTimeout(() => setNotificationBanner(null), 3000);
  };

  const handleCompleteEncounter = () => {
    if (!appointment) return;
    // Save draft first
    const saved = saveConsultationDraft({
      appointmentId: appointment.id,
      patientProfileId: appointment.patientProfileId,
      patientName: appointment.patientName,
      chiefComplaint,
      symptoms: symptomsList,
      vitals: { ...vitals, bmi: calculatedBMI },
      clinicalNotes,
      assessment,
      diagnosis: diagnosis || "Clinical evaluation completed",
      icd10Code,
      medications,
      labOrders: orderedLabs,
      followUpRequired,
      followUpDate,
      followUpReason,
    });

    const { encounter, prescription } = completeConsultation(saved.id);
    setIsCompleted(true);
    setGeneratedPrescription(prescription);
    setNotificationBanner(
      `Consultation completed! Prescription ${prescription.prescriptionNumber} generated and clinic billing event recorded.`
    );
  };

  if (!appointment) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appointment Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested appointment {appointmentId} does not exist or has been removed.
        </p>
        <Link
          href="/doctor"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/doctor"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Finalized & Digitally Signed</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1.5 border border-purple-300 dark:border-purple-800">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>In Progress (Active Encounter)</span>
            </span>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notificationBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeInUp shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notificationBanner}</span>
          </div>
          {generatedPrescription && (
            <button
              onClick={() => setGeneratedPrescription(generatedPrescription)}
              className="underline text-emerald-900 dark:text-emerald-200 font-bold"
            >
              View Prescription
            </button>
          )}
        </div>
      )}

      {/* PATIENT HEADER & APPOINTMENT META */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-sky-500/20">
            {appointment.patientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {appointment.patientName}
              </h1>
              {appointment.tokenNumber && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Token {appointment.tokenNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {appointment.patientAge} Years • {appointment.patientGender} • Slot: {appointment.timeSlot} • Booking Ref: {appointment.bookingRef}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Phone: {appointment.patientPhone} • Patient ID: {appointment.patientProfileId}
            </p>
          </div>
        </div>

        {/* Action Buttons: Save Draft & Complete */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isCompleted}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Save Draft</span>
          </button>

          {!isCompleted ? (
            <button
              onClick={handleCompleteEncounter}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Consultation</span>
            </button>
          ) : (
            <button
              onClick={() => generatedPrescription && setGeneratedPrescription(generatedPrescription)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>View Prescription</span>
            </button>
          )}
        </div>
      </div>

      {/* PATIENT CLINICAL SUMMARY SIDEBAR / GRID */}
      {patient && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs">
            <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">
              Allergies
            </span>
            <p className="text-rose-700 dark:text-rose-400 font-medium">
              {patient.allergies.length > 0 ? patient.allergies.join(", ") : "None known (NKDA)"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
              Current Medications
            </span>
            <p className="text-amber-700 dark:text-amber-400 truncate">
              {patient.currentMedications.length > 0 ? patient.currentMedications.join(", ") : "None"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 text-xs">
            <span className="font-bold text-sky-800 dark:text-sky-300 block mb-1">
              Chronic Conditions
            </span>
            <p className="text-sky-700 dark:text-sky-400 truncate">
              {patient.chronicConditions.join(", ") || "None"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Recent Lab Result
            </span>
            <p className="text-slate-600 dark:text-slate-400 truncate">
              {labOrders[0]?.resultSummary || "No pending labs"}
            </p>
          </div>
        </div>
      )}

      {/* ENCOUNTER FORM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Chief Complaint, Vitals, Assessment & Notes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Chief Complaint & Symptoms */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span>1. Chief Complaint & Reported Symptoms</span>
            </h2>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Primary Reason for Encounter
              </label>
              <textarea
                rows={2}
                disabled={isCompleted}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Follow-up for blood pressure check, review of 24hr Holter monitoring..."
                className="w-full px-3.5 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-70"
              />
            </div>

            {/* Symptoms Tags */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Specific Symptoms
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={isCompleted}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSymptom();
                    }
                  }}
                  placeholder="Type symptom and press Enter or Add..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-70"
                />
                <button
                  type="button"
                  disabled={isCompleted}
                  onClick={handleAddSymptom}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  + Add
                </button>
              </div>

              {symptomsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {symptomsList.map((sym, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-medium flex items-center gap-1.5"
                    >
                      <span>{sym}</span>
                      {!isCompleted && (
                        <button
                          onClick={() => handleRemoveSymptom(index)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Clinical Vitals */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>2. Vital Signs & Measurements</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Blood Pressure (mmHg)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    disabled={isCompleted}
                    value={vitals.bpSystolic || ""}
                    onChange={(e) => setVitals({ ...vitals, bpSystolic: Number(e.target.value) })}
                    placeholder="Sys"
                    className="w-16 px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-center"
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    disabled={isCompleted}
                    value={vitals.bpDiastolic || ""}
                    onChange={(e) => setVitals({ ...vitals, bpDiastolic: Number(e.target.value) })}
                    placeholder="Dia"
                    className="w-16 px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  disabled={isCompleted}
                  value={vitals.heartRate || ""}
                  onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                  placeholder="72"
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={isCompleted}
                  value={vitals.temperature || ""}
                  onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                  placeholder="98.6"
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  disabled={isCompleted}
                  value={vitals.spo2 || ""}
                  onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                  placeholder="98"
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  disabled={isCompleted}
                  value={vitals.weightKg || ""}
                  onChange={(e) => setVitals({ ...vitals, weightKg: Number(e.target.value) })}
                  placeholder="70"
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  disabled={isCompleted}
                  value={vitals.heightCm || ""}
                  onChange={(e) => setVitals({ ...vitals, heightCm: Number(e.target.value) })}
                  placeholder="170"
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="col-span-2 flex items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 mr-2">Calculated BMI:</span>
                <span className="text-base font-extrabold text-sky-600 font-mono">
                  {calculatedBMI ? `${calculatedBMI} kg/m²` : "—"}
                </span>
                {calculatedBMI && (
                  <span className="text-[11px] ml-2 font-medium text-slate-400">
                    ({calculatedBMI < 18.5 ? "Underweight" : calculatedBMI <= 24.9 ? "Normal" : "Overweight"})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Notes, Assessment & Diagnosis */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>3. Clinical Assessment & Diagnosis</span>
            </h2>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Clinical Examination Notes
              </label>
              <textarea
                rows={3}
                disabled={isCompleted}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Physical examination observations, heart sounds, S1/S2 audible, chest clear..."
                className="w-full px-3.5 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-70"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Primary Clinical Diagnosis
                </label>
                <input
                  type="text"
                  disabled={isCompleted}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential (primary) hypertension, Stage 1"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-70"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  ICD-10 Code (Optional)
                </label>
                <input
                  type="text"
                  disabled={isCompleted}
                  value={icd10Code}
                  onChange={(e) => setIcd10Code(e.target.value)}
                  placeholder="e.g. I10"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Medications & Investigations & Follow-up */}
        <div className="lg:col-span-4 space-y-6">
          {/* PRESCRIPTION / MEDICINES SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-600" />
                <span>4. Medications ({medications.length})</span>
              </h2>
              {!isCompleted && (
                <button
                  onClick={() => setShowAddMedForm(!showAddMedForm)}
                  className="px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              )}
            </div>

            {/* Inline Add Medicine Form */}
            {showAddMedForm && (
              <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-2.5 text-xs animate-popIn">
                <input
                  type="text"
                  placeholder="Medicine name (e.g. Tab. Amlodipine 5mg)"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-semibold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1 Tab)"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (OD / BD / TDS)"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Duration (e.g. 30 Days)"
                    value={newMed.duration}
                    onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Instructions (After meals)"
                    value={newMed.instructions}
                    onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddMedForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMedicine}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs"
                  >
                    Insert Medicine
                  </button>
                </div>
              </div>
            )}

            {/* Medications List */}
            {medications.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No medicines added to this prescription yet.
              </p>
            ) : (
              <div className="space-y-2">
                {medications.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                        {m.dosage} • {m.frequency} • {m.duration}
                      </p>
                      <p className="text-slate-500 text-[10px] italic">{m.instructions}</p>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleRemoveMedicine(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INVESTIGATIONS / LAB ORDERS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                <span>5. Lab Investigations ({orderedLabs.length})</span>
              </h2>
              {!isCompleted && (
                <button
                  onClick={() => setShowAddLabForm(!showAddLabForm)}
                  className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Test</span>
                </button>
              )}
            </div>

            {showAddLabForm && (
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2.5 text-xs animate-popIn">
                <input
                  type="text"
                  placeholder="Test Name (e.g. Complete Blood Picture CP)"
                  value={newLabTest.testName}
                  onChange={(e) => setNewLabTest({ ...newLabTest, testName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-semibold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newLabTest.priority}
                    onChange={(e) =>
                      setNewLabTest({ ...newLabTest, priority: e.target.value as "routine" | "urgent" | "stat" })
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="routine">Routine Priority</option>
                    <option value="urgent">Urgent Priority</option>
                    <option value="stat">STAT Immediate</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Clinical Notes"
                    value={newLabTest.notes}
                    onChange={(e) => setNewLabTest({ ...newLabTest, notes: e.target.value })}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddLabForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLabOrder}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                  >
                    Add Order
                  </button>
                </div>
              </div>
            )}

            {orderedLabs.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No lab tests ordered today.</p>
            ) : (
              <div className="space-y-2">
                {orderedLabs.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{l.testName}</span>
                      <span className="ml-2 uppercase text-[10px] font-bold text-teal-600">
                        ({l.priority})
                      </span>
                      {l.notes && <p className="text-[11px] text-slate-500">{l.notes}</p>}
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleRemoveLab(l.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOLLOW-UP SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>6. Follow-up Management</span>
            </h2>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Follow-up required?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isCompleted}
                  onClick={() => setFollowUpRequired(true)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    followUpRequired ? "bg-amber-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  disabled={isCompleted}
                  onClick={() => setFollowUpRequired(false)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    !followUpRequired ? "bg-slate-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {followUpRequired && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Scheduled Follow-up Date
                  </label>
                  <input
                    type="date"
                    disabled={isCompleted}
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Instructions / Purpose
                  </label>
                  <input
                    type="text"
                    disabled={isCompleted}
                    value={followUpReason}
                    onChange={(e) => setFollowUpReason(e.target.value)}
                    placeholder="e.g. Titration of antihypertensive therapy & review blood tests"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Preview Modal Trigger */}
      <PrescriptionPreviewModal
        prescription={generatedPrescription}
        onClose={() => setGeneratedPrescription(null)}
      />
    </div>
  );
}
