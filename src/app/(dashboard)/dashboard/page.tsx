"use client";

import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { mockStats, mockOrders, mockClients, mockDomains } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  AlertCircle,
  ArrowRight,
  Globe,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;

  const recentOrders = mockOrders.slice(0, 5);
  const pendingOrders = mockOrders.filter((o) => o.status === "pendente");
  const expiringDomains = mockDomains.filter((d) => {
    const days = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / 86400000);
    return days <= 30 && days > 0;
  });

  // Admin & Finance: see revenue + full stats
  const showRevenue = role === "admin" || role === "financeiro";
  // Admin & Finance & Sales: see orders
  const showOrders = role === "admin" || role === "financeiro" || role === "vendedor";
  // Admin only: see pending payments
  const showPayments = role === "admin" || role === "financeiro";
  // Support & Admin: see domain expiry alerts
  const showDomainAlerts = role === "admin" || role === "suporte";

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {showRevenue && (
          <>
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(mockStats.total_revenue)}
              subtitle="All time"
              trend={mockStats.monthly_growth}
              icon={DollarSign}
              gradientClass="stat-card-gradient-1"
            />
            <StatsCard
              title="Monthly Revenue"
              value={formatCurrency(mockStats.monthly_revenue)}
              subtitle="May 2025"
              trend={18.5}
              icon={TrendingUp}
              gradientClass="stat-card-gradient-2"
            />
          </>
        )}

        {showOrders && (
          <StatsCard
            title="Total Orders"
            value={String(mockStats.total_orders)}
            subtitle={`${pendingOrders.length} pending`}
            icon={ShoppingCart}
            gradientClass="stat-card-gradient-3"
          />
        )}

        <StatsCard
          title="Clients"
          value={String(mockStats.total_clients)}
          subtitle="Active clients"
          icon={Users}
          gradientClass="stat-card-gradient-1"
        />

        <StatsCard
          title="Domains"
          value={String(mockStats.pending_domains)}
          subtitle={`${expiringDomains.length} expiring soon`}
          icon={Globe}
          gradientClass="stat-card-gradient-5"
        />

        {showPayments && (
          <StatsCard
            title="Pending Payments"
            value={String(mockStats.pending_payments)}
            subtitle="Awaiting confirmation"
            icon={AlertCircle}
            gradientClass="stat-card-gradient-6"
          />
        )}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders — shown to admin, finance, sales */}
        {showOrders && (
          <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
              <div>
                <h2 className="text-white font-semibold">Recent Orders</h2>
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
                  <div className="flex items-center gap-3 ml-2">
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    {showRevenue && (
                      <p className="text-white text-sm font-semibold whitespace-nowrap">{formatCurrency(order.value)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support: clients list instead of orders */}
        {role === "suporte" && (
          <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
              <div>
                <h2 className="text-white font-semibold">Clients</h2>
                <p className="text-gray-500 text-xs mt-0.5">Your assigned clients</p>
              </div>
              <Link href="/sales/clientes" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-[#1f2937]">
              {mockClients.slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center gap-3 p-4 hover:bg-[#0f172a] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{client.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{client.name}</p>
                    <p className="text-gray-500 text-xs">{client.email}</p>
                  </div>
                  <span className="text-gray-400 text-xs">{client.total_orders} orders</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right column */}
        <div className="space-y-4">

          {/* Quick Actions */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {role === "admin" && (
                <>
                  <QuickLink label="New Order" href="/sales/pedidos" color="text-blue-400" />
                  <QuickLink label="New Client" href="/sales/clientes" color="text-emerald-400" />
                  <QuickLink label="Generate Site with AI" href="/ia/gerar-site" color="text-cyan-400" />
                  <QuickLink label="Manage Users" href="/sales/usuarios" color="text-purple-400" />
                </>
              )}
              {role === "financeiro" && (
                <>
                  <QuickLink label="New Order" href="/sales/pedidos" color="text-blue-400" />
                  <QuickLink label="New Client" href="/sales/clientes" color="text-emerald-400" />
                  <QuickLink label="Manage Domains" href="/sales/dominios" color="text-amber-400" />
                </>
              )}
              {role === "vendedor" && (
                <>
                  <QuickLink label="New Order" href="/sales/pedidos" color="text-blue-400" />
                  <QuickLink label="New Client" href="/sales/clientes" color="text-emerald-400" />
                  <QuickLink label="View Domains" href="/sales/dominios" color="text-amber-400" />
                </>
              )}
              {role === "suporte" && (
                <>
                  <QuickLink label="View Clients" href="/sales/clientes" color="text-blue-400" />
                  <QuickLink label="Check Domains" href="/sales/dominios" color="text-amber-400" />
                </>
              )}
            </div>
          </div>

          {/* Top Clients — admin, finance, sales */}
          {(role === "admin" || role === "financeiro" || role === "vendedor") && (
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Top Clients</h2>
                <Link href="/sales/clientes" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {mockClients.slice(0, 4).map((client) => (
                  <div key={client.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{client.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{client.name}</p>
                      <p className="text-gray-500 text-xs">{client.total_orders} orders</p>
                    </div>
                    {showRevenue && (
                      <p className="text-gray-300 text-xs font-medium whitespace-nowrap">
                        {formatCurrency(client.total_spent)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Domain alerts — support */}
          {role === "suporte" && expiringDomains.length > 0 && (
            <div className="bg-[#111827] border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <h2 className="text-white font-semibold">Expiring Domains</h2>
              </div>
              <div className="space-y-3">
                {expiringDomains.map((d) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{d.domain}</p>
                      <p className="text-gray-500 text-xs">{d.client_name}</p>
                    </div>
                    <Badge className={getStatusColor(d.status)}>{formatDate(d.expiry_date)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Domain expiry table — admin */}
      {showDomainAlerts && role === "admin" && expiringDomains.length > 0 && (
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-white font-semibold">Expiry Alerts</h2>
            </div>
            <Link href="/sales/dominios" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#1f2937]">
            {expiringDomains.map((domain) => (
              <div key={domain.id} className="p-4">
                <p className="text-white text-sm font-medium truncate mb-1">{domain.client_name}</p>
                <p className="text-blue-400 text-xs mb-1">{domain.domain}</p>
                <p className="text-gray-500 text-xs">Expires: {formatDate(domain.expiry_date)}</p>
                <div className="mt-2">
                  <Badge className={getStatusColor(domain.status)}>{getStatusLabel(domain.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLink({ label, href, color }: { label: string; href: string; color: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0f172a] transition-colors group">
      <span className={`text-sm font-medium ${color}`}>{label}</span>
      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
    </Link>
  );
}
