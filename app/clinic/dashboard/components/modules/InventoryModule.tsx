"use client";

import React, { useState } from "react";
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package,
  ArrowDownRight,
  ArrowUpRight,
  X,
} from "lucide-react";
import { DashboardInventoryItem } from "../../types";

interface InventoryModuleProps {
  inventory: DashboardInventoryItem[];
  onStockAdjustment: (id: string, delta: number) => void;
  onAddItem: (item: DashboardInventoryItem) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  onStockAdjustment,
  onAddItem,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Item form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DashboardInventoryItem["category"]>("Consumable");
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState("Units");
  const [reorderLevel, setReorderLevel] = useState(25);
  const [location, setLocation] = useState("Cabinet 1");

  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = inventory.filter((i) => i.status === "Low Stock" || i.status === "Critical").length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: DashboardInventoryItem = {
      id: `inv-${Date.now()}`,
      itemCode: `MED-ITM-0${Math.floor(10 + Math.random() * 90)}`,
      name: name.trim(),
      category,
      quantity,
      unit,
      reorderLevel,
      supplier: "Central Healthcare Supplies",
      lastRestocked: "Today",
      status: quantity <= reorderLevel ? "Low Stock" : "In Stock",
      location,
    };

    onAddItem(newItem);
    setShowAddModal(false);
    setName("");
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Inventory Items
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {inventory.length}
          </div>
          <span className="text-[11px] text-sky-600 font-semibold mt-0.5 block">
            Consumables & PPE
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Low Stock Warnings
          </span>
          <div className="text-2xl font-black text-amber-500 mt-1">{lowStockCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
            Reorder threshold hit
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Suppliers Connected
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">5</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
            Verified distributors
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Restock Cycle
          </span>
          <div className="text-2xl font-black text-emerald-500 mt-1">Bi-weekly</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Next scheduled: 01 Oct
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
              placeholder="Search supplies by name or code..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Consumable">Consumable</option>
            <option value="Surgical">Surgical</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="PPE / Hygiene">PPE / Hygiene</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Supply Item</span>
        </button>
      </div>

      {/* 3. INVENTORY TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="py-3 px-4">Item Code</th>
                <th className="py-3 px-3">Item Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Reorder Threshold</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                    {item.itemCode}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.supplier}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-black text-slate-900 dark:text-white">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{item.location}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">{item.reorderLevel}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "In Stock"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                          : item.status === "Low Stock"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onStockAdjustment(item.id, -1)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Stock Out (-1)"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => onStockAdjustment(item.id, 5)}
                        className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950 text-sky-600 font-bold cursor-pointer"
                        title="Stock In (+5)"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADD ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add Supply Item
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
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Surgical Face Masks 3-ply"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Consumable">Consumable</option>
                    <option value="Surgical">Surgical</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="PPE / Hygiene">PPE / Hygiene</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Boxes"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reorder Alert Level
                  </label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
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
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
