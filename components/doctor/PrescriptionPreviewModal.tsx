"use client";

import React from "react";
import MedicalDocumentViewer from "@/components/doctor/MedicalDocumentViewer";
import { DigitalPrescription, ClinicalEncounter } from "@/lib/types/doctor";
import { DocumentType } from "@/lib/doctor/medicalDocumentTemplates";

export interface PrescriptionPreviewModalProps {
  prescription: DigitalPrescription | null;
  encounter?: ClinicalEncounter | null;
  initialDocType?: DocumentType;
  onClose: () => void;
}

export default function PrescriptionPreviewModal({
  prescription,
  encounter,
  initialDocType = "prescription",
  onClose,
}: PrescriptionPreviewModalProps) {
  if (!prescription && !encounter) return null;

  return (
    <MedicalDocumentViewer
      prescription={prescription}
      encounter={encounter}
      initialDocType={initialDocType}
      onClose={onClose}
    />
  );
}
