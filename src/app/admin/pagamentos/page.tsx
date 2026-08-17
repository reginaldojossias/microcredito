import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import { getPayments, getSessionProfile } from "@/lib/queries";

export default async function AdminPagamentosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatCurrency, formatDate } = await getServerI18n();
  const payments = await getPayments();

  return (
    <DashboardShell
      area="admin"
      title="Pagamentos"
      subtitle="Confirmação de pagamentos e actualização de saldos."
      userName={profile.full_name}
    >
      <div className="grid gap-3">
        {payments.map((payment) => (
          <Card
            key={payment.id}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold">
                {payment.loanReference} · {payment.clientName}
              </div>
              <div className="mt-1 text-[13px] text-[#666]">
                {payment.method} · {formatDate(payment.paidAt)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[16px] font-semibold">
                {formatCurrency(payment.amount)}
              </div>
              <StatusPill status={payment.status} />
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
