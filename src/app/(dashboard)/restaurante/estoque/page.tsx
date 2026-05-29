"use client";

import { useState } from "react";
import { mockInventory } from "@/lib/mock-data";
import { Package, AlertTriangle, CheckCircle, Search } from "lucide-react";
import type { InventoryItem } from "@/types";

export default function InventoryPage() {
  const [items] = useState<InventoryItem[]>(mockInventory);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "low" | "ok">("todos");

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    if (filter === "low") return matchSearch && item.quantity <= item.min_quantity;
    if (filter === "ok") return matchSearch && item.quantity > item.min_quantity;
    return matchSearch;
  });

  const lowCount = items.filter((i) => i.quantity <= i.min_quantity).length;
  const okCount = items.filter((i) => i.quantity > i.min_quantity).length;

  const categories = Array.from(new Set(items.map((i) => i.category))).sort();
  const byCategory: Record<string, InventoryItem[]> = {};
  categories.forEach((cat) => {
    byCategory[cat] = filtered.filter((i) => i.category === cat);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Inventory</h2>
        <p className="text-gray-400 text-sm mt-0.5">{items.length} items tracked · {lowCount} need reorder</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setFilter("todos")} className={`rounded-2xl p-4 border text-center transition-all ${filter === "todos" ? "border-blue-500/50 bg-blue-500/10" : "border-[#1f2937] bg-[#111827]"}`}>
          <Package className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-white text-2xl font-bold">{items.length}</p>
          <p className="text-gray-500 text-xs">Total Items</p>
        </button>
        <button onClick={() => setFilter("low")} className={`rounded-2xl p-4 border text-center transition-all ${filter === "low" ? "border-red-500/50 bg-red-500/10" : "border-[#1f2937] bg-[#111827]"}`}>
          <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-red-400 text-2xl font-bold">{lowCount}</p>
          <p className="text-gray-500 text-xs">Low Stock</p>
        </button>
        <button onClick={() => setFilter("ok")} className={`rounded-2xl p-4 border text-center transition-all ${filter === "ok" ? "border-emerald-500/50 bg-emerald-500/10" : "border-[#1f2937] bg-[#111827]"}`}>
          <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-emerald-400 text-2xl font-bold">{okCount}</p>
          <p className="text-gray-500 text-xs">Well Stocked</p>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search items or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
        />
      </div>

      <div className="space-y-6">
        {categories.map((cat) => {
          const catItems = byCategory[cat];
          if (!catItems || catItems.length === 0) return null;
          return (
            <div key={cat}>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{cat}</p>
              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1f2937]">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Item</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Stock</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden sm:table-cell">Min</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2937]">
                    {catItems.map((item) => {
                      const isLow = item.quantity <= item.min_quantity;
                      const pct = Math.min(100, Math.round((item.quantity / (item.min_quantity * 2)) * 100));
                      return (
                        <tr key={item.id} className="hover:bg-[#0f172a] transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-white text-sm font-medium">{item.name}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-[#1f2937] rounded-full h-1.5 hidden sm:block">
                                <div
                                  className={`h-1.5 rounded-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className={`text-sm font-semibold ${isLow ? "text-red-400" : "text-white"}`}>
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <span className="text-gray-500 text-sm">{item.min_quantity} {item.unit}</span>
                          </td>
                          <td className="px-5 py-4">
                            {isLow ? (
                              <span className="flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle className="w-3.5 h-3.5" />Reorder
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-emerald-400">
                                <CheckCircle className="w-3.5 h-3.5" />OK
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
