"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, MessageSquare, Phone, Mail, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BadgeEdad from "@/components/shared/BadgeEdad";
import BadgeEstado from "@/components/shared/BadgeEstado";
import BadgeRiesgo from "@/components/shared/BadgeRiesgo";
import BadgeTop150 from "@/components/shared/BadgeTop150";
import { supabase } from "@/lib/supabase";
import { formatCOP, formatRelativeDate, formatContacto } from "@/lib/utils";
import type { ClienteResumen, Factura, Mensaje } from "@/lib/types";

interface Props {
  nit: string | null;
  allNits: string[];
  onClose: () => void;
  onNavigate: (nit: string) => void;
}

export default function DrawerCliente({ nit, allNits, onClose, onNavigate }: Props) {
  const [cliente, setCliente] = useState<ClienteResumen | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [showAllMensajes, setShowAllMensajes] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const fetchDetail = useCallback(async (n: string) => {
    const [cRes, fRes, mRes] = await Promise.all([
      supabase
        .from("vista_clientes_resumen")
        .select("nit, nombre, top150, estado, correo, contacto, ultimo_contacto, proximo_paso, fecha_promesa, resumen_titulo, riesgo, monto_total, peor_edad, facturas_vencidas, facturas_vigentes, dias_mas_vieja")
        .eq("nit", n)
        .single(),
      supabase
        .from("facturas")
        .select("num_factura, nit, num_legal, fecha_factura, fecha_vencimiento, dias, monto, edad, estado, fecha_pago, ultimo_informe")
        .eq("nit", n)
        .order("dias", { ascending: false }),
      supabase
        .from("mensajes")
        .select("id, nit, direccion, canal, plantilla, contenido, facturas_ref, estado, enviado_at, created_at")
        .eq("nit", n)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    if (cRes.data) setCliente(cRes.data as ClienteResumen);
    if (fRes.data) setFacturas(fRes.data as Factura[]);
    if (mRes.data) setMensajes(mRes.data as Mensaje[]);
    setShowAllMensajes(false);
  }, []);

  useEffect(() => {
    if (nit) {
      fetchDetail(nit);
      setFullscreen(false);
    }
  }, [nit, fetchDetail]);

  const currentIdx = nit ? allNits.indexOf(nit) : -1;
  const prevNit = currentIdx > 0 ? allNits[currentIdx - 1] : null;
  const nextNit = currentIdx < allNits.length - 1 ? allNits[currentIdx + 1] : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreen) setFullscreen(false);
        else onClose();
      }
      if (e.key === "ArrowUp" && prevNit) onNavigate(prevNit);
      if (e.key === "ArrowDown" && nextNit) onNavigate(nextNit);
    };
    if (nit) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nit, prevNit, nextNit, onClose, onNavigate, fullscreen]);

  const visibleMensajes = showAllMensajes ? mensajes : mensajes.slice(0, 10);

  if (!nit) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 animate-fade-in" onClick={onClose} />
      <div
        className={`fixed right-0 top-0 z-50 h-full overflow-y-auto border-l border-[#E5E7EB] bg-white shadow-xl animate-slide-in-right transition-all duration-300 ${
          fullscreen ? "w-full max-w-none" : "w-full max-w-[540px]"
        }`}
      >
        {cliente && (
          <>
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!prevNit} onClick={() => prevNit && onNavigate(prevNit)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!nextNit} onClick={() => nextNit && onNavigate(nextNit)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFullscreen(!fullscreen)}>
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-[#111827]">{cliente.nombre}</h2>
              <p className="text-xs text-[#9CA3AF]">{cliente.nit}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <BadgeTop150 top150={cliente.top150} />
                <BadgeEdad edad={cliente.peor_edad} />
                <BadgeEstado estado={cliente.estado} />
                <BadgeRiesgo riesgo={cliente.riesgo} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-[#6B7280]">
                {cliente.contacto && (
                  <a href={`https://wa.me/${cliente.contacto}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#16A34A]">
                    <Phone className="h-3 w-3" /> {formatContacto(cliente.contacto)}
                  </a>
                )}
                {cliente.correo && (
                  <a href={`mailto:${cliente.correo}`} className="flex items-center gap-1 hover:text-[#2563EB]">
                    <Mail className="h-3 w-3" /> {cliente.correo}
                  </a>
                )}
              </div>
            </div>

            <div className={`space-y-5 p-5 ${fullscreen ? "mx-auto max-w-4xl" : ""}`}>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 animate-fade-in-up">
                {[
                  { label: "Monto total", value: formatCOP(cliente.monto_total) },
                  { label: "F. vigentes", value: String(cliente.facturas_vigentes) },
                  { label: "Peor edad", value: String(cliente.peor_edad) },
                  { label: "Días más vieja", value: cliente.dias_mas_vieja > 0 ? `${cliente.dias_mas_vieja}d` : "—" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-[#F9FAFB] p-3">
                    <p className="text-[10px] text-[#9CA3AF]">{s.label}</p>
                    <p className="text-sm font-semibold text-[#111827]">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Resumen IA */}
              {cliente.resumen_titulo && (
                <div className="rounded-lg bg-[#F9FAFB] p-4 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
                  <p className="text-sm font-semibold text-[#111827]">{cliente.resumen_titulo}</p>
                </div>
              )}

              <Separator />

              {/* Facturas */}
              <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <h3 className="mb-2 text-sm font-semibold text-[#111827]">Facturas</h3>
                <div className="rounded-lg border border-[#E5E7EB]">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[11px]">AM</TableHead>
                        <TableHead className="text-[11px]">Vencimiento</TableHead>
                        <TableHead className="text-right text-[11px]">Días</TableHead>
                        <TableHead className="text-[11px]">Edad</TableHead>
                        <TableHead className="text-right text-[11px]">Monto</TableHead>
                        <TableHead className="text-[11px]">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facturas.map((f) => (
                        <TableRow key={f.num_factura} className={f.estado === "pagada" ? "opacity-50" : ""}>
                          <TableCell className="text-xs">{f.num_legal}</TableCell>
                          <TableCell className="text-xs">{f.fecha_vencimiento ? new Date(f.fecha_vencimiento).toLocaleDateString("es-CO") : "—"}</TableCell>
                          <TableCell className={`text-right text-xs font-medium ${f.dias > 90 ? "text-[#DC2626]" : ""}`}>{f.dias}</TableCell>
                          <TableCell><BadgeEdad edad={f.edad} /></TableCell>
                          <TableCell className="text-right text-xs font-medium">{formatCOP(f.monto)}</TableCell>
                          <TableCell>
                            <span className={`text-xs ${f.estado === "pagada" ? "text-[#16A34A]" : "text-[#6B7280]"}`}>
                              {f.estado === "pagada" ? "Pagada" : "Vigente"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Mensajes */}
              <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#111827]">Mensajes</h3>
                  <span className="text-xs text-[#9CA3AF]">{mensajes.length} total</span>
                </div>
                <div className="space-y-2">
                  {visibleMensajes.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-lg p-3 text-xs leading-relaxed ${
                        m.direccion === "entrante"
                          ? "ml-auto max-w-[85%] bg-[#F9FAFB] text-[#111827]"
                          : "mr-auto max-w-[85%] bg-[#FFF7ED] text-[#111827]"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2 text-[10px] text-[#9CA3AF]">
                        <MessageSquare className="h-3 w-3" />
                        {m.canal} · {m.direccion} · {formatRelativeDate(m.created_at)}
                        {m.plantilla && <span className="text-[#D97706]">({m.plantilla})</span>}
                      </div>
                      <p className="whitespace-pre-wrap">{m.contenido}</p>
                    </div>
                  ))}
                  {mensajes.length > 10 && !showAllMensajes && (
                    <button
                      onClick={() => setShowAllMensajes(true)}
                      className="w-full py-2 text-center text-xs text-[#F26522] hover:underline"
                    >
                      Ver {mensajes.length - 10} mensajes más
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
