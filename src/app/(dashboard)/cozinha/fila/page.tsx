"use client";

import { useState } from "react";
import { mockOrders } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor, getStatusLabel, formatTime, minutesAgo } from "@/lib/utils";
import { Flame, CheckCircle, Clock } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const QUEUE_STATUSES: OrderStatus[] = ["pendente", "preparando", "pronto"];

export default function KitchenQueuePage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const queue = orders.filter((o) => QUEUE_STATUSES.includes(o.status));
  const pending = queue.filter((o) => o.status === "pendente");
  const preparing = queue.filter((o) => o.status === "preparando");
  const ready = queue.filter((o) => o.status === "pronto");

  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next: Record<string, OrderStatus> = { pendente: "preparando", preparando: "pronto", pronto: "entregue" };
        const newStatus = next[o.status] as OrderStatus;
        toast.success(`Order T${o.table_number} → ${getStatusLabel(newStatus)}`);
        return { ...o, status: newStatus, updated_at: new Date().toISOString() };
      })
    );
  };

  const cardBorder: Record<string, string> = {
    pendente: "border-amber-500/40 bg-amber-500/5",
    preparando: "border-blue-500/40 bg-blue-500/5",
    pronto: "border-emerald-500/40 bg-emerald-500/5",
  };

  const advanceLabel: Record<string, string> = {
    pendente: "Start Preparing →",
    preparando: "Mark Ready →",
    pronto: "Served ✓",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
          <Flame className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h2 className="text-white text-xl font-bold">Kitchen Queue</h2>
          <p className="text-gray-500 text-sm">{queue.length} active tickets</p>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
          <p className="text-amber-400 text-4xl font-black">{pending.length}</p>
          <p className="text-amber-400/70 text-sm mt-1">Incoming</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
          <p className="text-blue-400 text-4xl font-black">{preparing.length}</p>
          <p className="text-blue-400/70 text-sm mt-1">Preparing</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
          <p className="text-emerald-400 text-4xl font-black">{ready.length}</p>
          <p className="text-emerald-400/70 text-sm mt-1">Ready</p>
        </div>
      </div>

      {queue.length === 0 && (
        <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-2xl">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-semibold text-lg">All caught up!</p>
          <p className="text-gray-500 text-sm mt-1">No tickets in the queue</p>
        </div>
      )}

      {/* Tickets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...pending, ...preparing, ...ready].map((order) => {
          const elapsed = minutesAgo(order.created_at);
          const urgent = elapsed > 20 && order.status === "pendente";
          return (
            <div
              key={order.id}
              className={`rounded-2xl border p-4 ${urgent ? "border-red-500/60 bg-red-500/5" : cardBorder[order.status]}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-white text-3xl font-black">T{order.table_number}</span>
                  <div>
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${urgent ? "text-red-400 font-bold" : "text-gray-500"}`}>
                      <Clock className="w-3 h-3" />{elapsed}m · {formatTime(order.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">{order.guests} guests</p>
                  <p className="text-gray-600 text-xs">{order.waiter_name}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 border-b border-white/5 last:border-0">
                    <span className="text-white text-sm font-black w-6 text-center bg-white/10 rounded py-0.5">{item.quantity}</span>
                    <span className="text-gray-200 text-sm flex-1">{item.name}</span>
                    {item.notes && <span className="text-amber-400 text-xs italic">({item.notes})</span>}
                  </div>
                ))}
              </div>

              <button
                onClick={() => advance(order.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  order.status === "pendente" ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" :
                  order.status === "preparando" ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" :
                  "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                }`}
              >
                {advanceLabel[order.status]}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
