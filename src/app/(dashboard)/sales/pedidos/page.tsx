"use client";

import { useState } from "react";
import { mockOrders } from "@/lib/mock-data";
import { formatCurrency, formatTime, minutesAgo, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ShoppingBag, Search, Filter, ChefHat, Clock } from "lucide-react";
import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ativos");

  const filtered = orders.filter((o) => {
    const matchSearch =
      String(o.table_number).includes(search) ||
      o.waiter_name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === "ativos") return matchSearch && !["pago", "cancelado"].includes(o.status);
    if (filterStatus === "todos") return matchSearch;
    return matchSearch && o.status === filterStatus;
  });

  const totalValue = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Orders</h2>
        <p className="text-gray-400 text-sm mt-0.5">{filtered.length} orders · {formatCurrency(totalValue)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by table, waiter or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm"
          >
            <option value="ativos">Active orders</option>
            <option value="todos">All orders</option>
            <option value="pendente">Pending</option>
            <option value="preparando">Preparing</option>
            <option value="pronto">Ready</option>
            <option value="entregue">Served</option>
            <option value="pago">Paid</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-2xl">
            <ShoppingBag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
        {filtered.map((order) => (
          <div key={order.id} className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between p-4 border-b border-[#1f2937]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-lg font-black">T{order.table_number}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">Table {order.table_number}</p>
                    <span className="text-gray-600 text-sm">·</span>
                    <p className="text-gray-400 text-sm">{order.guests} guests</p>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <ChefHat className="w-3 h-3" />{order.waiter_name}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{minutesAgo(order.created_at)}m ago · {formatTime(order.created_at)}
                    </span>
                    <span className="text-gray-600 text-xs font-mono">{order.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                <p className="text-white text-lg font-black">{formatCurrency(order.total)}</p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0f1e]">
                  <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{item.quantity}</span>
                  <span className="text-gray-300 text-sm truncate">{item.name}</span>
                  <span className="text-gray-500 text-xs ml-auto">{formatCurrency(item.quantity * item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
