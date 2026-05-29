export type UserRole = "admin" | "gerente" | "garcom" | "cozinha" | "caixa" | "cliente";

export type TableStatus = "livre" | "ocupada" | "reservada" | "limpeza";
export type OrderStatus = "pendente" | "preparando" | "pronto" | "entregue" | "cancelado" | "pago";
export type MenuCategory = "entradas" | "pratos_principais" | "sobremesas" | "bebidas";
export type PaymentMethod = "dinheiro" | "cartao" | "pix";
export type ReservationStatus = "confirmada" | "pendente" | "cancelada" | "chegou";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  active: boolean;
  table_id?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  section: string;
  waiter_id?: string;
  waiter_name?: string;
  opened_at?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  available: boolean;
  prep_time: number;
  popular?: boolean;
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  table_id: string;
  table_number: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  waiter_id: string;
  waiter_name: string;
  guests: number;
  created_at: string;
  updated_at: string;
  payment_method?: PaymentMethod;
}

export interface Reservation {
  id: string;
  client_name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  table_id?: string;
  table_number?: number;
  status: ReservationStatus;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  category: string;
  last_updated: string;
}

export interface DashboardStats {
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  tables_occupied: number;
  tables_total: number;
  orders_today: number;
  reservations_today: number;
  avg_ticket: number;
  items_low_stock: number;
}
