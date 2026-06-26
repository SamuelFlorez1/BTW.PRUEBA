"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FiltrosClientes as Filtros } from "@/hooks/useClientes";

const EDADES = [
  { val: 1, label: "1-30d", color: "#16A34A" },
  { val: 2, label: "31-60d", color: "#D97706" },
  { val: 3, label: "61-90d", color: "#EA580C" },
  { val: 4, label: "91-180d", color: "#DC2626" },
  { val: 5, label: ">180d", color: "#991B1B" },
];

const ESTADOS = [
  { val: "al_dia", label: "Al día" },
  { val: "en_seguimiento", label: "Seguimiento" },
  { val: "promesa_pago", label: "Promesa" },
  { val: "en_cola_legal", label: "Cola legal" },
  { val: "pausado", label: "Pausado" },
];

interface Props {
  filtros: Filtros;
  onChange: (f: Filtros) => void;
  onReset: () => void;
  hasFilters: boolean;
  totalFiltered: number;
  totalAll: number;
  montoFiltrado: string;
}

export default function FiltrosClientes({
  filtros,
  onChange,
  onReset,
  hasFilters,
  totalFiltered,
  montoFiltrado,
}: Props) {
  const toggleEdad = (e: number) => {
    const next = filtros.edades.includes(e)
      ? filtros.edades.filter((x) => x !== e)
      : [...filtros.edades, e];
    onChange({ ...filtros, edades: next });
  };

  const toggleEstado = (e: string) => {
    const next = filtros.estados.includes(e)
      ? filtros.estados.filter((x) => x !== e)
      : [...filtros.estados, e];
    onChange({ ...filtros, estados: next });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <Input
            placeholder="Nombre o NIT..."
            value={filtros.busqueda}
            onChange={(e) => onChange({ ...filtros, busqueda: e.target.value })}
            className="h-9 border-[#E5E7EB] bg-white pl-9 text-sm"
          />
        </div>

        {/* Edad chips */}
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-[#9CA3AF]">Edad:</span>
          {EDADES.map((ed) => (
            <button
              key={ed.val}
              onClick={() => toggleEdad(ed.val)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                filtros.edades.includes(ed.val)
                  ? "text-white"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#D1D5DB]"
              )}
              style={
                filtros.edades.includes(ed.val)
                  ? { backgroundColor: ed.color }
                  : undefined
              }
            >
              {ed.label}
            </button>
          ))}
        </div>

        {/* Estado chips */}
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-[#9CA3AF]">Estado:</span>
          {ESTADOS.map((est) => (
            <button
              key={est.val}
              onClick={() => toggleEstado(est.val)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors border",
                filtros.estados.includes(est.val)
                  ? "bg-[#F26522] text-white border-[#F26522]"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB]"
              )}
            >
              {est.label}
            </button>
          ))}
        </div>

        {/* Top150 toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white p-0.5">
          {(["todos", "solo", "sin"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onChange({ ...filtros, top150: v })}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                filtros.top150 === v
                  ? "bg-[#F26522] text-white"
                  : "text-[#6B7280] hover:bg-[#F9FAFB]"
              )}
            >
              {v === "todos" ? "Todos" : v === "solo" ? "Top150" : "Sin T150"}
            </button>
          ))}
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs text-[#6B7280]">
            <X className="mr-1 h-3 w-3" /> Limpiar
          </Button>
        )}
      </div>

      <p className="text-xs text-[#9CA3AF]">
        Mostrando {totalFiltered} clientes · Monto filtrado: {montoFiltrado}
      </p>
    </div>
  );
}
