"use client";

import { useState, useCallback } from "react";
import { useClientes } from "@/hooks/useClientes";
import FiltrosClientes from "@/components/clientes/FiltrosClientes";
import TablaClientes from "@/components/clientes/TablaClientes";
import DrawerCliente from "@/components/clientes/DrawerCliente";
import PromesaModal from "@/components/shared/PromesaModal";
import { supabase } from "@/lib/supabase";
import { formatCOP } from "@/lib/utils";

export default function ClientesPage() {
  const { data, loading, filtros, setFiltros, resetFiltros, hasFilters, montoFiltrado, refetch } = useClientes();
  const [selectedNit, setSelectedNit] = useState<string | null>(null);
  const [promesaNit, setPromesaNit] = useState<string | null>(null);

  const handlePausar = useCallback(async (nit: string, estado: string) => {
    const newEstado = estado === "pausado" ? "en_seguimiento" : "pausado";
    await supabase.from("clientes").update({ estado: newEstado }).eq("nit", nit);
    refetch();
  }, [refetch]);

  const handlePromesaConfirm = useCallback(async (nit: string, fecha: string) => {
    await supabase.from("clientes").update({ estado: "promesa_pago", fecha_promesa: fecha }).eq("nit", nit);
    setPromesaNit(null);
    refetch();
  }, [refetch]);

  const handleEscalar = useCallback(async (nit: string) => {
    await supabase.from("clientes").update({ estado: "en_cola_legal" }).eq("nit", nit);
    refetch();
  }, [refetch]);

  const allNits = data.map((c) => c.nit);
  const promesaCliente = promesaNit ? data.find((c) => c.nit === promesaNit) : null;

  return (
    <div className="space-y-4 animate-fade-in-up">
      <FiltrosClientes
        filtros={filtros}
        onChange={setFiltros}
        onReset={resetFiltros}
        hasFilters={hasFilters}
        totalFiltered={data.length}
        totalAll={data.length}
        montoFiltrado={formatCOP(montoFiltrado)}
      />

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[#E5E7EB]/50" />
          ))}
        </div>
      ) : (
        <TablaClientes
          data={data}
          onSelect={setSelectedNit}
          onPausar={handlePausar}
          onPromesa={setPromesaNit}
          onEscalar={handleEscalar}
        />
      )}

      <DrawerCliente
        nit={selectedNit}
        allNits={allNits}
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
