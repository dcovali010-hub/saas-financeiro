"use client";

import { useState } from "react";
import { mockClients, mockOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { Plus, Users, Search, Mail, Phone, Building2, History } from "lucide-react";
import toast from "react-hot-toast";
import type { Client } from "@/types";

export default function SalesClientesPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [historyClient, setHistoryClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
  });

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Preencha nome, email e telefone");
      return;
    }
    const newClient: Client = {
      id: `CLI-${String(clients.length + 1).padStart(3, "0")}`,
      ...form,
      created_at: new Date().toISOString().split("T")[0],
      total_orders: 0,
      total_spent: 0,
    };
    setClients([newClient, ...clients]);
    setModalOpen(false);
    setForm({ name: "", email: "", phone: "", company: "" });
    toast.success("Cliente cadastrado com sucesso!");
  };

  const clientOrders = historyClient
    ? mockOrders.filter((o) => o.client_id === historyClient.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Clientes</h2>
          <p className="text-gray-400 text-sm mt-0.5">{filtered.length} clientes cadastrados</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div
            key={client.id}
            className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{client.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{client.name}</p>
                  {client.company && (
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {client.company}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Mail className="w-3.5 h-3.5 text-gray-600" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Phone className="w-3.5 h-3.5 text-gray-600" />
                <span>{client.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1f2937]">
              <div className="text-center">
                <p className="text-white text-sm font-bold">{client.total_orders}</p>
                <p className="text-gray-600 text-xs">Pedidos</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 text-sm font-bold">
                  {formatCurrency(client.total_spent)}
                </p>
                <p className="text-gray-600 text-xs">Total gasto</p>
              </div>
              <button
                onClick={() => setHistoryClient(client)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                Histórico
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-2xl">
          <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500">Nenhum cliente encontrado</p>
        </div>
      )}

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Cliente">
        <div className="space-y-4">
          <Input label="Nome *" placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email *" type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Telefone *" placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Empresa" placeholder="Nome da empresa (opcional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}><Plus className="w-4 h-4" />Cadastrar</Button>
          </div>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal
        open={!!historyClient}
        onClose={() => setHistoryClient(null)}
        title={`Histórico — ${historyClient?.name}`}
        size="lg"
      >
        {clientOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Nenhum pedido encontrado</p>
        ) : (
          <div className="space-y-3">
            {clientOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-[#0a0f1e] rounded-xl">
                <div>
                  <p className="text-white text-sm font-medium">{order.description}</p>
                  <p className="text-gray-500 text-xs">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  <span className="text-white text-sm font-semibold">{formatCurrency(order.value)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
