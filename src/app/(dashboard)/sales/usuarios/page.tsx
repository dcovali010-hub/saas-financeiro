"use client";

import { useState } from "react";
import { mockUsers } from "@/lib/mock-data";
import { getRoleColor, getRoleLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Plus, UserCog, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import type { User, UserRole } from "@/types";

const rolePermissions: Record<UserRole, string[]> = {
  admin: ["Dashboard", "All modules", "Users", "Settings"],
  financeiro: ["Dashboard", "Orders", "Clients", "Financial reports"],
  suporte: ["Dashboard", "Orders (view)", "Clients", "Domains"],
  vendedor: ["Dashboard", "Orders", "Clients", "Domains"],
};

export default function SalesUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [permModal, setPermModal] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "vendedor" as UserRole });

  const handleCreate = () => {
    if (!form.name || !form.email) {
      toast.error("Please fill in name and email");
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
    setForm({ name: "", email: "", role: "vendedor" });
    toast.success("User created successfully!");
  };

  const toggleActive = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
    toast.success("Status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">System Users</h2>
          <p className="text-gray-400 text-sm mt-0.5">Role-based access control</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New User
        </Button>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["admin", "financeiro", "suporte", "vendedor"] as UserRole[]).map((role) => {
          const count = users.filter((u) => u.role === role).length;
          const roleColors: Record<UserRole, string> = {
            admin: "from-purple-600 to-purple-800",
            financeiro: "from-blue-600 to-blue-800",
            suporte: "from-cyan-600 to-cyan-800",
            vendedor: "from-emerald-600 to-emerald-800",
          };
          return (
            <div key={role} className={`rounded-2xl p-4 bg-gradient-to-br ${roleColors[role]} text-white`}>
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">{getRoleLabel(role)}</p>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-white/60 text-xs mt-1">{rolePermissions[role].length} permissions</p>
            </div>
          );
        })}
      </div>

      {/* Users table */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#0f172a] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <span className="text-white text-sm font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-400 text-sm">{user.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className="flex items-center gap-2 text-sm transition-colors"
                    >
                      {user.active ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                          <span className="text-emerald-400">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-500">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setPermModal(user)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New User">
        <div className="space-y-4">
          <Input label="Name *" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email *" type="email" placeholder="email@agency.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
            <option value="admin">Administrator</option>
            <option value="financeiro">Finance</option>
            <option value="suporte">Support</option>
            <option value="vendedor">Sales</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}><Plus className="w-4 h-4" />Create User</Button>
          </div>
        </div>
      </Modal>

      {/* Permissions Modal */}
      <Modal open={!!permModal} onClose={() => setPermModal(null)} title={`Permissions — ${permModal?.name}`}>
        {permModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#0a0f1e] rounded-xl">
              <UserCog className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white text-sm font-medium">{getRoleLabel(permModal.role)}</p>
                <p className="text-gray-500 text-xs">Current role</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Allowed access</p>
              <div className="space-y-2">
                {rolePermissions[permModal.role].map((perm) => (
                  <div key={perm} className="flex items-center gap-2 p-2.5 bg-[#0a0f1e] rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
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
