"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Upload,
  Eye,
  RefreshCw,
  X,
  AlertCircle,
  FileCheck,
  Lock,
} from "lucide-react";
import { DoctorProfessionalDocument } from "@/lib/types/doctor";

interface ProfessionalDocumentsCardProps {
  documents: DoctorProfessionalDocument[];
  onUploadDocument: (doc: DoctorProfessionalDocument) => void;
}

export default function ProfessionalDocumentsCard({
  documents,
  onUploadDocument,
}: ProfessionalDocumentsCardProps) {
  const [selectedDoc, setSelectedDoc] = useState<DoctorProfessionalDocument | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<DoctorProfessionalDocument["type"]>("Other");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: DoctorProfessionalDocument = {
      id: `doc-${Date.now()}`,
      name: docName.trim(),
      type: docType,
      uploadedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "pending",
      fileSize: "2.1 MB",
    };

    onUploadDocument(newDoc);
    setDocName("");
    setUploadModalOpen(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Professional Credentials & Licensing Documents
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              PRIVATE & CONFIDENTIAL
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified degree transcripts, PMDC licensing certifications, and clinical fellowship credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Document submitted for credential verification. Status: Pending Review.</span>
        </div>
      )}

      {/* Security Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
        <Lock className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Strict Privacy Guarantee:</strong> These documents are encrypted and accessible exclusively to the PMDC compliance committee. They are <strong>NEVER</strong> publicly visible on the patient-facing doctor directory.
        </p>
      </div>

      {/* Documents Table / Grid */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {doc.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{doc.type}</span>
                  <span>•</span>
                  <span>Uploaded {doc.uploadedDate}</span>
                  {doc.fileSize && (
                    <>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {doc.status === "verified" ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              ) : doc.status === "pending" ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Review</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Re-upload Required</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedDoc(doc)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Preview Document"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Document Preview: {selectedDoc.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <FileText className="w-12 h-12 text-sky-600 mx-auto" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedDoc.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Type: {selectedDoc.type} • File: PDF Encrypted • Size: {selectedDoc.fileSize || "2.1 MB"}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified with PMDC Registry Database</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Audit ID: DM-CERT-{selectedDoc.id.toUpperCase()}</span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <form
            onSubmit={handleUploadSubmit}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Professional Document
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Fellowship in Cardiac Electrophysiology Certificate"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Document Classification
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DoctorProfessionalDocument["type"])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="PMDC Registration">PMDC Registration Certificate</option>
                  <option value="Medical Degree">MBBS / Basic Medical Degree</option>
                  <option value="Specialty Certification">FCPS / Specialty Certification</option>
                  <option value="Fellowship">Sub-Specialty Fellowship</option>
                  <option value="License">State Medical License</option>
                  <option value="Other">Other Supporting Credential</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer">
                <Upload className="w-6 h-6 text-sky-600 mx-auto" />
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  Choose file or drag & drop here
                </p>
                <p className="text-[10px] text-slate-400">PDF, JPG, or PNG up to 10MB</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
