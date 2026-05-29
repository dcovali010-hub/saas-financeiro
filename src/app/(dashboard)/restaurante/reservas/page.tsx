"use client";

import { useState } from "react";
import { mockReservations } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { CalendarCheck, Plus, Phone, Users } from "lucide-react";
import toast from "react-hot-toast";
import type { Reservation } from "@/types";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ client_name: "", phone: "", time: "", guests: "2", notes: "" });

  const handleCreate = () => {
    if (!form.client_name || !form.phone || !form.time) {
      toast.error("Name, phone and time are required");
      return;
    }
    const newRes: Reservation = {
      id: `RES-${String(reservations.length + 1).padStart(3, "0")}`,
      client_name: form.client_name,
      phone: form.phone,
      date: "2025-05-29",
      time: form.time,
      guests: parseInt(form.guests),
      status: "pendente",
      notes: form.notes || undefined,
    };
    setReservations([...reservations, newRes]);
    setModalOpen(false);
    setForm({ client_name: "", phone: "", time: "", guests: "2", notes: "" });
    toast.success("Reservation added!");
  };

  const updateStatus = (id: string, status: Reservation["status"]) => {
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    toast.success("Status updated");
  };

  const statusCount = {
    confirmada: reservations.filter((r) => r.status === "confirmada").length,
    pendente: reservations.filter((r) => r.status === "pendente").length,
    chegou: reservations.filter((r) => r.status === "chegou").length,
    cancelada: reservations.filter((r) => r.status === "cancelada").length,
  };

  const totalGuests = reservations.filter((r) => r.status !== "cancelada").reduce((s, r) => s + r.guests, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Reservations</h2>
          <p className="text-gray-400 text-sm mt-0.5">Tonight · {totalGuests} guests expected</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Reservation
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Confirmed", count: statusCount.confirmada, color: "emerald" },
          { label: "Pending", count: statusCount.pendente, color: "amber" },
          { label: "Arrived", count: statusCount.chegou, color: "blue" },
          { label: "Cancelled", count: statusCount.cancelada, color: "red" },
        ].map((s) => (
          <div key={s.label} className={`bg-${s.color}-500/10 border border-${s.color}-500/30 rounded-2xl p-4 text-center`}>
            <p className={`text-${s.color}-400 text-2xl font-bold`}>{s.count}</p>
            <p className={`text-${s.color}-400/70 text-xs mt-0.5`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#1f2937]">
          <h3 className="text-white font-semibold">Tonight&apos;s Schedule</h3>
        </div>
        <div className="divide-y divide-[#1f2937]">
          {[...reservations].sort((a, b) => a.time.localeCompare(b.time)).map((r) => (
            <div key={r.id} className="flex items-center justify-between p-5 hover:bg-[#0f172a] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 text-center">
                  <p className="text-white font-black text-sm">{r.time}</p>
                </div>
                <div className="w-px h-8 bg-[#1f2937]" />
                <div>
                  <p className="text-white font-semibold">{r.client_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Users className="w-3 h-3" />{r.guests} guests
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" />{r.phone}
                    </span>
                    {r.table_number && <span className="text-gray-500 text-xs">Table {r.table_number}</span>}
                  </div>
                  {r.notes && <p className="text-gray-600 text-xs mt-0.5 italic">{r.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(r.status)}>{getStatusLabel(r.status)}</Badge>
                {r.status === "pendente" && (
                  <button onClick={() => updateStatus(r.id, "confirmada")} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Confirm</button>
                )}
                {r.status === "confirmada" && (
                  <button onClick={() => updateStatus(r.id, "chegou")} className="text-xs text-blue-400 hover:text-blue-300 font-medium">Arrived</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Reservation">
        <div className="space-y-4">
          <Input label="Guest Name *" placeholder="Full name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
          <Input label="Phone *" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Time *" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <Select label="Guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
            {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
          </Select>
          <Input label="Notes" placeholder="Special requests, allergies..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}><CalendarCheck className="w-4 h-4" />Add Reservation</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
