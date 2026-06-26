"use client";

import { useState, useEffect, useCallback } from "react";
import { Handshake, CalendarCheck, AlertTriangle } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import KPICard from "@/components/shared/KPICard";
import BadgeEdad from "@/components/shared/BadgeEdad";
import BadgeTop150 from "@/components/shared/BadgeTop150";
import DrawerCliente from "@/components/clientes/DrawerCliente";
import { formatCOP, formatRelativeDate } from "@/lib/utils";
import type { ClienteResumen } from "@/lib/types";

type Tab = "todos" | "vigentes" | "hoy" | "vencidos";

function acuerdoStatus(fecha: string | null): { label: string; color: string; dias: number } {
  if (!fecha) return { label: "—", color: "#9CA3AF", dias: 0 };
  const diff = Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
  if (diff > 0) return { label: "Vigente", color: "#16A34A", dias: diff };
  if (diff === 0) return { label: "Hoy", color: "#F26522", dias: 0 };
  return { label: "Vencido", color: "#DC2626", dias: diff };
}

export default function AcuerdosPage() {
  const [data, setData] = useState<ClienteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("todos");
  const [selectedNit, setSelectedNit] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("vista_clientes_resumen")
      .select("nit, nombre, top150, estado, correo, contacto, ultimo_contacto, proximo_paso, fecha_promesa, resumen_titulo, riesgo, monto_total, peor_edad, facturas_vencidas, facturas_vigentes, dias_mas_vieja")
      .not("fecha_promesa", "is", null)
      .order("fecha_promesa", { ascending: true });

    if (rows) setData(rows as ClienteResumen[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = data.filter((c) => {
    const s = acuerdoStatus(c.fecha_promesa);
    if (tab === "vigentes") return s.dias > 0;
    if (tab === "hoy") return s.dias === 0;
    if (tab === "vencidos") return s.dias < 0;
    return true;
  });

  const totalActivos = data.length;
  const vencenHoy = data.filter((c) => acuerdoStatus(c.fecha_promesa).dias === 0).length;
  const vencidos = data.filter((c) => acuerdoStatus(c.fecha_promesa).dias < 0).length;

  const TABS: { key: Tab; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "vigentes", label: "Vigentes" },
    { key: "hoy", label: "Hoy" },
    { key: "vencidos", label: "Vencidos" },
  ];

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Acuerdos activos" value={String(totalActivos)} icon={Handshake} />
        <KPICard title="Vencen hoy" value={String(vencenHoy)} icon={CalendarCheck} accentColor="#F26522" />
        <KPICard title="Vencidos sin pago" value={String(vencidos)} icon={AlertTriangle} accentColor="#DC2626" />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.key
                ? "bg-[#F26522] text-white"
                : "text-[#6B7280] hover:bg-[#F9FAFB]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[#E5E7EB]/50" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-[#6B7280]">Cliente</TableHead>
                <TableHead className="text-right text-xs font-medium text-[#6B7280]">Monto</TableHead>
                <TableHead className="text-xs font-medium text-[#6B7280]">Fecha acuerdo</TableHead>
                <TableHead className="text-xs font-medium text-[#6B7280]">Estado acuerdo</TableHead>
                <TableHead className="text-center text-xs font-medium text-[#6B7280]">Días</TableHead>
                <TableHead className="text-xs font-medium text-[#6B7280]">Último contacto</TableHead>
                <TableHead className="text-xs font-medium text-[#6B7280]">Edad</TableHead>
                <TableHead className="text-xs font-medium text-[#6B7280]">Resumen IA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const s = acuerdoStatus(c.fecha_promesa);
                return (
                  <TableRow
                    key={c.nit}
                    className="cursor-pointer transition-colors hover:bg-[#FFF7ED]"
                    onClick={() => setSelectedNit(c.nit)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium text-[#111827]">{c.nombre}</p>
                          <p className="text-xs text-[#9CA3AF]">{c.nit}</p>
                        </div>
                        <BadgeTop150 top150={c.top150} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-[#111827]">
                      {formatCOP(c.monto_total)}
                    </TableCell>
                    <TableCell className="text-sm text-[#111827]">
                      {c.fecha_promesa ? new Date(c.fecha_promesa).toLocaleDateString("es-CO") : "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: `${s.color}15`, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-medium" style={{ color: s.color }}>
                        {s.dias > 0 ? `+${s.dias}d` : s.dias === 0 ? "Hoy" : `${s.dias}d`}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-[#6B7280]">
                      {formatRelativeDate(c.ultimo_contacto)}
                    </TableCell>
                    <TableCell>
                      <BadgeEdad edad={c.peor_edad} />
                    </TableCell>
                    <TableCell className="max-w-[150px] overflow-hidden">
                      <p className="truncate text-xs text-[#6B7280]">{c.resumen_titulo ?? "—"}</p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-[#6B7280]">No hay acuerdos en esta categoría</p>
            </div>
          )}
        </div>
      )}

      <DrawerCliente
        nit={selectedNit}
        allNits={filtered.map((c) => c.nit)}
        onClose={() => setSelectedNit(null)}
        onNavigate={setSelectedNit}
      />
    </div>
  );
}
