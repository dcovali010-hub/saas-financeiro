"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sales/pedidos": "Orders",
  "/sales/clientes": "Clients",
  "/sales/usuarios": "Users",
  "/sales/dominios": "Domains",
  "/ia/agente": "AI Agent",
  "/ia/gerar-site": "Generate Site",
  "/ia/whatsapp": "WhatsApp",
};

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const pageTitle = routeLabels[pathname] ?? "Panel";

  return (
    <header className="h-16 bg-[#0f172a] border-b border-[#1f2937] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-white font-semibold text-base">{pageTitle}</h1>
        <p className="text-gray-500 text-xs">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-[#0a0f1e] border border-[#1f2937] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-40"
          />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-[#1f2937] transition-colors text-gray-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-[#1f2937]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user?.name?.charAt(0) ?? "A"}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-white text-xs font-medium leading-tight">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
