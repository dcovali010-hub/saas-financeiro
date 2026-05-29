"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers } from "@/lib/mock-data";
import { getRoleColor, getRoleLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Plus, Shield, ToggleLeft, ToggleRight, Users } from "lucide-react";
import toast from "react-hot-toast";
import type { User, UserRole } from "@/types";

const rolePermissions: Record<UserRole, string[]> = {
  admin:    ["Dashboard", "All modules", "Staff management", "Reports"],
  gerente:  ["Dashboard", "Tables", "Orders", "Reservations", "Inventory"],
  garcom:   ["Dashboard", "Tables", "Orders"],
  cozinha:  ["Dashboard", "Kitchen queue"],
  caixa:    ["Dashboard", "Orders", "Payments"],
  cliente:  ["Menu", "My order", "Rate experience"],
};

const roleColors: Record<UserRole, string> = {
  admin:   "from-amber-500 to-amber-700",
  gerente: "from-purple-600 to-purple-800",
  garcom:  "from-blue-600 to-blue-800",
  cozinha: "from-red-600 to-red-800",
  caixa:   "from-emerald-600 to-emerald-800",
  cliente: "from-pink-600 to-pink-800",
};

export default function StaffPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(mockUsers.filter((u) => u.role !== "cliente"));
  const [modalOpen, setModalOpen] = useState(false);
  const [permModal, setPermModal] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "garcom" as UserRole });

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const handleCreate = () => {
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      ...form,
      created_at: new Date().toISOString().split("T")[0],
      active: true,
    };
    setUsers([...users, newUser]);
    setModalOpen(false);
    setForm({ name: "", email: "", role: "garcom" });
    toast.success("Staff member added!");
  };

  const toggleActive = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
    toast.success("Status updated");
  };

  const DISPLAY_ROLES: UserRole[] = ["admin", "gerente", "garcom", "cozinha", "caixa"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Staff</h2>
          <p className="text-gray-400 text-sm mt-0.5">Golden Fork team management</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Staff
        </Button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {DISPLAY_ROLES.map((role) => {
          const count = users.filter((u) => u.role === role).length;
          return (
            <div key={role} className={`rounded-2xl p-4 bg-gradient-to-br ${roleColors[role]} text-white`}>
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">{getRoleLabel(role)}</p>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-white/60 text-xs mt-1">{rolePermissions[role].length} permissions</p>
            </div>
          );
        })}
      </div>

      {/* Staff table */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Staff</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#0f172a] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{u.name.charAt(0)}</span>
                      </div>
                      <span className="text-white text-sm font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-gray-400 text-sm">{u.email}</span></td>
                  <td className="px-5 py-4"><Badge className={getRoleColor(u.role)}>{getRoleLabel(u.role)}</Badge></td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(u.id)} className="flex items-center gap-2 text-sm transition-colors">
                      {u.active ? (
                        <><ToggleRight className="w-5 h-5 text-emerald-400" /><span className="text-emerald-400">Active</span></>
                      ) : (
                        <><ToggleLeft className="w-5 h-5 text-gray-500" /><span className="text-gray-500">Inactive</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setPermModal(u)} className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                      <Shield className="w-3.5 h-3.5" />Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <div className="space-y-4">
          <Input label="Name *" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email *" type="email" placeholder="name@goldenfork.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
            <option value="gerente">Manager</option>
            <option value="garcom">Waiter</option>
            <option value="cozinha">Kitchen</option>
            <option value="caixa">Cashier</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}><Users className="w-4 h-4" />Add Member</Button>
          </div>
        </div>
      </Modal>

      {/* Permissions Modal */}
      <Modal open={!!permModal} onClose={() => setPermModal(null)} title={`Permissions — ${permModal?.name}`}>
        {permModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#0a0f1e] rounded-xl">
              <Badge className={getRoleColor(permModal.role)}>{getRoleLabel(permModal.role)}</Badge>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Allowed access</p>
              <div className="space-y-2">
                {rolePermissions[permModal.role].map((perm) => (
                  <div key={perm} className="flex items-center gap-2 p-2.5 bg-[#0a0f1e] rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setPermModal(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
