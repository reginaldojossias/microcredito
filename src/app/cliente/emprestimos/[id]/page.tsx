import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  getInstallments,
  getLoanById,
  getSessionProfile,
} from "@/lib/queries";
import { getServerI18n } from "@/lib/i18n/server";

export default async function EmprestimoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatCurrency, formatDate } = await getServerI18n();
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
            <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
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
        <div className="k-table-wrap">
          <table className="k-table min-w-[640px]">
            <thead>
              <tr>
                <th>#</th>
                <th>Vencimento</th>
                <th>Valor</th>
                <th>Pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((item) => (
                <tr key={item.id}>
                  <td>{item.number}</td>
                  <td>{formatDate(item.dueDate)}</td>
                  <td>{formatCurrency(item.amount)}</td>
                  <td>{formatCurrency(item.paidAmount)}</td>
                  <td>
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
