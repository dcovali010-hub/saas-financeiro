import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US").format(new Date(date));
}

export function formatTime(datetime: string): string {
  return new Date(datetime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateRelative(date: string): string {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

export function minutesAgo(datetime: string): number {
  return Math.floor((Date.now() - new Date(datetime).getTime()) / 60000);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Order statuses
    pendente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    preparando: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    pronto: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    entregue: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
    pago: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    // Table statuses
    livre: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ocupada: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    reservada: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    limpeza: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    // Reservation statuses
    confirmada: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    chegou: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: "Pending",
    preparando: "Preparing",
    pronto: "Ready",
    entregue: "Served",
    cancelado: "Cancelled",
    pago: "Paid",
    livre: "Available",
    ocupada: "Occupied",
    reservada: "Reserved",
    limpeza: "Cleaning",
    confirmada: "Confirmed",
    chegou: "Arrived",
  };
  return labels[status] || status;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    admin: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    gerente: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    garcom: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    cozinha: "bg-red-500/20 text-red-400 border-red-500/30",
    caixa: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cliente: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };
  return colors[role] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Owner",
    gerente: "Manager",
    garcom: "Waiter",
    cozinha: "Kitchen",
    caixa: "Cashier",
    cliente: "Guest",
  };
  return labels[role] || role;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    entradas: "Appetizers",
    pratos_principais: "Main Courses",
    sobremesas: "Desserts",
    bebidas: "Drinks",
  };
  return labels[category] || category;
}
