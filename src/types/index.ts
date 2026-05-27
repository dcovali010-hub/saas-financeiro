export type UserRole = "admin" | "financeiro" | "suporte" | "vendedor";

export type OrderStatus =
  | "pendente"
  | "processando"
  | "concluido"
  | "cancelado";

export type DomainStatus = "ativo" | "vencido" | "pendente" | "transferindo";

export type HostingStatus = "ativo" | "suspenso" | "cancelado" | "pendente";

export type SiteStatus = "rascunho" | "em_producao" | "publicado" | "pausado";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
}

export interface Order {
  id: string;
  client_id: string;
  client_name: string;
  description: string;
  value: number;
  status: OrderStatus;
  module: "sales" | "website_mensal";
  created_at: string;
  due_date?: string;
}

export interface Domain {
  id: string;
  domain: string;
  client_id: string;
  client_name: string;
  expiry_date: string;
  status: DomainStatus;
  auto_renew: boolean;
  registrar?: string;
  price_yearly: number;
}

export interface Hosting {
  id: string;
  plan: string;
  client_id: string;
  client_name: string;
  monthly_value: number;
  expiry_date: string;
  status: HostingStatus;
  server: string;
  disk_usage?: number;
  disk_limit?: number;
}

export interface GeneratedSite {
  id: string;
  client_id: string;
  client_name: string;
  site_name: string;
  business_type: string;
  domain?: string;
  status: SiteStatus;
  created_at: string;
  url?: string;
}

export interface WhatsAppMessage {
  id: string;
  contact: string;
  phone: string;
  message: string;
  direction: "inbound" | "outbound";
  timestamp: string;
  status: "sent" | "delivered" | "read" | "failed";
  type: "text" | "template" | "billing" | "followup";
}

export interface AIAgent {
  id: string;
  name: string;
  prompt: string;
  active: boolean;
  triggers: string[];
  responses: number;
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  monthly_revenue: number;
  total_orders: number;
  total_clients: number;
  active_hostings: number;
  pending_domains: number;
  pending_payments: number;
  monthly_growth: number;
}
