"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

const statusStyles: Record<string, string> = {
  pendente: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  em_analise: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  aprovado: "bg-[#F4F4F4] text-[#111] border-[#E7E7E7]",
  rejeitado: "bg-[#FAFAFA] text-[#777] border-[#E7E7E7]",
  corrigir: "bg-[#FAFAFA] text-[#666] border-[#E7E7E7]",
  info_adicional: "bg-[#FAFAFA] text-[#666] border-[#E7E7E7]",
  activo: "bg-black text-white border-black",
  em_atraso: "bg-[#111] text-white border-[#111]",
  liquidado: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  pago: "bg-black text-white border-black",
  atrasado: "bg-[#111] text-white border-[#111]",
  parcial: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  confirmado: "bg-black text-white border-black",
  falhado: "bg-[#FAFAFA] text-[#777] border-[#E7E7E7]",
  enviado: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  contrato_pendente: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  contrato_aceite: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  desembolso_pendente: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  rascunho: "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
  bloqueado: "bg-[#FAFAFA] text-[#777] border-[#E7E7E7]",
  nao_verificado: "bg-[#FFF5F5] text-[#B42318] border-[#F5C2C2]",
  verificado: "bg-black text-white border-black",
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
        "inline-flex items-center rounded-full border px-[9px] py-[5px] text-[10px] font-medium tracking-wide uppercase",
        statusStyles[status] ?? "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
