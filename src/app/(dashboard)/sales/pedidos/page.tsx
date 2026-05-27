"use client";

import { useState } from "react";
import { mockOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Plus, ShoppingCart, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/types";

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    client_name: "",
    description: "",
    value: "",
    status: "pendente",
    due_date: "",
  });

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.client_name.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!form.client_name || !form.description || !form.value) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      client_id: "new",
      client_name: form.client_name,
      description: form.description,
      value: parseFloat(form.value),
      status: form.status as Order["status"],
      module: "sales",
      created_at: new Date().toISOString().split("T")[0],
      due_date: form.due_date || undefined,
    };
    setOrders([newOrder, ...orders]);
    setModalOpen(false);
    setForm({ client_name: "", description: "", value: "", status: "pendente", due_date: "" });
    toast.success("Order created successfully!");
  };

  const totalValue = filtered.reduce((s, o) => s + o.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Orders</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {filtered.length} orders · {formatCurrency(totalValue)} total
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by client, description or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="todos">All statuses</option>
            <option value="pendente">Pending</option>
            <option value="processando">Processing</option>
            <option value="concluido">Completed</option>
            <option value="cancelado">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Client</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Description</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#0f172a] transition-colors group">
                  <td className="px-5 py-4">
                    <span className="text-gray-400 text-xs font-mono">{order.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 text-xs font-bold">
                          {order.client_name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-white text-sm font-medium">{order.client_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-gray-400 text-sm">{order.description}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white text-sm font-semibold">
                      {formatCurrency(order.value)}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-gray-400 text-sm">{formatDate(order.created_at)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toast.success(`Order ${order.id} opened`)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <div className="space-y-4">
          <Input
            label="Client *"
            placeholder="Client name"
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          />
          <Input
            label="Description *"
            placeholder="Service description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Amount ($) *"
            type="number"
            placeholder="0.00"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="pendente">Pending</option>
            <option value="processando">Processing</option>
            <option value="concluido">Completed</option>
            <option value="cancelado">Cancelled</option>
          </Select>
          <Input
            label="Due Date"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4" />
              Create Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
