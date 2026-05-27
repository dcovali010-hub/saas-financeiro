"use client";

import { useState } from "react";
import { mockWebsiteOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Plus, ShoppingCart, Search, Globe } from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/types";

export default function WebsiteMensalPedidosPage() {
  const [orders, setOrders] = useState<Order[]>(mockWebsiteOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ client_name: "", description: "", value: "", status: "pendente" });

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.client_name.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const monthlyRecurring = orders.filter((o) => o.status === "concluido").reduce((s, o) => s + o.value, 0);

  const handleCreate = () => {
    if (!form.client_name || !form.description || !form.value) {
      toast.error("Preencha todos os campos");
      return;
    }
    const newOrder: Order = {
      id: `WEB-${String(orders.length + 1).padStart(3, "0")}`,
      client_id: "new",
      client_name: form.client_name,
      description: form.description,
      value: parseFloat(form.value),
      status: form.status as Order["status"],
      module: "website_mensal",
      created_at: new Date().toISOString().split("T")[0],
    };
    setOrders([newOrder, ...orders]);
    setModalOpen(false);
    setForm({ client_name: "", description: "", value: "", status: "pendente" });
    toast.success("Pedido mensal criado!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Pedidos — Website Mensal</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {filtered.length} pedidos · MRR: <span className="text-emerald-400 font-semibold">{formatCurrency(monthlyRecurring)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Website Mensal</span>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Novo Pedido
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Cliente</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Plano/Descrição</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Valor/mês</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#0f172a] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-gray-400 text-xs font-mono">{order.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white text-sm font-medium">{order.client_name}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-gray-400 text-sm">{order.description}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white text-sm font-semibold">{formatCurrency(order.value)}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-gray-400 text-sm">{formatDate(order.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500">Nenhum pedido mensal</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Pedido Mensal">
        <div className="space-y-4">
          <Input label="Cliente *" placeholder="Nome do cliente" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
          <Input label="Plano/Descrição *" placeholder="Manutenção mensal — Plano Pro" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Valor Mensal (R$) *" type="number" placeholder="150.00" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="pendente">Pendente</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}><Plus className="w-4 h-4" />Criar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
