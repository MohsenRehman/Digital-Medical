"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Building2,
  User,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles
} from "lucide-react";

export default function ClinicsJoinUs() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    category: "General Medicine",
    clinicName: "",
    licenseNumber: "",
    labAvailable: true,
    pharmacyAvailable: true,
    emergency24: false,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      alert("Please enter First Name and Email address.");
      return;
    }
    setCurrentStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <section id="clinics-join" className="py-16 sm:py-24 relative z-10 overflow-hidden">
      {/* Background Doctor Banner with Deep Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600&auto=format&fit=crop"
          alt="Doctors team background"
          fill
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/95 via-slate-900/95 to-sky-900/95" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 border border-sky-200 dark:border-sky-800">
            <Building2 className="w-3.5 h-3.5" />
            <span>PARTNER WITH DIGITAL MEDICAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Clinics — Join Us
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Clinic owners to register or claim clinic profile to receive instant appointments on your digital clinic profile.
          </p>
        </div>

        {/* Stepper Card */}
        <div className="glass-panel bg-white/95 dark:bg-[#0b1426]/90 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 dark:border-slate-700/80 backdrop-blur-xl">
          
          {/* Step Progress Navigation */}
          <div className="grid grid-cols-2 gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentStep === 1
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                1
              </span>
              <span>Step 1: Contact Details</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (formData.firstName && formData.email) setCurrentStep(2);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentStep === 2
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                2
              </span>
              <span>Step 2: Clinic Services</span>
            </button>
          </div>

          {/* Form Content */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-4 animate-fadeInUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Registration Submitted Successfully!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for joining our network, <span className="font-semibold text-slate-900 dark:text-white">{formData.firstName}</span>. Our clinic onboarding team will verify your accreditation and activate your digital profile within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setCurrentStep(1);
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
                >
                  Register Another Clinic
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={currentStep === 1 ? handleStep1Submit : handleFinalSubmit}>
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeInUp">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          name="firstName"
                          required
                          placeholder="e.g. Dr. Jennifer"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          name="lastName"
                          required
                          placeholder="e.g. Adams"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="clinic@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        City / Location
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          name="city"
                          placeholder="e.g. New York, NY"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone / Direct Line
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Primary Specialty Category
                      </label>
                      <div className="relative">
                        <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="General Medicine">General Medicine & Family</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Pulmonology">Pulmonology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Diagnostics">Laboratory & Imaging Center</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 shadow-md shadow-sky-600/30 btn-glow flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Step 2</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeInUp">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Clinic / Facility Legal Name *
                      </label>
                      <input
                        type="text"
                        name="clinicName"
                        required
                        placeholder="e.g. Metro Care Health Center"
                        value={formData.clinicName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Medical License / Accreditation No. *
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        required
                        placeholder="e.g. MED-NYC-98402"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Available Clinical Services Checkboxes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Facilities Available on Site
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:border-sky-500">
                        <input
                          type="checkbox"
                          name="labAvailable"
                          checked={formData.labAvailable}
                          onChange={handleChange}
                          className="w-4 h-4 text-sky-600 rounded"
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          24/7 Pathology Lab
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:border-sky-500">
                        <input
                          type="checkbox"
                          name="pharmacyAvailable"
                          checked={formData.pharmacyAvailable}
                          onChange={handleChange}
                          className="w-4 h-4 text-sky-600 rounded"
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          In-House Pharmacy
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:border-sky-500">
                        <input
                          type="checkbox"
                          name="emergency24"
                          checked={formData.emergency24}
                          onChange={handleChange}
                          className="w-4 h-4 text-sky-600 rounded"
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          24/7 Emergency Unit
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Step 1</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 shadow-lg shadow-sky-600/30 btn-glow flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          <span>Processing Registration...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>REGISTER CLINIC PROFILE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Footer note from screenshot */}
          <div className="mt-8 pt-4 border-t border-slate-200/70 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Clinic owners to register or claim clinic profile: </span>
            <a
              href="mailto:partner@digitalmedical.com"
              className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
            >
              clinic.digitalmedical.com
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

