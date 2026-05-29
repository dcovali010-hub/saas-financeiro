"use client";

import { useState } from "react";
import { mockMenuItems } from "@/lib/mock-data";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";
import { BookOpen, Star, Clock, Search } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/types";

const categories: MenuCategory[] = ["entradas", "pratos_principais", "sobremesas", "bebidas"];

const categoryColors: Record<MenuCategory, string> = {
  entradas: "text-green-400 bg-green-500/10 border-green-500/20",
  pratos_principais: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  sobremesas: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  bebidas: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function MenuPage() {
  const [items] = useState<MenuItem[]>(mockMenuItems);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "todos">("todos");

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "todos" || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  const byCategory = categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = filtered.filter((i) => i.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-amber-400" />
        <div>
          <h2 className="text-white text-xl font-bold">Menu</h2>
          <p className="text-gray-400 text-sm">{items.length} items · Golden Fork</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory("todos")}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${activeCategory === "todos" ? "bg-amber-500 text-white" : "bg-[#111827] border border-[#1f2937] text-gray-400 hover:text-white"}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors border ${activeCategory === cat ? `${categoryColors[cat]} border-current` : "bg-[#111827] border-[#1f2937] text-gray-400 hover:text-white"}`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const catItems = byCategory[cat];
          if (!catItems || catItems.length === 0) return null;
          const colorCls = categoryColors[cat];
          return (
            <div key={cat}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-semibold mb-4 ${colorCls}`}>
                {getCategoryLabel(cat)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-[#111827] border rounded-2xl p-4 hover:border-gray-600 transition-colors ${!item.available ? "opacity-50" : "border-[#1f2937]"}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                        {item.popular && <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </div>
                      <p className="text-amber-400 font-black text-sm ml-3 whitespace-nowrap">{formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{item.prep_time} min</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.available ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-500"}`}>
                        {item.available ? "Available" : "86&apos;d"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
