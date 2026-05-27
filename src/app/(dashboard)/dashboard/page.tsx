"use client";

import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { mockStats, mockOrders, mockClients, mockDomains } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateRelative, getStatusColor, getStatusLabel } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DollarSign, TrendingUp, ShoppingCart, Users, AlertCircle,
  ArrowRight, Globe, Clock, CheckCircle, XCircle, Loader2,
  TrendingDown, UserPlus, Target,
} from "lucide-react";

// ─── Admin ────────────────────────────────────────────────────────────────────
function AdminDashboard() {
  const recentOrders = mockOrders.slice(0, 5);
  const pendingOrders = mockOrders.filter((o) => o.status === "pendente");
  const expiringDomains = mockDomains.filter((d) => {
    const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / 86400000);
    return days <= 30;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Business Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">Full system visibility</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard title="Total Revenue" value={formatCurrency(mockStats.total_revenue)} subtitle="All time" trend={mockStats.monthly_growth} icon={DollarSign} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Monthly Revenue" value={formatCurrency(mockStats.monthly_revenue)} subtitle="May 2025" trend={18.5} icon={TrendingUp} gradientClass="stat-card-gradient-2" />
        <StatsCard title="Total Orders" value={String(mockStats.total_orders)} subtitle={`${pendingOrders.length} pending`} icon={ShoppingCart} gradientClass="stat-card-gradient-3" />
        <StatsCard title="Active Clients" value={String(mockStats.total_clients)} subtitle="Registered clients" icon={Users} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Domains" value={String(mockDomains.length)} subtitle={`${expiringDomains.length} expiring soon`} icon={Globe} gradientClass="stat-card-gradient-5" />
        <StatsCard title="Pending Payments" value={String(mockStats.pending_payments)} subtitle="Awaiting confirmation" icon={AlertCircle} gradientClass="stat-card-gradient-6" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div>
              <h3 className="text-white font-semibold">Recent Orders</h3>
              <p className="text-gray-500 text-xs mt-0.5">Latest transactions</p>
            </div>
            <Link href="/sales/pedidos" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{order.client_name}</p>
                    <p className="text-gray-500 text-xs">{order.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  <p className="text-white text-sm font-semibold">{formatCurrency(order.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "New Order", href: "/sales/pedidos", color: "text-blue-400" },
                { label: "New Client", href: "/sales/clientes", color: "text-emerald-400" },
                { label: "Manage Users", href: "/sales/usuarios", color: "text-purple-400" },
                { label: "AI Agent", href: "/ia/agente", color: "text-cyan-400" },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0f172a] transition-colors group">
                  <span className={`text-sm font-medium ${a.color}`}>{a.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {expiringDomains.length > 0 && (
            <div className="bg-[#111827] border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-semibold">Expiry Alerts</h3>
              </div>
              <div className="space-y-2">
                {expiringDomains.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-xs font-medium">{d.domain}</p>
                      <p className="text-gray-500 text-xs">{formatDateRelative(d.expiry_date)}</p>
                    </div>
                    <Badge className={getStatusColor(d.status)}>{getStatusLabel(d.status)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Finance ──────────────────────────────────────────────────────────────────
function FinanceDashboard() {
  const pendingOrders = mockOrders.filter((o) => o.status === "pendente");
  const completedOrders = mockOrders.filter((o) => o.status === "concluido");
  const processingOrders = mockOrders.filter((o) => o.status === "processando");
  const pendingRevenue = pendingOrders.reduce((s, o) => s + o.value, 0);
  const collectedRevenue = completedOrders.reduce((s, o) => s + o.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Finance Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">Revenue, billing & payments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value={formatCurrency(mockStats.total_revenue)} subtitle="All time" trend={mockStats.monthly_growth} icon={DollarSign} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Monthly Revenue" value={formatCurrency(mockStats.monthly_revenue)} subtitle="May 2025" trend={18.5} icon={TrendingUp} gradientClass="stat-card-gradient-2" />
        <StatsCard title="Collected" value={formatCurrency(collectedRevenue)} subtitle={`${completedOrders.length} orders paid`} icon={CheckCircle} gradientClass="stat-card-gradient-2" />
        <StatsCard title="Awaiting Payment" value={formatCurrency(pendingRevenue)} subtitle={`${pendingOrders.length} invoices open`} icon={AlertCircle} gradientClass="stat-card-gradient-6" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pending payments list */}
        <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div>
              <h3 className="text-white font-semibold">Pending Invoices</h3>
              <p className="text-gray-500 text-xs mt-0.5">Orders awaiting payment</p>
            </div>
            <Link href="/sales/pedidos" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              All orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {pendingOrders.length === 0 && (
              <div className="flex items-center gap-3 p-6 text-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-gray-400 text-sm">All invoices paid</p>
              </div>
            )}
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{order.client_name}</p>
                    <p className="text-gray-500 text-xs">{order.description}</p>
                    {order.due_date && <p className="text-amber-400 text-xs">Due: {formatDate(order.due_date)}</p>}
                  </div>
                </div>
                <p className="text-amber-400 text-sm font-bold">{formatCurrency(order.value)}</p>
              </div>
            ))}
            {processingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{order.client_name}</p>
                    <p className="text-gray-500 text-xs">{order.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">{formatCurrency(order.value)}</p>
                  <p className="text-blue-400 text-xs">Processing</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients by spend */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Top Clients by Revenue</h3>
          </div>
          <div className="space-y-4">
            {[...mockClients].sort((a, b) => b.total_spent - a.total_spent).slice(0, 5).map((client, i) => (
              <div key={client.id} className="flex items-center gap-3">
                <span className="text-gray-600 text-xs w-4 font-mono">{i + 1}</span>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{client.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{client.name}</p>
                  <p className="text-gray-500 text-xs">{client.total_orders} orders</p>
                </div>
                <p className="text-emerald-400 text-xs font-bold whitespace-nowrap">{formatCurrency(client.total_spent)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#1f2937]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Collected</span>
              <span className="text-emerald-400 font-semibold">{formatCurrency(collectedRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Pending</span>
              <span className="text-amber-400 font-semibold">{formatCurrency(pendingRevenue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sales ────────────────────────────────────────────────────────────────────
function SalesDashboard() {
  const pendingOrders = mockOrders.filter((o) => o.status === "pendente");
  const processingOrders = mockOrders.filter((o) => o.status === "processando");
  const completedOrders = mockOrders.filter((o) => o.status === "concluido");
  const cancelledOrders = mockOrders.filter((o) => o.status === "cancelado");
  const recentClients = [...mockClients].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const pipelineStages = [
    { label: "Pending", count: pendingOrders.length, color: "bg-amber-500", icon: Clock, textColor: "text-amber-400" },
    { label: "In Progress", count: processingOrders.length, color: "bg-blue-500", icon: Loader2, textColor: "text-blue-400" },
    { label: "Completed", count: completedOrders.length, color: "bg-emerald-500", icon: CheckCircle, textColor: "text-emerald-400" },
    { label: "Cancelled", count: cancelledOrders.length, color: "bg-red-500", icon: XCircle, textColor: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Sales Pipeline</h2>
        <p className="text-gray-500 text-sm mt-0.5">Your deals and client activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Orders" value={String(mockStats.total_orders)} subtitle="All time" icon={ShoppingCart} gradientClass="stat-card-gradient-3" />
        <StatsCard title="Active Clients" value={String(mockStats.total_clients)} subtitle="In your portfolio" icon={Users} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Pending Deals" value={String(pendingOrders.length)} subtitle="Need your attention" icon={Target} gradientClass="stat-card-gradient-6" />
        <StatsCard title="Closed This Month" value={String(completedOrders.length)} subtitle="Completed orders" icon={CheckCircle} gradientClass="stat-card-gradient-2" />
      </div>

      {/* Pipeline funnel */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">Order Pipeline</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {pipelineStages.map((stage) => {
            const total = mockOrders.length;
            const pct = total ? Math.round((stage.count / total) * 100) : 0;
            return (
              <div key={stage.label} className="bg-[#0a0f1e] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <stage.icon className={`w-4 h-4 ${stage.textColor}`} />
                  <span className={`text-xs font-semibold ${stage.textColor}`}>{stage.label}</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stage.count}</p>
                <div className="w-full bg-[#1f2937] rounded-full h-1.5 mb-1">
                  <div className={`${stage.color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-gray-500 text-xs">{pct}% of total</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Open deals */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <h3 className="text-white font-semibold">Open Deals</h3>
            <Link href="/sales/pedidos" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              All orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {[...pendingOrders, ...processingOrders].slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors">
                <div>
                  <p className="text-white text-sm font-medium">{order.client_name}</p>
                  <p className="text-gray-500 text-xs">{order.description}</p>
                  {order.due_date && <p className="text-gray-600 text-xs">Due {formatDate(order.due_date)}</p>}
                </div>
                <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
              </div>
            ))}
            {pendingOrders.length === 0 && processingOrders.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No open deals</p>
            )}
          </div>
        </div>

        {/* Newest clients */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <h3 className="text-white font-semibold">Newest Clients</h3>
            </div>
            <Link href="/sales/clientes" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              All clients <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {recentClients.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-center gap-3 p-4 hover:bg-[#0f172a] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{client.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{client.name}</p>
                  <p className="text-gray-500 text-xs">{client.company ?? client.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-xs font-semibold">{client.total_orders} orders</p>
                  <p className="text-gray-500 text-xs">{formatDate(client.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Support ──────────────────────────────────────────────────────────────────
function SupportDashboard() {
  const expiringDomains = mockDomains.filter((d) => {
    const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / 86400000);
    return days <= 30;
  });
  const expiredDomains = mockDomains.filter((d) => d.status === "vencido");
  const activeDomains = mockDomains.filter((d) => d.status === "ativo");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Support Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">Client health & domain monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Active Clients" value={String(mockStats.total_clients)} subtitle="Under your care" icon={Users} gradientClass="stat-card-gradient-1" />
        <StatsCard title="Active Domains" value={String(activeDomains.length)} subtitle="Healthy & running" icon={Globe} gradientClass="stat-card-gradient-2" />
        <StatsCard title="Expiring Soon" value={String(expiringDomains.length)} subtitle="Next 30 days" icon={Clock} gradientClass="stat-card-gradient-6" />
        <StatsCard title="Expired / Suspended" value={String(expiredDomains.length)} subtitle="Needs attention" icon={XCircle} gradientClass="stat-card-gradient-3" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Domains needing attention */}
        <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <h3 className="text-white font-semibold">Domains Needing Attention</h3>
                <p className="text-gray-500 text-xs mt-0.5">Expiring or already expired</p>
              </div>
            </div>
            <Link href="/sales/dominios" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              All domains <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {[...expiredDomains, ...expiringDomains].length === 0 && (
              <div className="flex items-center justify-center gap-2 p-8">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-gray-400 text-sm">All domains are healthy</p>
              </div>
            )}
            {[...expiredDomains, ...expiringDomains].map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${domain.status === "vencido" ? "bg-red-500/20" : "bg-amber-500/20"}`}>
                    <Globe className={`w-4 h-4 ${domain.status === "vencido" ? "text-red-400" : "text-amber-400"}`} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{domain.domain}</p>
                    <p className="text-gray-500 text-xs">{domain.client_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(domain.status)}>{getStatusLabel(domain.status)}</Badge>
                  <p className="text-gray-500 text-xs mt-1">{formatDateRelative(domain.expiry_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client list */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <h3 className="text-white font-semibold">Your Clients</h3>
            <Link href="/sales/clientes" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">View all</Link>
          </div>
          <div className="divide-y divide-[#1f2937]">
            {mockClients.map((client) => {
              const clientDomains = mockDomains.filter((d) => d.client_id === client.id);
              const hasIssue = clientDomains.some((d) => {
                const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / 86400000);
                return days <= 30 || d.status === "vencido";
              });
              return (
                <div key={client.id} className="flex items-center gap-3 p-4 hover:bg-[#0f172a] transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasIssue ? "bg-amber-400" : "bg-emerald-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{client.name}</p>
                    <p className="text-gray-500 text-xs">{clientDomains.length} domain(s)</p>
                  </div>
                  {hasIssue && <span className="text-amber-400 text-xs font-medium">Action needed</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Domain health grid */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">Domain Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockDomains.map((domain) => {
            const days = Math.ceil((new Date(domain.expiry_date).getTime() - Date.now()) / 86400000);
            const urgent = days <= 30 || domain.status === "vencido";
            return (
              <div key={domain.id} className={`p-3 rounded-xl border ${urgent ? "border-amber-500/30 bg-amber-500/5" : "border-[#1f2937] bg-[#0a0f1e]"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className={`w-3.5 h-3.5 ${urgent ? "text-amber-400" : "text-emerald-400"}`} />
                  <p className="text-white text-xs font-medium truncate">{domain.domain}</p>
                </div>
                <p className="text-gray-500 text-xs truncate mb-2">{domain.client_name}</p>
                <Badge className={getStatusColor(domain.status)}>{getStatusLabel(domain.status)}</Badge>
                <p className={`text-xs mt-1 ${urgent ? "text-amber-400" : "text-gray-500"}`}>{formatDateRelative(domain.expiry_date)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === "financeiro") return <FinanceDashboard />;
  if (role === "vendedor") return <SalesDashboard />;
  if (role === "suporte") return <SupportDashboard />;
  return <AdminDashboard />;
}
