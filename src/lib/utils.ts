import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(value: number | string | null | undefined): string {
  if (value == null) return "$0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "—";
    return formatDistanceToNow(d, { addSuffix: true, locale: es });
  } catch {
    return "—";
  }
}

export function formatContacto(contacto: string | null): string {
  if (!contacto) return "—";
  const clean = contacto.replace(/\D/g, "");
  if (clean.length === 12 && clean.startsWith("57")) {
    return `+57 ${clean.slice(2, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
  }
  return contacto;
}

export const EDAD_LABELS: Record<number, string> = {
  0: "Sin vencer",
  1: "1-30d",
  2: "31-60d",
  3: "61-90d",
  4: "91-180d",
  5: ">180d",
};

export const EDAD_LABELS_FULL: Record<number, string> = {
  0: "Sin vencer",
  1: "1-30 días",
  2: "31-60 días",
  3: "61-90 días",
  4: "91-180 días",
  5: ">180 días",
};
