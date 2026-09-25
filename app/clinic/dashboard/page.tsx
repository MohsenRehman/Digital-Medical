"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  LogOut,
  X,
} from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";
import { usePatientAuth } from "@/app/context/PatientAuthContext";
import { DashboardNavModule } from "./types";
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUE,
  INITIAL_STAFF,
  INITIAL_MEDICINES,
  INITIAL_LAB_ORDERS,
  INITIAL_INVOICES,
  INITIAL_INVENTORY,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TICKETS,
} from "./data/mockData";
import { ClinicSidebar } from "./components/ClinicSidebar";
import { ClinicTopbar } from "./components/ClinicTopbar";
import { ToastContainer, ToastMessage } from "./components/Toast";
import {
  QuickRegisterPatientModal,
  NewAppointmentModal,
  GenerateTokenModal,
  AddDoctorModal,
  CreateInvoiceModal,
} from "./components/QuickActionModals";

// Modules
import { OverviewModule } from "./components/modules/OverviewModule";
import { AppointmentsModule } from "./components/modules/AppointmentsModule";
import { LiveQueueModule } from "./components/modules/LiveQueueModule";
import { PatientsModule } from "./components/modules/PatientsModule";
import { DoctorsModule } from "./components/modules/DoctorsModule";
import { StaffModule } from "./components/modules/StaffModule";
import { ClinicalModule } from "./components/modules/ClinicalModule";
import { PharmacyModule } from "./components/modules/PharmacyModule";
import { LaboratoryModule } from "./components/modules/LaboratoryModule";
import { BillingModule } from "./components/modules/BillingModule";
import { InventoryModule } from "./components/modules/InventoryModule";
import { ReportsModule } from "./components/modules/ReportsModule";
import { SubscriptionModule } from "./components/modules/SubscriptionModule";
import { SettingsModule } from "./components/modules/SettingsModule";
import { NotificationsSupportModule } from "./components/modules/NotificationsSupportModule";

export default function ClinicDashboardPage() {
  const router = useRouter();
  const { application, clinicUser, clinicLogout, simulateAdminApproval, isLoaded } = useClinicAuth();
  const { appointments: patientContextAppointments } = usePatientAuth();

  // Navigation State
  const [activeModule, setActiveModule] = useState<DashboardNavModule>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Clinic Core Data State
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [labOrders, setLabOrders] = useState(INITIAL_LAB_ORDERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [supportTickets, setSupportTickets] = useState(INITIAL_TICKETS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync real patient bookings from landing page if any exist
  useEffect(() => {
    if (patientContextAppointments && patientContextAppointments.length > 0) {
      setAppointments((prev) => {
        const liveConverted = patientContextAppointments.map((pa) => ({
          id: pa.id,
          bookingRef: pa.bookingRef,
          patientId: pa.patientUserId || `pat-${pa.id}`,
          patientName: pa.patientName,
          patientPhone: pa.patientPhone,
          doctorId: pa.doctorId,
          doctorName: pa.doctorName,
          department: pa.doctorSpecialty || "General Medicine",
          date: pa.date,
          timeSlot: pa.timeSlot,
          type: "Online Booking" as const,
          status: pa.status === "confirmed" ? ("scheduled" as const) : ("completed" as const),
          paymentStatus: (pa.paymentMethod === "online_paid" ? "Paid" : "Pending") as "Paid" | "Pending",
          fee: pa.consultationFee || 2000,
          room: "Room 101",
        }));

        // Merge without duplicates by bookingRef
        const existingRefs = new Set(prev.map((a) => a.bookingRef));
        const newOnes = liveConverted.filter((a) => !existingRefs.has(a.bookingRef));
        return [...newOnes, ...prev];
      });
    }
  }, [patientContextAppointments]);

  // Modal Open States
  const [isQuickPatientOpen, setIsQuickPatientOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isGenerateTokenOpen, setIsGenerateTokenOpen] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  // Toast Helper
  const addToast = (type: ToastMessage["type"], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivityLog = (user: string, role: string, action: string, details: string, module: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        user,
        role,
        action,
        details,
        module,
        type: "info",
      },
      ...prev,
    ]);
  };

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------

  // 1. Quick Register Patient
  const handleRegisterPatient = (newPatient: typeof patients[0]) => {
    setPatients((prev) => [newPatient, ...prev]);
    addActivityLog("Reception Desk", "Staff", "Patient Registered", `${newPatient.name} registered (${newPatient.mrn})`, "Patients");
    addToast("success", "Patient Registered", `${newPatient.name} added to permanent directory.`);
  };

  // 2. New Appointment
  const handleBookAppointment = (newApt: typeof appointments[0], autoGenerateToken: boolean) => {
    setAppointments((prev) => [newApt, ...prev]);

    if (autoGenerateToken) {
      const nextTokenNo = Math.floor(18 + Math.random() * 5);
      const newQueueItem: typeof queue[0] = {
        id: `q-${Date.now()}`,
        tokenNo: nextTokenNo,
        patientId: newApt.patientId,
        patientName: newApt.patientName,
        doctorId: newApt.doctorId,
        doctorName: newApt.doctorName,
        room: newApt.room || "Room 101",
        department: newApt.department,
        checkInTime: "Just now",
        estimatedWaitMins: 15,
        status: "waiting",
        priority: "Normal",
      };
      setQueue((prev) => [...prev, newQueueItem]);
      addToast("success", "Appointment & Token Created", `Token #${nextTokenNo} generated for ${newApt.patientName}`);
    } else {
      addToast("success", "Appointment Confirmed", `Booking ${newApt.bookingRef} saved for ${newApt.patientName}`);
    }

    addActivityLog("Appointments Desk", "Staff", "Appointment Booked", `${newApt.patientName} scheduled with ${newApt.doctorName}`, "Appointments");
  };

  // 3. Issue Direct OPD Token
  const handleGenerateToken = (token: typeof queue[0]) => {
    setQueue((prev) => [...prev, token]);
    addActivityLog("Front Desk", "Receptionist", "Token Generated", `Token #${token.tokenNo} issued for ${token.patientName} to ${token.room}`, "Live Queue");
    addToast("warning", `Token #${token.tokenNo} Issued`, `Assigned to ${token.doctorName} (${token.room})`);
  };

  // 4. Call Token in Queue
  const handleCallToken = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "called" } : item))
    );
    const target = queue.find((q) => q.id === id);
    if (target) {
      addToast("info", `Now Calling Token #${target.tokenNo}`, `Please proceed to ${target.room}`);
      addActivityLog("Queue Display", "System", "Token Called", `Token #${target.tokenNo} called for ${target.patientName}`, "Live Queue");
    }
  };

  // 5. Start Consultation
  const handleStartConsultation = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "in-consultation" } : item
      )
    );
    const target = queue.find((q) => q.id === id);
    if (target) {
      addToast("success", "Consultation Started", `${target.patientName} is now in consultation.`);
    }
  };

  // 6. Complete Token
  const handleCompleteToken = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "completed" } : item))
    );
    addToast("success", "Consultation Completed", "Prescription auto-synced with pharmacy.");
    addActivityLog("Clinical Desk", "Doctor", "Consultation Finished", "Prescription written and finalized", "Clinical");
  };

  // 7. No-show Token
  const handleMarkNoShow = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "no-show" } : item))
    );
    addToast("warning", "Patient Marked No-Show", "Token moved out of active queue.");
  };

  // 8. Recall Token Audio
  const handleRecallToken = (tokenNo: number, patientName: string) => {
    addToast("info", `Audio Announcement: Token #${tokenNo}`, `Paging ${patientName} to consultation room.`);
  };

  // 9. Add Doctor
  const handleAddDoctor = (doc: typeof doctors[0]) => {
    setDoctors((prev) => [...prev, doc]);
    addToast("success", "Specialist Added", `${doc.name} assigned to ${doc.room}.`);
    addActivityLog("Clinic Admin", "Admin", "Doctor Added", `${doc.name} added to roster`, "Doctors");
  };

  // 10. Create Billing Invoice
  const handleCreateInvoice = (inv: typeof invoices[0]) => {
    setInvoices((prev) => [inv, ...prev]);
    addToast("success", "Invoice Recorded", `${inv.invoiceNo} for PKR ${inv.totalAmount.toLocaleString()} recorded.`);
    addActivityLog("Cashier Desk", "Cashier", "Invoice Created", `${inv.invoiceNo} issued for ${inv.patientName}`, "Billing");
  };

  // 11. Dispense Medicine
  const handleDispenseMedicine = (medId: string, qty: number, patientName: string) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const newQty = Math.max(0, m.quantity - qty);
          return {
            ...m,
            quantity: newQty,
            stockStatus: newQty === 0 ? "out_of_stock" : newQty <= m.reorderLevel ? "low_stock" : "in_stock",
          };
        }
        return m;
      })
    );

    const targetMed = medicines.find((m) => m.id === medId);
    if (targetMed) {
      const inv: typeof invoices[0] = {
        id: `inv-${Date.now()}`,
        invoiceNo: `INV-24-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: `pat-${Date.now()}`,
        patientName,
        service: "Pharmacy Bill",
        date: "Today, Just now",
        totalAmount: qty * targetMed.salePrice,
        paidAmount: qty * targetMed.salePrice,
        balanceAmount: 0,
        paymentMethod: "Cash",
        status: "Paid",
      };
      setInvoices((prev) => [inv, ...prev]);
      addToast("success", "Medicine Dispensed", `${qty} ${targetMed.unit} of ${targetMed.name} dispensed to ${patientName}.`);
      addActivityLog("Pharmacy POS", "Pharmacist", "Medicine Dispensed", `${qty}x ${targetMed.name} dispensed (${inv.invoiceNo})`, "Pharmacy");
    }
  };

  // 12. Check-in Appointment
  const handleCheckInAppointment = (id: string) => {
    const nextTokenNo = Math.floor(18 + Math.random() * 5);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "arrived", tokenNo: nextTokenNo } : a))
    );

    const target = appointments.find((a) => a.id === id);
    if (target) {
      const newQueueItem: typeof queue[0] = {
        id: `q-${Date.now()}`,
        tokenNo: nextTokenNo,
        patientId: target.patientId,
        patientName: target.patientName,
        doctorId: target.doctorId,
        doctorName: target.doctorName,
        room: target.room || "Room 101",
        department: target.department,
        checkInTime: "Just now",
        estimatedWaitMins: 10,
        status: "waiting",
        priority: "Normal",
      };
      setQueue((prev) => [...prev, newQueueItem]);
      addToast("success", "Check-in Complete", `Token #${nextTokenNo} issued for ${target.patientName}`);
      addActivityLog("Reception", "Staff", "Check-in", `${target.patientName} checked in. Token #${nextTokenNo} active`, "Appointments");
    }
  };

  // 13. Cancel Appointment
  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
    addToast("warning", "Appointment Cancelled", "Slot reopened in doctor calendar.");
  };

  // 14. Complete Appointment
  const handleCompleteAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a))
    );
    addToast("success", "Appointment Completed", "Visit marked as completed.");
  };

  // 15. Inventory Adjustment
  const handleStockAdjustment = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return {
            ...item,
            quantity: newQty,
            status: newQty <= item.reorderLevel ? (newQty <= 5 ? "Critical" : "Low Stock") : "In Stock",
            lastRestocked: delta > 0 ? "Today" : item.lastRestocked,
          };
        }
        return item;
      })
    );
    addToast("info", "Inventory Updated", `Stock adjusted by ${delta > 0 ? `+${delta}` : delta}`);
  };

  const handleLogout = () => {
    clinicLogout();
    router.push("/");
  };

  // Determine Clinic Identity (from application, clinicUser, or fallback demo)
  const activeClinicName =
    application?.clinicName || clinicUser?.clinicName || "Al-Hakeem Medical Complex & Specialty Center";
  const activePlan = application?.plan || clinicUser?.plan || "pro";
  const activeAdminName =
    application?.ownerFullName || clinicUser?.ownerFullName || "Dr. Tariq Mahmood";
  const activeCity = application?.city || "Lahore";
  const activeAddress = application?.physicalAddress || "Plot 14-B, Main Boulevard, Gulberg III";
  const activePhone = application?.mobileNumber || "+92 42 35871928";
  const activeEmail = application?.email || "admin@alhakeemclinic.pk";
  const activeMonthlyAmount = application?.totalMonthlyAmount || 8999;

  // Is application awaiting verification?
  const isPendingVerification = application && application.status === "pending_admin_verification";

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Pending Approval Helper Banner if applicable */}
      {isPendingVerification && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between z-50 sticky top-0 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Clinic application is currently <strong>Pending Admin Verification</strong>.
            </span>
          </div>
          <button
            onClick={() => {
              simulateAdminApproval();
              addToast("success", "Clinic Verified & Approved", "You now have full administrator access.");
            }}
            className="px-3 py-1 rounded-lg bg-slate-950 text-white text-[11px] font-black uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Simulate Super-Admin Approval
          </button>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <ClinicSidebar
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            clinicName={activeClinicName}
            plan={activePlan}
            adminName={activeAdminName}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            waitingCount={queue.filter((q) => q.status === "waiting" || q.status === "called").length}
            appointmentsCount={appointments.filter((a) => a.status === "scheduled").length}
            unreadNotifications={3}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 h-full bg-[#152332] text-gray-300 shadow-2xl flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-gray-700/50">
                <span className="font-bold text-sm text-white">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ClinicSidebar
                  activeModule={activeModule}
                  setActiveModule={(mod) => {
                    setActiveModule(mod);
                    setIsMobileMenuOpen(false);
                  }}
                  clinicName={activeClinicName}
                  plan={activePlan}
                  adminName={activeAdminName}
                  isCollapsed={false}
                  setIsCollapsed={() => {}}
                  waitingCount={queue.filter((q) => q.status === "waiting").length}
                  appointmentsCount={appointments.filter((a) => a.status === "scheduled").length}
                  unreadNotifications={3}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Content Workspace */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          {/* Topbar */}
          <ClinicTopbar
            activeModule={activeModule}
            clinicName={activeClinicName}
            onOpenQuickPatient={() => setIsQuickPatientOpen(true)}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onOpenGenerateToken={() => setIsGenerateTokenOpen(true)}
            onOpenAddDoctor={() => setIsAddDoctorOpen(true)}
            onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            unreadCount={3}
            onOpenNotifications={() => setActiveModule("notifications")}
          />

          {/* Main Content Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {activeModule === "overview" && (
              <OverviewModule
                patients={patients}
                appointments={appointments}
                queue={queue}
                doctors={doctors}
                medicines={medicines}
                labOrders={labOrders}
                invoices={invoices}
                activityLogs={activityLogs}
                onNavigate={setActiveModule}
                onCallNextQueue={handleCallToken}
                onCheckInAppointment={handleCheckInAppointment}
                onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
                onOpenQuickPatient={() => setIsQuickPatientOpen(true)}
                onOpenGenerateToken={() => setIsGenerateTokenOpen(true)}
                onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
              />
            )}

            {activeModule === "appointments" && (
              <AppointmentsModule
                appointments={appointments}
                doctors={doctors}
                patients={patients}
                onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
                onCheckIn={handleCheckInAppointment}
                onCancelAppointment={handleCancelAppointment}
                onCompleteAppointment={handleCompleteAppointment}
                onRescheduleAppointment={(id, time) => {
                  setAppointments((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, timeSlot: time } : a))
                  );
                  addToast("info", "Appointment Rescheduled", `New time slot: ${time}`);
                }}
              />
            )}

            {activeModule === "queue" && (
              <LiveQueueModule
                queue={queue}
                doctors={doctors}
                onOpenGenerateToken={() => setIsGenerateTokenOpen(true)}
                onCallToken={handleCallToken}
                onStartConsultation={handleStartConsultation}
                onCompleteToken={handleCompleteToken}
                onMarkNoShow={handleMarkNoShow}
                onRecallToken={handleRecallToken}
              />
            )}

            {activeModule === "patients" && (
              <PatientsModule
                patients={patients}
                appointments={appointments}
                invoices={invoices}
                onOpenQuickRegister={() => setIsQuickPatientOpen(true)}
                onBookAppointmentForPatient={(patientId) => {
                  setIsNewAppointmentOpen(true);
                }}
              />
            )}

            {activeModule === "doctors" && (
              <DoctorsModule
                doctors={doctors}
                onOpenAddDoctor={() => setIsAddDoctorOpen(true)}
                onUpdateDoctorStatus={(id, status) => {
                  setDoctors((prev) =>
                    prev.map((d) => (d.id === id ? { ...d, status } : d))
                  );
                  addToast("info", "Doctor Status Updated", `Status changed to ${status}`);
                }}
              />
            )}

            {activeModule === "staff" && (
              <StaffModule
                staff={staff}
                onAddStaff={(newMember) => {
                  setStaff((prev) => [...prev, newMember]);
                  addToast("success", "Staff Account Created", `${newMember.name} added as ${newMember.role}`);
                  addActivityLog("Staff Desk", "Admin", "Staff Added", `${newMember.name} (${newMember.role}) joined`, "Staff");
                }}
              />
            )}

            {activeModule === "clinical" && (
              <ClinicalModule
                doctors={doctors}
                appointments={appointments}
                labOrders={labOrders}
              />
            )}

            {activeModule === "pharmacy" && (
              <PharmacyModule
                medicines={medicines}
                patients={patients}
                onAddMedicine={(newMed) => {
                  setMedicines((prev) => [newMed, ...prev]);
                  addToast("success", "Medicine Saved", `${newMed.name} added to catalog.`);
                  addActivityLog("Pharmacy", "Pharmacist", "Medicine Added", `${newMed.name} added to catalog`, "Pharmacy");
                }}
                onDispense={handleDispenseMedicine}
              />
            )}

            {activeModule === "laboratory" && (
              <LaboratoryModule
                labOrders={labOrders}
                patients={patients}
                onUpdateSampleStatus={(id, status) => {
                  setLabOrders((prev) =>
                    prev.map((o) => (o.id === id ? { ...o, sampleStatus: status } : o))
                  );
                  addToast("info", "Sample Status Updated", `Sample status: ${status}`);
                }}
                onUpdateResultStatus={(id, status) => {
                  setLabOrders((prev) =>
                    prev.map((o) => (o.id === id ? { ...o, resultStatus: status } : o))
                  );
                  addToast("success", "Report Verified", "Pathology report signed and delivered.");
                  addActivityLog("Diagnostic Lab", "Lab Tech", "Report Verified", `Lab report verified and delivered`, "Laboratory");
                }}
                onOrderLabTest={(newOrder) => {
                  setLabOrders((prev) => [newOrder, ...prev]);
                  addToast("success", "Lab Investigation Ordered", `${newOrder.testName} ordered for ${newOrder.patientName}`);
                  addActivityLog("Clinical Desk", "Doctor", "Investigation Ordered", `${newOrder.testName} ordered`, "Laboratory");
                }}
              />
            )}

            {activeModule === "billing" && (
              <BillingModule
                invoices={invoices}
                patients={patients}
                onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
                onPayInvoice={(id) => {
                  setInvoices((prev) =>
                    prev.map((inv) =>
                      inv.id === id
                        ? { ...inv, paidAmount: inv.totalAmount, balanceAmount: 0, status: "Paid" }
                        : inv
                    )
                  );
                  addToast("success", "Payment Collected", "Invoice settled and receipt printed.");
                  addActivityLog("Cashier Desk", "Cashier", "Payment Collected", `Invoice settled`, "Billing");
                }}
              />
            )}

            {activeModule === "inventory" && (
              <InventoryModule
                inventory={inventory}
                onStockAdjustment={handleStockAdjustment}
                onAddItem={(newItem) => {
                  setInventory((prev) => [newItem, ...prev]);
                  addToast("success", "Supply Item Added", `${newItem.name} added to inventory.`);
                  addActivityLog("Inventory", "Staff", "Item Added", `${newItem.name} added`, "Inventory");
                }}
              />
            )}

            {activeModule === "reports" && (
              <ReportsModule invoices={invoices} doctors={doctors} />
            )}

            {activeModule === "subscription" && (
              <SubscriptionModule
                plan={activePlan}
                totalMonthlyAmount={activeMonthlyAmount}
                clinicName={activeClinicName}
                registeredPatientsCount={patients.length}
              />
            )}

            {activeModule === "settings" && (
              <SettingsModule
                clinicName={activeClinicName}
                city={activeCity}
                address={activeAddress}
                phone={activePhone}
                email={activeEmail}
                onSaveSettings={(msg) => addToast("success", "Settings Saved", msg)}
              />
            )}

            {(activeModule === "notifications" ||
              activeModule === "support" ||
              activeModule === "activity") && (
              <NotificationsSupportModule
                initialTab={activeModule}
                activityLogs={activityLogs}
                supportTickets={supportTickets}
                onSubmitTicket={(subject, category, message) => {
                  const newTkt: typeof supportTickets[0] = {
                    id: `tkt-${Date.now()}`,
                    ticketNo: `TKT-${Math.floor(8400 + Math.random() * 100)}`,
                    subject,
                    category,
                    priority: "Medium",
                    status: "Open",
                    createdAt: "Just now",
                    lastReply: "Ticket dispatched to Super-Admin team. Response SLA: 4 hours.",
                  };
                  setSupportTickets((prev) => [newTkt, ...prev]);
                  addToast("success", "Support Ticket Submitted", `Ticket Ref: ${newTkt.ticketNo}`);
                  addActivityLog("Clinic Admin", "Admin", "Ticket Submitted", `${subject} (${newTkt.ticketNo})`, "Support");
                }}
                onClearNotifications={() => {
                  addToast("info", "Notifications Cleared", "All alerts marked as read.");
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Floating Interactive Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Quick Action Modals */}
      <QuickRegisterPatientModal
        isOpen={isQuickPatientOpen}
        onClose={() => setIsQuickPatientOpen(false)}
        onRegister={handleRegisterPatient}
      />

      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        patients={patients}
        doctors={doctors}
        onBook={handleBookAppointment}
      />

      <GenerateTokenModal
        isOpen={isGenerateTokenOpen}
        onClose={() => setIsGenerateTokenOpen(false)}
        patients={patients}
        doctors={doctors}
        onGenerate={handleGenerateToken}
      />

      <AddDoctorModal
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        onAddDoctor={handleAddDoctor}
      />

      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        patients={patients}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
}
