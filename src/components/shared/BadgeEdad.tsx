import { EDAD_LABELS } from "@/lib/utils";

const COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "rgba(107,114,128,0.10)", text: "#6B7280" },
  1: { bg: "rgba(22,163,74,0.10)", text: "#16A34A" },
  2: { bg: "rgba(217,119,6,0.10)", text: "#D97706" },
  3: { bg: "rgba(234,88,12,0.10)", text: "#EA580C" },
  4: { bg: "rgba(220,38,38,0.10)", text: "#DC2626" },
  5: { bg: "rgba(153,27,27,0.10)", text: "#991B1B" },
};

export default function BadgeEdad({ edad }: { edad: number | null | undefined }) {
  if (edad == null) return null;
  const c = COLORS[edad] ?? COLORS[0];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {edad} · {EDAD_LABELS[edad] ?? edad}
    </span>
  );
}
