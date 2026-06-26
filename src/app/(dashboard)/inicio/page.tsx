"use client";

import { useEffect, useState } from "react";
import { DollarSign, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell } from "recharts";
import { supabase } from "@/lib/supabase";
import KPICard from "@/components/shared/KPICard";
import BadgeEdad from "@/components/shared/BadgeEdad";
import BadgeTop150 from "@/components/shared/BadgeTop150";
import { formatCOP } from "@/lib/utils";
import type { ResumenGlobal, CarteraPorEdad, ClienteResumen } from "@/lib/types";

const EDAD_COLORS: Record<number, string> = {
  0: "#6B7280",
  1: "#16A34A",
  2: "#D97706",
  3: "#EA580C",
  4: "#DC2626",
  5: "#991B1B",
};

const EDAD_NAMES: Record<number, string> = {
  0: "Sin vencer",
  1: "1-30 días",
  2: "31-60 días",
  3: "61-90 días",
  4: "91-180 días",
  5: ">180 días",
};

export default function InicioPage() {
  const [resumen, setResumen] = useState<ResumenGlobal | null>(null);
  const [edades, setEdades] = useState<CarteraPorEdad[]>([]);
  const [topDeudores, setTopDeudores] = useState<ClienteResumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [rRes, eRes, tRes] = await Promise.all([
        supabase.from("vista_resumen_global").select("*").single(),
        supabase.from("vista_cartera_por_edad").select("*").order("edad"),
        supabase
          .from("vista_clientes_resumen")
          .select("nit, nombre, top150, estado, monto_total, peor_edad, dias_mas_vieja, facturas_vencidas")
          .order("monto_total", { ascending: false })
          .limit(10),
      ]);

      if (rRes.data) setResumen(rRes.data as ResumenGlobal);
      if (eRes.data) setEdades(eRes.data as CarteraPorEdad[]);
      if (tRes.data) setTopDeudores(tRes.data as ClienteResumen[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-[#E5E7EB]/50" />
        ))}
      </div>
    );
  }

  const chartData = edades
    .filter((e) => e.edad > 0)
    .map((e) => ({
      name: EDAD_NAMES[e.edad] ?? `Edad ${e.edad}`,
      monto: Number(e.monto_total),
      facturas: e.n_facturas,
      edad: e.edad,
    }));

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          title="Cartera total"
          value={formatCOP(resumen?.cartera_total)}
          icon={DollarSign}
        />
        <KPICard
          title="Cartera vencida"
          value={formatCOP(resumen?.cartera_vencida)}
          icon={TrendingDown}
          accentColor="#DC2626"
          subtitle={
            resumen && resumen.cartera_total > 0
              ? `${Math.round((Number(resumen.cartera_vencida) / Number(resumen.cartera_total)) * 100)}% del total`
              : undefined
          }
        />
        <KPICard
          title="Clientes mora crítica"
          value={String(resumen?.clientes_criticos ?? 0)}
          icon={AlertTriangle}
          accentColor="#EA580C"
          subtitle="más de 90 días"
        />
        <KPICard
          title="Recuperado este mes"
          value={formatCOP(resumen?.recuperado_mes)}
          icon={CheckCircle}
          accentColor="#16A34A"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Gráfico edades */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Cartera por edad de mora</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tickFormatter={(v) => formatCOP(v)} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <ReTooltip
                formatter={(value) => formatCOP(Number(value))}
                labelStyle={{ color: "#111827", fontWeight: 600 }}
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
              />
              <Bar dataKey="monto" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.edad} fill={EDAD_COLORS[entry.edad] ?? "#6B7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 deudores */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <h3 className="mb-4 text-sm font-semibold text-[#111827]">Top 10 deudores</h3>
          <div className="space-y-2">
            {topDeudores.map((c, i) => (
              <a
                key={c.nit}
                href="/clientes"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#FFF7ED]"
              >
                <span className="w-5 text-xs font-semibold text-[#9CA3AF]">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[#111827]">{c.nombre}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{c.nit}</p>
                </div>
                <BadgeTop150 top150={c.top150} />
                <BadgeEdad edad={c.peor_edad} />
                <span className="text-sm font-semibold text-[#111827]">{formatCOP(c.monto_total)}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
