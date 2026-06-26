"use client";

import { useState } from "react";
import { X, CalendarDays } from "lucide-react";

interface Props {
  nit: string;
  nombre: string;
  onConfirm: (nit: string, fecha: string) => void;
  onClose: () => void;
}

export default function PromesaModal({ nit, nombre, onConfirm, onClose }: Props) {
  const [fecha, setFecha] = useState("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 animate-fade-in" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#F26522]" />
            <h3 className="text-sm font-semibold text-[#111827]">Acuerdo de pago</h3>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#111827]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-[#6B7280] mb-1">Cliente</p>
        <p className="text-sm font-medium text-[#111827] mb-4">{nombre} <span className="text-xs text-[#9CA3AF]">({nit})</span></p>

        <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Fecha de promesa de pago</label>
        <input
          type="date"
          value={fecha}
          min={minDate}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]/20 transition-colors"
        />

        <div className="mt-5 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => { if (fecha) onConfirm(nit, fecha); }}
            disabled={!fecha}
            className="rounded-lg bg-[#F26522] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#D95A1B] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmar acuerdo
          </button>
        </div>
      </div>
    </>
  );
}
