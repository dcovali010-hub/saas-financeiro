"use client";

import { useState } from "react";
import { mockTables, mockOrders } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor, getStatusLabel, formatCurrency, minutesAgo } from "@/lib/utils";
import { Table2, Users, Clock, CheckCircle } from "lucide-react";
import type { Table } from "@/types";

const sectionOrder = ["Window", "Main Floor", "Private"];

const statusConfig: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  livre:    { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
  ocupada:  { bg: "bg-blue-500/10",    border: "border-blue-500/30",    text: "text-blue-400",    dot: "bg-blue-400"    },
  reservada:{ bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-400",   dot: "bg-amber-400"   },
  limpeza:  { bg: "bg-gray-500/10",    border: "border-gray-500/30",    text: "text-gray-400",    dot: "bg-gray-400"    },
};

export default function TablesPage() {
  const [tables] = useState<Table[]>(mockTables);
  const [filter, setFilter] = useState<string>("todos");

  const activeOrders = mockOrders.filter((o) => !["pago", "cancelado"].includes(o.status));

  const filtered = tables.filter((t) => filter === "todos" || t.status === filter);

  const sectionMap: Record<string, Table[]> = {};
  filtered.forEach((t) => {
    if (!sectionMap[t.section]) sectionMap[t.section] = [];
    sectionMap[t.section].push(t);
  });

  const counts = {
    livre: tables.filter((t) => t.status === "livre").length,
    ocupada: tables.filter((t) => t.status === "ocupada").length,
    reservada: tables.filter((t) => t.status === "reservada").length,
    limpeza: tables.filter((t) => t.status === "limpeza").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Tables</h2>
        <p className="text-gray-400 text-sm mt-0.5">{tables.length} tables · {counts.ocupada} occupied</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["livre", "ocupada", "reservada", "limpeza"] as const).map((s) => {
          const cfg = statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "todos" : s)}
              className={`rounded-2xl p-4 border transition-all text-left ${cfg.bg} ${cfg.border} ${filter === s ? "ring-2 ring-offset-2 ring-offset-[#0a0f1e]" : ""}`}
            >
              <div className={`w-2 h-2 rounded-full ${cfg.dot} mb-2`} />
              <p className={`text-2xl font-bold ${cfg.text}`}>{counts[s]}</p>
              <p className={`text-xs mt-0.5 ${cfg.text} opacity-70`}>{getStatusLabel(s)}</p>
            </button>
          );
        })}
      </div>

      {/* Table grid by section */}
      <div className="space-y-6">
        {sectionOrder.map((section) => {
          const sectionTables = sectionMap[section];
          if (!sectionTables || sectionTables.length === 0) return null;
          return (
            <div key={section}>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{section}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {sectionTables.map((table) => {
                  const cfg = statusConfig[table.status];
                  const order = activeOrders.find((o) => o.table_id === table.id);
                  return (
                    <div
                      key={table.id}
                      className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border} hover:opacity-80 transition-opacity cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-2xl font-black ${cfg.text}`}>T{table.number}</span>
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${cfg.dot}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Users className={`w-3 h-3 ${cfg.text} opacity-70`} />
                          <span className="text-gray-400 text-xs">{table.capacity} seats</span>
                        </div>
                        {table.waiter_name && (
                          <p className="text-gray-500 text-xs truncate">{table.waiter_name}</p>
                        )}
                        {order && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                            <p className={`text-xs font-bold ${cfg.text} mt-1`}>{formatCurrency(order.total)}</p>
                            <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />{minutesAgo(order.created_at)}m
                            </p>
                          </div>
                        )}
                        {table.status === "livre" && (
                          <div className="mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-xs">Ready</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-2xl">
          <Table2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500">No tables match this filter</p>
        </div>
      )}
    </div>
  );
}
