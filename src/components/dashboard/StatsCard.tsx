import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  gradientClass: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  gradientClass,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 text-white relative overflow-hidden",
        gradientClass
      )}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20" />
        <div className="absolute -right-2 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                trend >= 0
                  ? "bg-emerald-500/30 text-emerald-200"
                  : "bg-red-500/30 text-red-200"
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && (
          <p className="text-white/60 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
