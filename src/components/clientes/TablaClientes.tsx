"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pause, Play, CalendarDays, AlertTriangle } from "lucide-react";
import BadgeEdad from "@/components/shared/BadgeEdad";
import BadgeEstado from "@/components/shared/BadgeEstado";
import BadgeRiesgo from "@/components/shared/BadgeRiesgo";
import BadgeTop150 from "@/components/shared/BadgeTop150";
import { formatCOP, formatRelativeDate } from "@/lib/utils";
import type { ClienteResumen } from "@/lib/types";

interface Props {
  data: ClienteResumen[];
  onSelect: (nit: string) => void;
  onPausar: (nit: string, estado: string) => void;
  onPromesa: (nit: string) => void;
  onEscalar: (nit: string) => void;
}

export default function TablaClientes({ data, onSelect, onPausar, onPromesa, onEscalar }: Props) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm overflow-x-auto">
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium text-[#6B7280]">Cliente</TableHead>
            <TableHead className="text-xs font-medium text-[#6B7280]">Edad</TableHead>
            <TableHead className="text-right text-xs font-medium text-[#6B7280]">Monto</TableHead>
            <TableHead className="text-center text-xs font-medium text-[#6B7280]">F. vencidas</TableHead>
            <TableHead className="text-center text-xs font-medium text-[#6B7280]">Mora</TableHead>
            <TableHead className="text-xs font-medium text-[#6B7280]">Último contacto</TableHead>
            <TableHead className="text-xs font-medium text-[#6B7280]">Estado</TableHead>
            <TableHead className="text-xs font-medium text-[#6B7280]">Resumen IA</TableHead>
            <TableHead className="text-xs font-medium text-[#6B7280]">Riesgo</TableHead>
            <TableHead className="text-center text-xs font-medium text-[#6B7280]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((c) => (
            <TableRow
              key={c.nit}
              className="cursor-pointer transition-colors hover:bg-[#FFF7ED]"
              onClick={() => onSelect(c.nit)}
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
              <TableCell>
                <BadgeEdad edad={c.peor_edad} />
              </TableCell>
              <TableCell className="text-right text-sm font-semibold text-[#111827]">
                {formatCOP(c.monto_total)}
              </TableCell>
              <TableCell className="text-center text-sm text-[#111827]">
                {c.facturas_vencidas}
              </TableCell>
              <TableCell className="text-center">
                <span className={`text-sm font-medium ${c.dias_mas_vieja > 90 ? "text-[#DC2626]" : "text-[#111827]"}`}>
                  {c.dias_mas_vieja > 0 ? `${c.dias_mas_vieja}d` : "—"}
                </span>
              </TableCell>
              <TableCell className="text-xs text-[#6B7280]">
                {formatRelativeDate(c.ultimo_contacto)}
              </TableCell>
              <TableCell>
                <BadgeEstado estado={c.estado} />
              </TableCell>
              <TableCell className="max-w-[140px] overflow-hidden">
                <p className="truncate text-xs text-[#6B7280]">{c.resumen_titulo ?? "—"}</p>
              </TableCell>
              <TableCell>
                <BadgeRiesgo riesgo={c.riesgo} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => onPausar(c.nit, c.estado)}
                      className="rounded-md p-1.5 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-[#111827]"
                    >
                      {c.estado === "pausado" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </TooltipTrigger>
                    <TooltipContent>{c.estado === "pausado" ? "Reanudar" : "Pausar"}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => onPromesa(c.nit)}
                      className="rounded-md p-1.5 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-[#D97706]"
                    >
                      <CalendarDays className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>Promesa de pago</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => onEscalar(c.nit)}
                      className="rounded-md p-1.5 text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-[#DC2626]"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>Escalar</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-[#6B7280]">No hay clientes que coincidan</p>
        </div>
      )}
    </div>
  );
}
