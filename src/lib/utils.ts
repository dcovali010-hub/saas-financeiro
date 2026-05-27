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

export function formatDateRelative(date: string): string {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `Expired ${Math.abs(days)} days ago`;
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  if (days <= 7) return `Expires in ${days} days`;
  if (days <= 30) return `Expires in ${Math.ceil(days / 7)} weeks`;
  return `Expires in ${Math.ceil(days / 30)} months`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ativo: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    concluido: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pendente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    processando: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
    suspenso: "bg-red-500/20 text-red-400 border-red-500/30",
    vencido: "bg-red-500/20 text-red-400 border-red-500/30",
    transferindo: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    rascunho: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    em_producao: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    publicado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pausado: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ativo: "Active",
    concluido: "Completed",
    pendente: "Pending",
    processando: "Processing",
    cancelado: "Cancelled",
    suspenso: "Suspended",
    vencido: "Expired",
    transferindo: "Transferring",
    rascunho: "Draft",
    em_producao: "In Production",
    publicado: "Published",
    pausado: "Paused",
  };
  return labels[status] || status;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    financeiro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    suporte: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    vendedor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  return colors[role] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Administrator",
    financeiro: "Finance",
    suporte: "Support",
    vendedor: "Sales",
  };
  return labels[role] || role;
}
