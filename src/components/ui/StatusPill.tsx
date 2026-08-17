"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

/** Badges semânticos — dourado só para estados de análise / marca */
const statusStyles: Record<string, string> = {
  pendente: "bg-warning-soft text-warning-ink border-transparent",
  em_analise: "bg-review-soft text-review border-transparent",
  aprovado: "bg-success-soft text-success border-transparent",
  rejeitado: "bg-danger-soft text-danger border-transparent",
  corrigir: "bg-warning-soft text-warning-ink border-transparent",
  info_adicional: "bg-info-soft text-info border-transparent",
  activo: "bg-success-soft text-success border-transparent",
  em_atraso: "bg-danger-soft text-danger border-transparent",
  liquidado: "bg-canvas-soft text-ink-secondary border-line",
  pago: "bg-success-soft text-success border-transparent",
  atrasado: "bg-danger-soft text-danger border-transparent",
  parcial: "bg-warning-soft text-warning-ink border-transparent",
  confirmado: "bg-success-soft text-success border-transparent",
  falhado: "bg-danger-soft text-danger border-transparent",
  enviado: "bg-info-soft text-info border-transparent",
  contrato_pendente: "bg-warning-soft text-warning-ink border-transparent",
  contrato_aceite: "bg-success-soft text-success border-transparent",
  desembolso_pendente: "bg-review-soft text-review border-transparent",
  rascunho: "bg-canvas-soft text-ink-secondary border-line",
  bloqueado: "bg-danger-soft text-danger border-transparent",
  nao_verificado: "bg-danger-soft text-danger border-transparent",
  verificado: "bg-success-soft text-success border-transparent",
};

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const { statusLabel } = useI18n();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-[9px] py-[5px] text-[10px] font-medium uppercase tracking-wide",
        statusStyles[status] ??
          "border-line bg-canvas-soft text-ink-secondary",
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
