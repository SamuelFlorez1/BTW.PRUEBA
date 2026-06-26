import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from "lucide-react";

const CONFIG: Record<string, { color: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  responde_negocia: { color: "#16A34A", label: "Negocia", Icon: ShieldCheck },
  ignora: { color: "#D97706", label: "Ignora", Icon: ShieldAlert },
  hostil: { color: "#DC2626", label: "Hostil", Icon: ShieldX },
  sin_contacto: { color: "#9CA3AF", label: "Sin contacto", Icon: ShieldQuestion },
};

export default function BadgeRiesgo({ riesgo }: { riesgo: string | null | undefined }) {
  if (!riesgo) return <span className="text-xs text-[#9CA3AF]">—</span>;
  const c = CONFIG[riesgo] ?? CONFIG.sin_contacto;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: c.color }}>
      <c.Icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}
