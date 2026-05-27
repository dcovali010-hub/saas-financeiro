"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserCog,
  Globe,
  Bot,
  Wand2,
  MessageCircle,
  LogOut,
  Zap,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "PRINCIPAL",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "SALES / VENDAS",
    items: [
      { label: "Pedidos", href: "/sales/pedidos", icon: ShoppingCart },
      { label: "Clientes", href: "/sales/clientes", icon: Users },
      { label: "Usuários", href: "/sales/usuarios", icon: UserCog },
      { label: "Domínios", href: "/sales/dominios", icon: Globe },
    ],
  },
  {
    title: "IA & COMUNICAÇÃO",
    items: [
      { label: "Agente IA", href: "/ia/agente", icon: Bot },
      { label: "Gerar Site", href: "/ia/gerar-site", icon: Wand2 },
      { label: "WhatsApp", href: "/ia/whatsapp", icon: MessageCircle },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso");
    router.push("/login");
    onClose?.();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#1f2937] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">AgênciaSaaS</p>
            <p className="text-gray-500 text-xs">Painel Financeiro</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">
              {section.title}
            </p>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    active
                      ? "sidebar-item-active text-white"
                      : "text-gray-400 hover:bg-[#1f2937] hover:text-gray-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      active ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <ChevronRight className="w-3 h-3 ml-auto text-blue-300 opacity-70" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-[#1f2937] p-3 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0) ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#111827] border border-[#1f2937] text-gray-300 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#0a0f1e] border-r border-[#1f2937] h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-[260px] bg-[#0a0f1e] border-r border-[#1f2937] animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
