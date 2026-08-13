import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  getInstallments,
  getLoanById,
  getSessionProfile,
} from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function EmprestimoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const loan = await getLoanById(id);
  if (!loan || loan.clientId !== profile.id) notFound();

  const calendar = await getInstallments(loan.id);

  return (
    <DashboardShell
      area="cliente"
      title={loan.reference}
      subtitle="Detalhe do empréstimo, saldo e calendário de prestações."
      userName={profile.full_name}
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {[
          ["Valor recebido", formatCurrency(loan.principal)],
          ["Total previsto", formatCurrency(loan.totalPayable)],
          ["Já pago", formatCurrency(loan.paidAmount)],
          ["Saldo em aberto", formatCurrency(loan.balance)],
        ].map(([label, value]) => (
          <Card key={label}>
            <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
              {label}
            </div>
            <div className="mt-2 text-[22px] font-bold tracking-[-0.04em]">{value}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[18px] font-bold tracking-[-0.03em]">
            Calendário de prestações
          </h3>
          <StatusPill status={loan.status} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#F0F0F0] text-[11px] uppercase tracking-[0.08em] text-[#999]">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Vencimento</th>
                <th className="pb-3 font-medium">Valor</th>
                <th className="pb-3 font-medium">Pago</th>
                <th className="pb-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((item) => (
                <tr key={item.id} className="border-b border-[#F7F7F7]">
                  <td className="py-4">{item.number}</td>
                  <td className="py-4">{formatDate(item.dueDate)}</td>
                  <td className="py-4">{formatCurrency(item.amount)}</td>
                  <td className="py-4">{formatCurrency(item.paidAmount)}</td>
                  <td className="py-4">
                    <StatusPill status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
