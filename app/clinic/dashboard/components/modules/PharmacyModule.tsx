"use client";

import React, { useState } from "react";
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  X,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import { DashboardMedicine, DashboardPatient } from "../../types";

interface PharmacyModuleProps {
  medicines: DashboardMedicine[];
  patients: DashboardPatient[];
  onAddMedicine: (med: DashboardMedicine) => void;
  onDispense: (medId: string, qty: number, patientName: string) => void;
}

export const PharmacyModule: React.FC<PharmacyModuleProps> = ({
  medicines,
  patients,
  onAddMedicine,
  onDispense,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [dispenseModalMed, setDispenseModalMed] = useState<DashboardMedicine | null>(null);
  const [dispenseQty, setDispenseQty] = useState(1);
  const [selectedPatientName, setSelectedPatientName] = useState(patients[0]?.name || "Walk-in Customer");

  // Form states
  const [newName, setNewName] = useState("");
  const [newGeneric, setNewGeneric] = useState("");
  const [newCategory, setNewCategory] = useState<DashboardMedicine["category"]>("Tablet");
  const [newStrength, setNewStrength] = useState("");
  const [newQty, setNewQty] = useState(50);
  const [newPrice, setNewPrice] = useState(100);

  const filteredMeds = medicines.filter((m) => {
    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batchNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = medicines.filter((m) => m.stockStatus === "low_stock").length;
  const outOfStockCount = medicines.filter((m) => m.stockStatus === "out_of_stock").length;
  const expiringCount = medicines.filter((m) => m.stockStatus === "expiring_soon").length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const med: DashboardMedicine = {
      id: `med-${Date.now()}`,
      name: newName.trim(),
      generic: newGeneric.trim() || newName.trim(),
      category: newCategory,
      strength: newStrength || "500 mg",
      batchNo: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: newQty,
      unit: newCategory === "Syrup" ? "Bottles" : "Packs",
      reorderLevel: 15,
      purchasePrice: Math.round(newPrice * 0.8),
      salePrice: newPrice,
      expiryDate: "Dec 2027",
      stockStatus: newQty <= 15 ? "low_stock" : "in_stock",
      supplier: "Local Pharma Distributor",
    };

    onAddMedicine(med);
    setShowAddModal(false);
    setNewName("");
  };

  const handleDispenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispenseModalMed) return;
    onDispense(dispenseModalMed.id, dispenseQty, selectedPatientName);
    setDispenseModalMed(null);
    setDispenseQty(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP PHARMACY KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Catalog Items
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {medicines.length}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-0.5 block">
            Active medicines
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Low Stock Alerts
          </span>
          <div className="text-2xl font-black text-amber-500 mt-1">{lowStockCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
            Below threshold
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Out of Stock
          </span>
          <div className="text-2xl font-black text-rose-500 mt-1">{outOfStockCount}</div>
          <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">
            Needs purchase order
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Expiring Soon
          </span>
          <div className="text-2xl font-black text-purple-500 mt-1">{expiringCount}</div>
          <span className="text-[11px] text-purple-600 font-semibold mt-0.5 block">
            Within 6 months
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Today's Rx Sales
          </span>
          <div className="text-2xl font-black text-emerald-500 mt-1">PKR 2,450</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Prescriptions filled
          </span>
        </div>
      </div>

      {/* 2. CONTROLS TOOLBAR */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine brand or generic..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Dosage Forms</option>
            <option value="Tablet">Tablets</option>
            <option value="Syrup">Syrups</option>
            <option value="Injection">Injections</option>
            <option value="Capsule">Capsules</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* 3. MEDICINE CATALOG TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="py-3 px-4">Brand & Strength</th>
                <th className="py-3 px-3">Generic Formula</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Batch No</th>
                <th className="py-3 px-3">Stock Count</th>
                <th className="py-3 px-3">Price (PKR)</th>
                <th className="py-3 px-3">Expiry</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredMeds.map((med) => (
                <tr
                  key={med.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {med.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{med.supplier}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-semibold">
                    {med.generic}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {med.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">{med.batchNo}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {med.quantity} {med.unit}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    Rs. {med.salePrice}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">{med.expiryDate}</td>
                  <td className="py-3.5 px-3">
                    {med.stockStatus === "in_stock" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        In Stock
                      </span>
                    )}
                    {med.stockStatus === "low_stock" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                        Low Stock
                      </span>
                    )}
                    {med.stockStatus === "out_of_stock" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                        Out of Stock
                      </span>
                    )}
                    {med.stockStatus === "expiring_soon" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        Expiring Soon
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      disabled={med.quantity <= 0}
                      onClick={() => setDispenseModalMed(med)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        med.quantity > 0
                          ? "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 hover:bg-teal-100 cursor-pointer"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Dispense
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DISPENSE MODAL */}
      {dispenseModalMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Dispense Medicine (POS)
                </h3>
                <span className="text-xs text-teal-600 font-bold">{dispenseModalMed.name}</span>
              </div>
              <button
                onClick={() => setDispenseModalMed(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispenseSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Available In Stock:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dispenseModalMed.quantity} {dispenseModalMed.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Retail Unit Price:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    PKR {dispenseModalMed.salePrice}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dispense to Patient *
                </label>
                <select
                  value={selectedPatientName}
                  onChange={(e) => setSelectedPatientName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Walk-in Customer">Walk-in Customer</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity to Dispense *
                </label>
                <input
                  type="number"
                  min="1"
                  max={dispenseModalMed.quantity}
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex justify-between font-bold">
                <span>Total Pharmacy Bill:</span>
                <span className="text-teal-700 dark:text-teal-300 font-mono text-sm">
                  PKR {(dispenseQty * dispenseModalMed.salePrice).toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispenseModalMed(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Confirm & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD MEDICINE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add New Medicine
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Brufen 400mg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Generic Formula
                </label>
                <input
                  type="text"
                  value={newGeneric}
                  onChange={(e) => setNewGeneric(e.target.value)}
                  placeholder="e.g. Ibuprofen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Form
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Capsule">Capsule</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Strength
                  </label>
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="400 mg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sale Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
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
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
