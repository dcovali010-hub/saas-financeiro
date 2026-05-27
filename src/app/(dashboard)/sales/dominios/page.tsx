"use client";

import { useState } from "react";
import { mockDomains } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateRelative, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Plus, Globe, RefreshCw, AlertTriangle, Search } from "lucide-react";
import toast from "react-hot-toast";
import type { Domain } from "@/types";

export default function SalesDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    domain: "", client_name: "", expiry_date: "", registrar: "", price_yearly: "", auto_renew: "true",
  });

  const filtered = domains.filter(
    (d) =>
      d.domain.toLowerCase().includes(search.toLowerCase()) ||
      d.client_name.toLowerCase().includes(search.toLowerCase())
  );

  const expiringCount = domains.filter((d) => {
    const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / (86400000));
    return days <= 30 && days > 0;
  }).length;

  const handleCreate = () => {
    if (!form.domain || !form.client_name || !form.expiry_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newDomain: Domain = {
      id: `DOM-${String(domains.length + 1).padStart(3, "0")}`,
      domain: form.domain,
      client_id: "new",
      client_name: form.client_name,
      expiry_date: form.expiry_date,
      status: "ativo",
      auto_renew: form.auto_renew === "true",
      registrar: form.registrar,
      price_yearly: parseFloat(form.price_yearly) || 0,
    };
    setDomains([newDomain, ...domains]);
    setModalOpen(false);
    setForm({ domain: "", client_name: "", expiry_date: "", registrar: "", price_yearly: "", auto_renew: "true" });
    toast.success("Domain registered!");
  };

  const handleRenew = (id: string) => {
    setDomains(domains.map((d) => {
      if (d.id !== id) return d;
      const current = new Date(d.expiry_date);
      current.setFullYear(current.getFullYear() + 1);
      return { ...d, expiry_date: current.toISOString().split("T")[0], status: "ativo" };
    }));
    toast.success("Domain renewed for +1 year!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Domains</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {filtered.length} domains
            {expiringCount > 0 && (
              <span className="ml-2 text-amber-400">· {expiringCount} expiring soon</span>
            )}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Domain
        </Button>
      </div>

      {expiringCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-sm">
            <strong>{expiringCount} domain(s)</strong> expiring in the next 30 days. Please review and renew.
          </p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search domain or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Domain</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Client</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Expiry</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Auto Renew</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Price/Year</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {filtered.map((domain) => (
                <tr key={domain.id} className="hover:bg-[#0f172a] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-white text-sm font-medium">{domain.domain}</span>
                    </div>
                    {domain.registrar && (
                      <p className="text-gray-600 text-xs ml-6">{domain.registrar}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-300 text-sm">{domain.client_name}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div>
                      <p className="text-white text-sm">{formatDate(domain.expiry_date)}</p>
                      <p className="text-gray-500 text-xs">{formatDateRelative(domain.expiry_date)}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={getStatusColor(domain.status)}>{getStatusLabel(domain.status)}</Badge>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={domain.auto_renew ? "text-emerald-400 text-sm" : "text-gray-500 text-sm"}>
                      {domain.auto_renew ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-gray-300 text-sm">{formatCurrency(domain.price_yearly)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleRenew(domain.id)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Domain">
        <div className="space-y-4">
          <Input label="Domain *" placeholder="example.com" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
          <Input label="Client *" placeholder="Client name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
          <Input label="Expiry Date *" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          <Input label="Registrar" placeholder="GoDaddy, Namecheap..." value={form.registrar} onChange={(e) => setForm({ ...form, registrar: e.target.value })} />
          <Input label="Yearly Price ($)" type="number" placeholder="45.00" value={form.price_yearly} onChange={(e) => setForm({ ...form, price_yearly: e.target.value })} />
          <Select label="Auto Renew" value={form.auto_renew} onChange={(e) => setForm({ ...form, auto_renew: e.target.value })}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}><Plus className="w-4 h-4" />Register</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
