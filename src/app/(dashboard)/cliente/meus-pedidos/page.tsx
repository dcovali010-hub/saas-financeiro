"use client";

import { useAuth } from "@/contexts/AuthContext";
import { mockOrders, mockTables } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import { ShoppingBag, Clock, ChefHat, CheckCircle } from "lucide-react";

export default function MyOrderPage() {
  const { user } = useAuth();
  const table = mockTables.find((t) => t.id === user?.table_id);
  const order = mockOrders.find((o) => o.table_id === user?.table_id && !["pago", "cancelado"].includes(o.status));

  if (!order) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-white text-xl font-bold">My Order</h2>
          <p className="text-gray-400 text-sm mt-0.5">Table {table?.number}</p>
        </div>
        <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-2xl">
          <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-semibold">No active order</p>
          <p className="text-gray-500 text-sm mt-1">Browse the menu to order.</p>
        </div>
      </div>
    );
  }

  const statusSteps = ["pendente", "preparando", "pronto", "entregue"];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">My Order</h2>
        <p className="text-gray-400 text-sm mt-0.5">Table {table?.number} · {order.id}</p>
      </div>

      {/* Status tracker */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Order Status</h3>
          <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
        </div>
        <div className="flex items-center gap-1 mt-4">
          {statusSteps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${i <= currentStep ? "bg-amber-500 text-white" : "bg-[#1f2937] text-gray-600"}`}>
                {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < statusSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? "bg-amber-500" : "bg-[#1f2937]"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {["Received", "Preparing", "Ready", "Served"].map((label) => (
            <span key={label} className="text-gray-600 text-[10px] flex-1 text-center">{label}</span>
          ))}
        </div>
      </div>

      {/* Order items */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-[#1f2937]">
          <ChefHat className="w-4 h-4 text-amber-400" />
          <h3 className="text-white font-semibold">Your Items</h3>
          <p className="text-gray-500 text-xs ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3" />{order.items.length} items
          </p>
        </div>
        <div className="divide-y divide-[#1f2937]">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">{item.quantity}</span>
                <p className="text-white text-sm font-medium">{item.name}</p>
              </div>
              <p className="text-gray-400 text-sm">{formatCurrency(item.quantity * item.price)}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between p-5 border-t border-[#1f2937]">
          <span className="text-gray-400">Total</span>
          <span className="text-white text-xl font-black">{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="text-center text-gray-600 text-xs">
        Ordered at {formatTime(order.created_at)} · Waiter: {order.waiter_name}
      </div>
    </div>
  );
}
