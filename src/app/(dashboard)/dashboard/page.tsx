"use client";

import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { mockStats, mockOrders, mockClients, mockHostings } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Server,
  AlertCircle,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const recentOrders = mockOrders.slice(0, 5);
  const pendingOrders = mockOrders.filter((o) => o.status === "pendente");
  const activeHostings = mockHostings.filter((h) => h.status === "ativo");

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard
          title="Receita Total"
          value={formatCurrency(mockStats.total_revenue)}
          subtitle="Acumulado geral"
          trend={mockStats.monthly_growth}
          icon={DollarSign}
          gradientClass="stat-card-gradient-1"
        />
        <StatsCard
          title="Receita Mensal"
          value={formatCurrency(mockStats.monthly_revenue)}
          subtitle="Maio 2025"
          trend={18.5}
          icon={TrendingUp}
          gradientClass="stat-card-gradient-2"
        />
        <StatsCard
          title="Total de Pedidos"
          value={String(mockStats.total_orders)}
          subtitle={`${pendingOrders.length} pendentes`}
          icon={ShoppingCart}
          gradientClass="stat-card-gradient-3"
        />
        <StatsCard
          title="Clientes"
          value={String(mockStats.total_clients)}
          subtitle="Clientes ativos"
          icon={Users}
          gradientClass="stat-card-gradient-1"
        />
        <StatsCard
          title="Hospedagens Ativas"
          value={String(activeHostings.length)}
          subtitle={`${mockStats.pending_domains} domínios a vencer`}
          icon={Server}
          gradientClass="stat-card-gradient-5"
        />
        <StatsCard
          title="Pagamentos Pendentes"
          value={String(mockStats.pending_payments)}
          subtitle="Aguardando confirmação"
          icon={AlertCircle}
          gradientClass="stat-card-gradient-6"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
            <div>
              <h2 className="text-white font-semibold">Pedidos Recentes</h2>
              <p className="text-gray-500 text-xs mt-0.5">Últimas transações</p>
            </div>
            <Link
              href="/sales/pedidos"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#1f2937]">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 hover:bg-[#0f172a] transition-colors"
              >
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
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                  <p className="text-white text-sm font-semibold whitespace-nowrap">
                    {formatCurrency(order.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Clients */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-2">
              {[
                { label: "Novo Pedido", href: "/sales/pedidos", color: "text-blue-400" },
                { label: "Novo Cliente", href: "/sales/clientes", color: "text-emerald-400" },
                { label: "Nova Hospedagem", href: "/hospedagem", color: "text-purple-400" },
                { label: "Gerar Site com IA", href: "/ia/gerar-site", color: "text-cyan-400" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0f172a] transition-colors group"
                >
                  <span className={`text-sm font-medium ${action.color}`}>
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Top clients */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Top Clientes</h2>
              <Link
                href="/sales/clientes"
                className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {mockClients.slice(0, 4).map((client) => (
                <div key={client.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{client.name}</p>
                    <p className="text-gray-500 text-xs">{client.total_orders} pedidos</p>
                  </div>
                  <p className="text-gray-300 text-xs font-medium whitespace-nowrap">
                    {formatCurrency(client.total_spent)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hosting expiry alerts */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-semibold">Alertas de Vencimento</h2>
          </div>
          <Link
            href="/hospedagem"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Gerenciar <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#1f2937]">
          {mockHostings.map((hosting) => (
            <div key={hosting.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-gray-500" />
                <p className="text-white text-sm font-medium truncate">{hosting.client_name}</p>
              </div>
              <p className="text-gray-400 text-xs mb-1">{hosting.plan}</p>
              <p className="text-gray-500 text-xs">Vence: {formatDate(hosting.expiry_date)}</p>
              <div className="mt-2">
                <Badge className={getStatusColor(hosting.status)}>
                  {getStatusLabel(hosting.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
