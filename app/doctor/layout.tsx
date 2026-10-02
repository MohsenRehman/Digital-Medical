import type { Metadata } from "next";
import { DoctorProvider } from "@/app/context/DoctorContext";
import { NavigationProvider } from "@/components/doctor/loading/NavigationProgress";
import { DoctorToastProvider } from "@/components/doctor/loading/DoctorToast";
import DoctorLayoutShell from "@/components/doctor/DoctorLayoutShell";

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
      <NavigationProvider>
        <DoctorToastProvider>
          <DoctorLayoutShell>{children}</DoctorLayoutShell>
        </DoctorToastProvider>
      </NavigationProvider>
    </DoctorProvider>
  );
}
