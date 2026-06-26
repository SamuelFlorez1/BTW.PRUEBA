"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, AlertTriangle, PhoneOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import KPICard from "@/components/shared/KPICard";
import TablaClientes from "@/components/clientes/TablaClientes";
import DrawerCliente from "@/components/clientes/DrawerCliente";
import PromesaModal from "@/components/shared/PromesaModal";
import { formatCOP } from "@/lib/utils";
import type { ClienteResumen } from "@/lib/types";

export default function Top150Page() {
  const [data, setData] = useState<ClienteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNit, setSelectedNit] = useState<string | null>(null);
  const [promesaNit, setPromesaNit] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("vista_clientes_resumen")
      .select("nit, nombre, top150, estado, correo, contacto, ultimo_contacto, proximo_paso, fecha_promesa, resumen_titulo, riesgo, monto_total, peor_edad, facturas_vencidas, facturas_vigentes, dias_mas_vieja")
      .eq("top150", true)
      .order("monto_total", { ascending: false });

    if (rows) setData(rows as ClienteResumen[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const carteraTotal = data.reduce((s, c) => s + (Number(c.monto_total) || 0), 0);
  const conMora = data.filter((c) => c.facturas_vencidas > 0).length;
  const sinContacto14 = data.filter((c) => {
    if (!c.ultimo_contacto) return true;
    const diff = Date.now() - new Date(c.ultimo_contacto).getTime();
    return diff > 14 * 86400000;
  }).length;

  const handlePausar = useCallback(async (nit: string, estado: string) => {
    const newEstado = estado === "pausado" ? "en_seguimiento" : "pausado";
    await supabase.from("clientes").update({ estado: newEstado }).eq("nit", nit);
    fetchData();
  }, [fetchData]);

  const handlePromesaConfirm = useCallback(async (nit: string, fecha: string) => {
    await supabase.from("clientes").update({ estado: "promesa_pago", fecha_promesa: fecha }).eq("nit", nit);
    setPromesaNit(null);
    fetchData();
  }, [fetchData]);

  const handleEscalar = useCallback(async (nit: string) => {
    await supabase.from("clientes").update({ estado: "en_cola_legal" }).eq("nit", nit);
    fetchData();
  }, [fetchData]);

  const promesaCliente = promesaNit ? data.find((c) => c.nit === promesaNit) : null;

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Cartera Top 150" value={formatCOP(carteraTotal)} icon={DollarSign} />
        <KPICard title="Top 150 con mora" value={String(conMora)} icon={AlertTriangle} accentColor="#DC2626" />
        <KPICard title="Sin contacto +14 días" value={String(sinContacto14)} icon={PhoneOff} accentColor="#EA580C" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[#E5E7EB]/50" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-[#9CA3AF]">Mostrando {data.length} clientes preferenciales</p>
          <TablaClientes
            data={data}
            onSelect={setSelectedNit}
            onPausar={handlePausar}
            onPromesa={setPromesaNit}
            onEscalar={handleEscalar}
          />
        </>
      )}

      <DrawerCliente
        nit={selectedNit}
        allNits={data.map((c) => c.nit)}
        onClose={() => setSelectedNit(null)}
        onNavigate={setSelectedNit}
      />

      {promesaCliente && (
        <PromesaModal
          nit={promesaCliente.nit}
          nombre={promesaCliente.nombre}
          onConfirm={handlePromesaConfirm}
          onClose={() => setPromesaNit(null)}
        />
      )}
    </div>
  );
}
