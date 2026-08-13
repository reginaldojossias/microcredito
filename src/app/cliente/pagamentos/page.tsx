import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RegisterPaymentForm } from "@/components/forms/RegisterPaymentForm";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getLoans, getPayments, getSessionProfile } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PagamentosClientePage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const [list, loans] = await Promise.all([
    getPayments(profile.id),
    getLoans(profile.id),
  ]);

  const payableLoans = loans.filter((l) => l.status !== "liquidado" && l.balance > 0);

  return (
    <DashboardShell
      area="cliente"
      title="Pagamentos"
      subtitle="Histórico de pagamentos associados aos seus empréstimos."
      userName={profile.full_name}
    >
      <Card className="mb-4">
        <h3 className="text-[18px] font-bold tracking-[-0.03em]">Registar pagamento</h3>
        <p className="mt-2 text-[14px] text-[#666]">
          O pagamento é gravado no Supabase e actualiza saldo e prestações.
        </p>
        <div className="mt-5">
          <RegisterPaymentForm loans={payableLoans} />
        </div>
      </Card>

      <div className="grid gap-3">
        {list.map((payment) => (
          <Card
            key={payment.id}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold">{payment.loanReference}</div>
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
        {!list.length ? (
          <Card>
            <p className="text-[14px] text-[#666]">Sem pagamentos registados.</p>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
