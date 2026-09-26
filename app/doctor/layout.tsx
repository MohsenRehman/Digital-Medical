import type { Metadata } from "next";
import { DoctorProvider } from "@/app/context/DoctorContext";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";

export const metadata: Metadata = {
  title: "Doctor Dashboard | Digital Medical",
  description: "Clinical Doctor Workspace, Patient Queue, Consultations & Prescriptions",
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DoctorProvider>
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-body">
        {/* Persistent Doctor Navigation Sidebar */}
        <DoctorSidebar />

        {/* Main Content Area */}
        <div className="md:pl-64 flex flex-col min-h-screen transition-all">
          {/* Header */}
          <DoctorHeader />

          {/* Page Body */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </DoctorProvider>
  );
}
