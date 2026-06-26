const COLORS: Record<string, { bg: string; text: string; label: string }> = {
  al_dia: { bg: "rgba(22,163,74,0.10)", text: "#16A34A", label: "Al día" },
  en_seguimiento: { bg: "rgba(37,99,235,0.10)", text: "#2563EB", label: "En seguimiento" },
  promesa_pago: { bg: "rgba(217,119,6,0.10)", text: "#D97706", label: "Promesa" },
  en_cola_legal: { bg: "rgba(220,38,38,0.10)", text: "#DC2626", label: "Cola legal" },
  pausado: { bg: "rgba(107,114,128,0.10)", text: "#6B7280", label: "Pausado" },
};

export default function BadgeEstado({ estado }: { estado: string | null | undefined }) {
  if (!estado) return null;
  const c = COLORS[estado] ?? { bg: "rgba(107,114,128,0.10)", text: "#6B7280", label: estado };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}
