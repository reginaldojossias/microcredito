import { cn } from "@/lib/utils";

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
};

const labels: Record<string, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  corrigir: "Corrigir",
  info_adicional: "Info. adicional",
  activo: "Activo",
  em_atraso: "Em atraso",
  liquidado: "Liquidado",
  pago: "Pago",
  atrasado: "Atrasado",
  parcial: "Parcial",
  confirmado: "Confirmado",
  falhado: "Falhado",
  enviado: "Enviado",
  contrato_pendente: "Contrato pendente",
  contrato_aceite: "Contrato aceite",
  desembolso_pendente: "Desembolso pendente",
  rascunho: "Rascunho",
  bloqueado: "Bloqueado",
};

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-[9px] py-[5px] text-[10px] font-medium tracking-wide uppercase",
        statusStyles[status] ?? "bg-[#F4F4F4] text-[#555] border-[#E7E7E7]",
        className,
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
