"use client";

import { useState } from "react";
import { mockHostings } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateRelative, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Plus, Server, Search, HardDrive, AlertTriangle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import type { Hosting } from "@/types";

export default function HospedagemPage() {
  const [hostings, setHostings] = useState<Hosting[]>(mockHostings);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    plan: "", client_name: "", monthly_value: "", expiry_date: "", server: "", disk_limit: "",
  });

  const filtered = hostings.filter((h) => {
    const matchSearch =
      h.client_name.toLowerCase().includes(search.toLowerCase()) ||
      h.plan.toLowerCase().includes(search.toLowerCase()) ||
      h.server.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || h.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = hostings.filter((h) => h.status === "ativo").length;
  const monthlyRevenue = hostings.filter((h) => h.status === "ativo").reduce((s, h) => s + h.monthly_value, 0);
  const expiringCount = hostings.filter((h) => {
    const days = Math.ceil((new Date(h.expiry_date).getTime() - Date.now()) / 86400000);
    return days <= 30 && days > 0;
  }).length;

  const handleCreate = () => {
    if (!form.plan || !form.client_name || !form.monthly_value || !form.expiry_date || !form.server) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const newHosting: Hosting = {
      id: `HOST-${String(hostings.length + 1).padStart(3, "0")}`,
      plan: form.plan,
      client_id: "new",
      client_name: form.client_name,
      monthly_value: parseFloat(form.monthly_value),
      expiry_date: form.expiry_date,
      status: "ativo",
      server: form.server,
      disk_limit: parseInt(form.disk_limit) * 1024 || 5120,
      disk_usage: 0,
    };
    setHostings([newHosting, ...hostings]);
    setModalOpen(false);
    setForm({ plan: "", client_name: "", monthly_value: "", expiry_date: "", server: "", disk_limit: "" });
    toast.success("Hospedagem criada com sucesso!");
  };

  const handleRenew = (id: string) => {
    setHostings(hostings.map((h) => {
      if (h.id !== id) return h;
      const date = new Date(h.expiry_date);
      date.setMonth(date.getMonth() + 1);
      return { ...h, expiry_date: date.toISOString().split("T")[0], status: "ativo" };
    }));
    toast.success("Hospedagem renovada por +1 mês!");
  };

  const getDiskPercent = (h: Hosting) => {
    if (!h.disk_usage || !h.disk_limit) return 0;
    return Math.round((h.disk_usage / h.disk_limit) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Hospedagens</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {activeCount} ativas · MRR: <span className="text-emerald-400 font-semibold">{formatCurrency(monthlyRevenue)}</span>
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Nova Hospedagem
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: hostings.length, color: "text-white", bg: "bg-[#111827]" },
          { label: "Ativas", value: activeCount, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Suspensas", value: hostings.filter(h => h.status === "suspenso").length, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Vencendo", value: expiringCount, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-[#1f2937] rounded-2xl p-4`}>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {expiringCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-sm">
            <strong>{expiringCount} hospedagem(ns)</strong> vencendo em 30 dias. Contate os clientes.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar cliente, plano ou servidor..."
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
          <option value="ativo">Ativo</option>
          <option value="suspenso">Suspenso</option>
          <option value="cancelado">Cancelado</option>
          <option value="pendente">Pendente</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((hosting) => {
          const diskPercent = getDiskPercent(hosting);
          return (
            <div
              key={hosting.id}
              className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Server className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{hosting.client_name}</p>
                    <p className="text-gray-500 text-xs">{hosting.plan}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(hosting.status)}>{getStatusLabel(hosting.status)}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div>
                  <p className="text-emerald-400 text-sm font-bold">{formatCurrency(hosting.monthly_value)}/mês</p>
                  <p className="text-gray-600 text-xs">Mensalidade</p>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{hosting.server}</p>
                  <p className="text-gray-600 text-xs">Servidor</p>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{formatDate(hosting.expiry_date)}</p>
                  <p className="text-gray-600 text-xs">{formatDateRelative(hosting.expiry_date)}</p>
                </div>
              </div>

              {hosting.disk_usage !== undefined && hosting.disk_limit !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <HardDrive className="w-3 h-3" />
                      Disco
                    </div>
                    <span className="text-gray-400 text-xs">
                      {Math.round(hosting.disk_usage / 1024)}GB / {Math.round(hosting.disk_limit / 1024)}GB ({diskPercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        diskPercent > 80 ? "bg-red-500" : diskPercent > 60 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${diskPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => handleRenew(hosting.id)}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Renovar +1 mês
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Hospedagem" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Plano *" placeholder="Plano Pro" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} />
          <Input label="Cliente *" placeholder="Nome do cliente" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
          <Input label="Valor Mensal (R$) *" type="number" placeholder="120.00" value={form.monthly_value} onChange={(e) => setForm({ ...form, monthly_value: e.target.value })} />
          <Input label="Data de Vencimento *" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          <Input label="Servidor *" placeholder="BR-SERVER-01" value={form.server} onChange={(e) => setForm({ ...form, server: e.target.value })} />
          <Input label="Limite de Disco (GB)" type="number" placeholder="10" value={form.disk_limit} onChange={(e) => setForm({ ...form, disk_limit: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate}><Plus className="w-4 h-4" />Criar Hospedagem</Button>
        </div>
      </Modal>
    </div>
  );
}
