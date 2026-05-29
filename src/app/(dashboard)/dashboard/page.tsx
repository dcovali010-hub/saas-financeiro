"use client";

import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/Badge";
import {
  mockStats, mockOrders, mockTables, mockMenuItems,
  mockReservations, mockInventory, mockWeeklyRevenue, mockUsers,
} from "@/lib/mock-data";
import type { Table, MenuItem, MenuCategory } from "@/types";
import {
  formatCurrency, formatTime, minutesAgo,
  getStatusColor, getStatusLabel, getRoleColor, getRoleLabel, getCategoryLabel,
} from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DollarSign, TrendingUp, Users, AlertCircle, ArrowRight,
  Clock, CheckCircle, ChefHat, ShoppingBag, CalendarCheck,
  Table2, Flame, Star, Package, CreditCard, Banknote,
  QrCode, UtensilsCrossed, Bell, BookOpen,
} from "lucide-react";

// ─── Owner ────────────────────────────────────────────────────────────────────
function OwnerDashboard() {
  const maxRevenue = Math.max(...mockWeeklyRevenue.map((d) => d.revenue));
  const activeOrders = mockOrders.filter((o) => !["pago", "cancelado"].includes(o.status));
  const todayPaid = mockOrders.filter((o) => o.status === "pago").reduce((s, o) => s + o.total, 0);
  const activeRevenue = activeOrders.reduce((s, o) => s + o.total, 0);
  const totalToday = todayPaid + activeRevenue;
  const occupancyPct = Math.round((mockStats.tables_occupied / mockStats.tables_total) * 100);

  const topItems: Record<string, { name: string; count: number; revenue: number }> = {};
  mockOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!topItems[item.name]) topItems[item.name] = { name: item.name, count: 0, revenue: 0 };
      topItems[item.name].count += item.quantity;
      topItems[item.name].revenue += item.quantity * item.price;
    });
  });
  const topItemsList = Object.values(topItems).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Golden Fork — Owner Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">Live business snapshot · Tonight</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Revenue Today" value={formatCurrency(totalToday)} subtitle="Live + paid" trend={12.4} icon={DollarSign} gradientClass="stat-card-gradient-1" />
        <StatsCard title="This Week" value={formatCurrency(mockStats.revenue_week)} subtitle="Mon–Sun" trend={8.2} icon={TrendingUp} gradientClass="stat-card-gradient-2" />
        <StatsCard title="Tables" value={`${mockStats.tables_occupied}/${mockStats.tables_total}`} subtitle={`${occupancyPct}% occupied`} icon={Table2} gradientClass="stat-card-gradient-3" />
        <StatsCard title="Avg Ticket" value={formatCurrency(mockStats.avg_ticket)} subtitle="Per guest" icon={ShoppingBag} gradientClass="stat-card-gradient-5" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold">Weekly Revenue</h3>
            <p className="text-gray-500 text-xs">Last 7 days</p>
          </div>
          <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />+8.2%
          </span>
        </div>
        <div className="flex items-end gap-2" style={{ height: "100px" }}>
          {mockWeeklyRevenue.map((d, i) => {
            const pct = Math.round((d.revenue / maxRevenue) * 100);
            const isLast = i === mockWeeklyRevenue.length - 1;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: "75px" }}>
                  <div className={`w-full rounded-t-md ${isLast ? "bg-amber-400" : "bg-amber-400/30"}`} style={{ height: `${pct}%` }} />
                </div>
                <span className="text-gray-500 text-[10px]">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active orders */}
        <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div>
              <h3 className="text-white font-semibold">Active Orders</h3>
              <p className="text-gray-500 text-xs">{activeOrders.length} tables open · {formatCurrency(activeRevenue)} in-house</p>
            </div>
            <Link href="/sales/pedidos" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm">
              All orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {activeOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-sm font-bold">T{order.table_number}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Table {order.table_number} · {order.guests} guests</p>
                    <p className="text-gray-500 text-xs">{order.items.length} items · {order.waiter_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  <p className="text-white text-sm font-bold mt-1">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Top items */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-semibold">Top Selling Tonight</h3>
            </div>
            <div className="space-y-3">
              {topItemsList.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs w-4 font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.count}x ordered</p>
                  </div>
                  <p className="text-amber-400 text-xs font-bold">{formatCurrency(item.revenue)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tonight's reservations */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-semibold">Tonight&apos;s Reservations</h3>
            </div>
            <div className="space-y-2">
              {mockReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs font-medium">{r.client_name}</p>
                    <p className="text-gray-500 text-xs">{r.time} · {r.guests} guests</p>
                  </div>
                  <Badge className={getStatusColor(r.status)}>{getStatusLabel(r.status)}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Manager ──────────────────────────────────────────────────────────────────
function ManagerDashboard() {
  const lowStock = mockInventory.filter((i) => i.quantity <= i.min_quantity);
  const activeOrders = mockOrders.filter((o) => !["pago", "cancelado"].includes(o.status));
  const staffOnDuty = mockUsers.filter((u) => u.active && u.role !== "cliente");

  const sectionMap: Record<string, Table[]> = {};
  mockTables.forEach((t) => {
    if (!sectionMap[t.section]) sectionMap[t.section] = [];
    sectionMap[t.section].push(t);
  });

  const tableStatusColor: Record<string, string> = {
    livre: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
    ocupada: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    reservada: "bg-amber-500/20 border-amber-500/30 text-amber-400",
    limpeza: "bg-gray-500/20 border-gray-500/30 text-gray-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Manager Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">Floor status & operations</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Tables Occupied" value={`${mockStats.tables_occupied}/${mockStats.tables_total}`} subtitle="Right now" icon={Table2} gradientClass="stat-card-gradient-3" />
        <StatsCard title="Active Orders" value={String(activeOrders.length)} subtitle="In the kitchen" icon={ChefHat} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Reservations" value={String(mockStats.reservations_today)} subtitle="Tonight" icon={CalendarCheck} gradientClass="stat-card-gradient-2" />
        <StatsCard title="Low Stock" value={String(lowStock.length)} subtitle="Items to reorder" icon={Package} gradientClass="stat-card-gradient-6" />
      </div>

      {/* Table map */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Floor Map</h3>
          <div className="flex items-center gap-3 text-xs">
            {["livre", "ocupada", "reservada", "limpeza"].map((s) => (
              <span key={s} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${tableStatusColor[s]}`}>
                {getStatusLabel(s)}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(sectionMap).map(([section, tables]) => (
            <div key={section}>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{section}</p>
              <div className="grid grid-cols-5 gap-2">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`rounded-xl p-3 border text-center ${tableStatusColor[table.status]}`}
                  >
                    <p className="font-bold text-sm">T{table.number}</p>
                    <p className="text-xs opacity-70">{table.capacity} pax</p>
                    {table.waiter_name && <p className="text-xs opacity-60 mt-0.5 truncate">{table.waiter_name}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tonight's reservations */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-semibold">Tonight&apos;s Reservations</h3>
            </div>
            <Link href="/restaurante/reservas" className="flex items-center gap-1 text-blue-400 text-sm">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {mockReservations.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors">
                <div>
                  <p className="text-white text-sm font-medium">{r.client_name}</p>
                  <p className="text-gray-500 text-xs">{r.time} · {r.guests} guests{r.table_number ? ` · Table ${r.table_number}` : " · unassigned"}</p>
                </div>
                <Badge className={getStatusColor(r.status)}>{getStatusLabel(r.status)}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock + Staff */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-amber-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-semibold">Low Stock Alerts</h3>
            </div>
            <div className="space-y-2">
              {lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-amber-500/5">
                  <p className="text-white text-xs font-medium">{item.name}</p>
                  <span className="text-amber-400 text-xs font-semibold">{item.quantity} {item.unit} left</span>
                </div>
              ))}
              {lowStock.length === 0 && <p className="text-gray-500 text-xs text-center py-2">All stock levels OK</p>}
            </div>
          </div>
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3">Staff on Duty</h3>
            <div className="space-y-2">
              {staffOnDuty.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{member.name}</p>
                  </div>
                  <Badge className={getRoleColor(member.role)}>{getRoleLabel(member.role)}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Waiter ───────────────────────────────────────────────────────────────────
function WaiterDashboard() {
  const { user } = useAuth();
  const myTables = mockTables.filter((t) => t.waiter_id === user?.id);
  const myOrders = mockOrders.filter((o) => o.waiter_id === user?.id && !["pago", "cancelado"].includes(o.status));
  const myRevenue = mockOrders.filter((o) => o.waiter_id === user?.id && o.status === "pago").reduce((s, o) => s + o.total, 0);

  const readyOrders = myOrders.filter((o) => o.status === "pronto");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Hey, {user?.name?.split(" ")[0]}! 👋</h2>
        <p className="text-gray-500 text-sm mt-0.5">Your tables and active orders</p>
      </div>

      {readyOrders.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400 animate-pulse" />
            <p className="text-emerald-400 font-semibold">{readyOrders.length} order{readyOrders.length > 1 ? "s" : ""} ready to serve!</p>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {readyOrders.map((o) => (
              <span key={o.id} className="text-emerald-400 text-sm font-bold bg-emerald-500/20 px-3 py-1 rounded-lg">
                Table {o.table_number}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="My Tables" value={String(myTables.length)} subtitle="Assigned to you" icon={Table2} gradientClass="stat-card-gradient-3" />
        <StatsCard title="Active Orders" value={String(myOrders.length)} subtitle="In progress" icon={ShoppingBag} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Revenue Closed" value={formatCurrency(myRevenue)} subtitle="Bills paid tonight" icon={DollarSign} gradientClass="stat-card-gradient-2" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* My tables */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">My Tables</h3>
            <Link href="/sales/clientes" className="flex items-center gap-1 text-blue-400 text-sm">
              All tables <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {myTables.map((table) => {
              const order = myOrders.find((o) => o.table_id === table.id);
              return (
                <div key={table.id} className={`rounded-xl p-3 border text-center ${order?.status === "pronto" ? "border-emerald-500/50 bg-emerald-500/10" : "border-[#1f2937] bg-[#0a0f1e]"}`}>
                  <p className="text-white font-bold text-lg">T{table.number}</p>
                  <p className="text-gray-500 text-xs">{table.capacity} pax</p>
                  {order && <Badge className={`${getStatusColor(order.status)} mt-1 text-[10px]`}>{getStatusLabel(order.status)}</Badge>}
                  {!order && <p className="text-gray-600 text-xs mt-1">No order</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active orders */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <h3 className="text-white font-semibold">My Orders</h3>
            <Link href="/sales/pedidos" className="flex items-center gap-1 text-blue-400 text-sm">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {myOrders.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No active orders</p>
            )}
            {myOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-sm font-semibold">Table {order.table_number} · {order.guests} guests</p>
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                </div>
                <div className="space-y-0.5">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-gray-500 text-xs">{item.quantity}x {item.name}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-600 text-xs">{minutesAgo(order.created_at)} min ago</p>
                  <p className="text-white text-sm font-bold">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Kitchen ──────────────────────────────────────────────────────────────────
function KitchenDashboard() {
  const pending = mockOrders.filter((o) => o.status === "pendente");
  const preparing = mockOrders.filter((o) => o.status === "preparando");
  const ready = mockOrders.filter((o) => o.status === "pronto");
  const queue = [...pending, ...preparing, ...ready];

  const orderCardColor: Record<string, string> = {
    pendente: "border-amber-500/40 bg-amber-500/5",
    preparando: "border-blue-500/40 bg-blue-500/5",
    pronto: "border-emerald-500/40 bg-emerald-500/5",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
          <Flame className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h2 className="text-white text-xl font-bold">Kitchen Queue</h2>
          <p className="text-gray-500 text-sm">Orders to prepare — live</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
          <p className="text-amber-400 text-3xl font-bold">{pending.length}</p>
          <p className="text-amber-400/70 text-sm mt-1">Incoming</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
          <p className="text-blue-400 text-3xl font-bold">{preparing.length}</p>
          <p className="text-blue-400/70 text-sm mt-1">Preparing</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
          <p className="text-emerald-400 text-3xl font-bold">{ready.length}</p>
          <p className="text-emerald-400/70 text-sm mt-1">Ready to Serve</p>
        </div>
      </div>

      {queue.length === 0 && (
        <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-2xl">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-semibold">All caught up!</p>
          <p className="text-gray-500 text-sm mt-1">No orders in the queue</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {queue.map((order) => {
          const elapsed = minutesAgo(order.created_at);
          const urgent = elapsed > 20 && order.status === "pendente";
          return (
            <div
              key={order.id}
              className={`rounded-2xl border p-4 ${urgent ? "border-red-500/50 bg-red-500/5" : orderCardColor[order.status]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white text-xl font-black">T{order.table_number}</span>
                  <span className="text-gray-500 text-xs">{order.guests} guests</span>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  <p className={`text-xs mt-0.5 ${urgent ? "text-red-400 font-semibold" : "text-gray-500"}`}>{elapsed}m ago</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white w-5 text-center bg-white/10 rounded">{item.quantity}</span>
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    {item.notes && <span className="text-amber-400 text-xs italic">({item.notes})</span>}
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-3">{order.waiter_name} · {formatTime(order.created_at)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Cashier ──────────────────────────────────────────────────────────────────
function CashierDashboard() {
  const readyToPay = mockOrders.filter((o) => o.status === "entregue");
  const paidOrders = mockOrders.filter((o) => o.status === "pago");
  const revenueToday = paidOrders.reduce((s, o) => s + o.total, 0);
  const openBills = readyToPay.reduce((s, o) => s + o.total, 0);

  const paymentBreakdown = {
    cartao: paidOrders.filter((o) => o.payment_method === "cartao").reduce((s, o) => s + o.total, 0),
    pix: paidOrders.filter((o) => o.payment_method === "pix").reduce((s, o) => s + o.total, 0),
    dinheiro: paidOrders.filter((o) => o.payment_method === "dinheiro").reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Cashier</h2>
        <p className="text-gray-500 text-sm mt-0.5">Payments & bills</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Ready to Pay" value={String(readyToPay.length)} subtitle="Tables waiting" icon={AlertCircle} gradientClass="stat-card-gradient-6" />
        <StatsCard title="Open Bills" value={formatCurrency(openBills)} subtitle="To collect" icon={ShoppingBag} gradientClass="stat-card-gradient-3" />
        <StatsCard title="Collected Today" value={formatCurrency(revenueToday)} subtitle={`${paidOrders.length} bills closed`} icon={DollarSign} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Orders Today" value={String(mockStats.orders_today)} subtitle="Total served" icon={CheckCircle} gradientClass="stat-card-gradient-2" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Ready to pay */}
        <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#1f2937]">
            <h3 className="text-white font-semibold">Tables Ready to Pay</h3>
            <p className="text-gray-500 text-xs mt-0.5">Bill requested — needs payment</p>
          </div>
          {readyToPay.length === 0 && (
            <div className="flex items-center justify-center gap-2 p-8">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-gray-400 text-sm">No open bills right now</p>
            </div>
          )}
          <div className="divide-y divide-[#1f2937]">
            {readyToPay.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-5 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-lg font-black">T{order.table_number}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{order.guests} guests · {order.items.length} items</p>
                    <p className="text-gray-500 text-xs">{order.waiter_name} · {minutesAgo(order.updated_at)} min ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-xl font-black">{formatCurrency(order.total)}</p>
                  <p className="text-gray-500 text-xs">{order.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1e]">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">Card</span>
                </div>
                <span className="text-blue-400 font-semibold">{formatCurrency(paymentBreakdown.cartao)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1e]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">PIX</span>
                </div>
                <span className="text-purple-400 font-semibold">{formatCurrency(paymentBreakdown.pix)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1e]">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm">Cash</span>
                </div>
                <span className="text-emerald-400 font-semibold">{formatCurrency(paymentBreakdown.dinheiro)}</span>
              </div>
            </div>
          </div>
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3">Bills Closed Today</h3>
            <div className="divide-y divide-[#1f2937]">
              {paidOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-white text-xs font-medium">Table {order.table_number}</p>
                    <p className="text-gray-600 text-xs">{order.payment_method ?? "—"}</p>
                  </div>
                  <p className="text-gray-400 text-sm font-semibold">{formatCurrency(order.total)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Guest (Customer) ─────────────────────────────────────────────────────────
function GuestDashboard() {
  const { user } = useAuth();
  const table = mockTables.find((t) => t.id === user?.table_id);
  const order = mockOrders.find((o) => o.table_id === user?.table_id && !["pago", "cancelado"].includes(o.status));

  const menuByCategory = mockMenuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories: MenuCategory[] = ["entradas", "pratos_principais", "sobremesas", "bebidas"];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-white text-xl font-bold">Welcome to Golden Fork!</h2>
            <p className="text-amber-400/80 text-sm">Table {table?.number} · {table?.capacity} seats · {table?.section}</p>
          </div>
        </div>
      </div>

      {/* Current order */}
      {order && (
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-semibold">Your Current Order</h3>
            </div>
            <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">{item.quantity}</span>
                  <p className="text-white text-sm">{item.name}</p>
                </div>
                <p className="text-gray-400 text-sm">{formatCurrency(item.quantity * item.price)}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-5 border-t border-[#1f2937]">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="text-white text-lg font-black">{formatCurrency(order.total)}</span>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-left">
          <Bell className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-white text-sm font-semibold">Call Waiter</p>
            <p className="text-gray-500 text-xs">Need assistance</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-left">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-white text-sm font-semibold">Request Bill</p>
            <p className="text-gray-500 text-xs">Ready to pay</p>
          </div>
        </button>
      </div>

      {/* Menu */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-[#1f2937]">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-white font-semibold">Our Menu</h3>
        </div>
        <div className="p-4 space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">{getCategoryLabel(cat)}</p>
              <div className="space-y-2">
                {(menuByCategory[cat] ?? []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0a0f1e] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        {item.popular && <Star className="w-3 h-3 text-amber-400" />}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{item.description}</p>
                    </div>
                    <p className="text-amber-400 font-bold text-sm ml-4 whitespace-nowrap">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === "admin") return <OwnerDashboard />;
  if (role === "gerente") return <ManagerDashboard />;
  if (role === "garcom") return <WaiterDashboard />;
  if (role === "cozinha") return <KitchenDashboard />;
  if (role === "caixa") return <CashierDashboard />;
  if (role === "cliente") return <GuestDashboard />;
  return <OwnerDashboard />;
}
