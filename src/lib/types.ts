export interface Cliente {
  nit: string;
  nombre: string;
  correo: string;
  contacto: string;
  top150: boolean;
  estado: "al_dia" | "en_seguimiento" | "en_cola_legal" | "promesa_pago" | "pausado";
  ultimo_contacto: string | null;
  proximo_paso: string | null;
  fecha_promesa: string | null;
  notas: string | null;
  resumen_ia: string | null;
  resumen_titulo: string | null;
  resumen_actualizado_at: string | null;
  riesgo: "responde_negocia" | "ignora" | "hostil" | "sin_contacto" | null;
  ultimo_mensaje_at: string | null;
}

export interface ClienteResumen extends Cliente {
  monto_total: number;
  peor_edad: number;
  facturas_vencidas: number;
  facturas_vigentes: number;
  dias_mas_vieja: number;
}

export interface Factura {
  num_factura: string;
  nit: string;
  num_legal: string;
  fecha_factura: string;
  fecha_vencimiento: string;
  dias: number;
  monto: number;
  edad: number;
  estado: "vigente" | "pagada";
  fecha_pago: string | null;
  ultimo_informe: string | null;
}

export interface Mensaje {
  id: number;
  nit: string;
  direccion: "saliente" | "entrante";
  canal: "whatsapp" | "correo";
  plantilla: string | null;
  contenido: string;
  facturas_ref: string[] | null;
  estado: "pendiente_aprobacion" | "aprobado" | "enviando" | "enviado" | "rechazado" | "respondido" | "alerta_interna";
  enviado_at: string | null;
  created_at: string;
}

export interface CarteraPorEdad {
  edad: number;
  n_facturas: number;
  monto_total: number;
}

export interface ResumenGlobal {
  cartera_total: number;
  cartera_vencida: number;
  clientes_criticos: number;
  recuperado_mes: number;
}
