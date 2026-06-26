import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: string;
}

export default function KPICard({ title, value, subtitle, icon: Icon, accentColor }: KPICardProps) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#6B7280]">{title}</p>
          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: accentColor ?? "#111827" }}
          >
            {value}
          </p>
          {subtitle && <p className="mt-0.5 text-xs text-[#9CA3AF]">{subtitle}</p>}
        </div>
        <div
          className="rounded-lg p-2"
          style={{ backgroundColor: accentColor ? `${accentColor}15` : "#F9FAFB" }}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor ?? "#6B7280" }} />
        </div>
      </div>
    </div>
  );
}
