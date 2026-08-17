import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import { getLoans, getSessionProfile } from "@/lib/queries";

export default async function AdminEmprestimosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatCurrency, formatDate } = await getServerI18n();
  const loans = await getLoans();

  return (
    <DashboardShell
      area="admin"
      title="Empréstimos"
      subtitle="Carteira activa, em atraso e liquidada."
      userName={profile.full_name}
    >
      <div className="grid gap-3">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[16px] font-semibold">{loan.reference}</h3>
                  <StatusPill status={loan.status} />
                </div>
                <p className="mt-2 text-[14px] text-ink-secondary">
                  {loan.clientName} · desembolsado em {formatDate(loan.disbursedAt)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 text-left sm:text-right">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                    Principal
                  </div>
                  <div className="mt-1 font-semibold">{formatCurrency(loan.principal)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                    Saldo
                  </div>
                  <div className="mt-1 font-semibold">{formatCurrency(loan.balance)}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
