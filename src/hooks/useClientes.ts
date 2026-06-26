"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { ClienteResumen } from "@/lib/types";

export interface FiltrosClientes {
  busqueda: string;
  edades: number[];
  estados: string[];
  top150: "todos" | "solo" | "sin";
}

const INITIAL_FILTERS: FiltrosClientes = {
  busqueda: "",
  edades: [],
  estados: [],
  top150: "todos",
};

export function useClientes() {
  const [data, setData] = useState<ClienteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosClientes>(INITIAL_FILTERS);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("vista_clientes_resumen")
      .select("nit, nombre, top150, estado, correo, contacto, ultimo_contacto, proximo_paso, fecha_promesa, resumen_titulo, riesgo, monto_total, peor_edad, facturas_vencidas, facturas_vigentes, dias_mas_vieja")
      .order("monto_total", { ascending: false })
      .limit(200);

    if (filtros.busqueda) {
      query = query.or(`nombre.ilike.%${filtros.busqueda}%,nit.ilike.%${filtros.busqueda}%`);
    }
    if (filtros.edades.length > 0) {
      query = query.in("peor_edad", filtros.edades);
    }
    if (filtros.estados.length > 0) {
      query = query.in("estado", filtros.estados);
    }
    if (filtros.top150 === "solo") {
      query = query.eq("top150", true);
    } else if (filtros.top150 === "sin") {
      query = query.eq("top150", false);
    }

    const { data: rows, error } = await query;
    if (!error && rows) {
      setData(rows as ClienteResumen[]);
    }
    setLoading(false);
  }, [filtros]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const montoFiltrado = useMemo(
    () => data.reduce((sum, c) => sum + (Number(c.monto_total) || 0), 0),
    [data]
  );

  const resetFiltros = () => setFiltros(INITIAL_FILTERS);

  const hasFilters =
    filtros.busqueda !== "" ||
    filtros.edades.length > 0 ||
    filtros.estados.length > 0 ||
    filtros.top150 !== "todos";

  return { data, loading, filtros, setFiltros, resetFiltros, hasFilters, montoFiltrado, refetch: fetchClientes };
}
