import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getLoans, getSessionProfile } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function EmprestimosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const list = await getLoans(profile.id);

  return (
    <DashboardShell
      area="cliente"
      title="Empréstimos"
      subtitle="Consulte saldo, próximas prestações e histórico."
      userName={profile.full_name}
    >
      <div className="grid gap-3">
        {list.map((loan) => (
          <Link key={loan.id} href={`/cliente/emprestimos/${loan.id}`}>
            <Card hover>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[16px] font-semibold">{loan.reference}</h3>
                    <StatusPill status={loan.status} />
                  </div>
                  <p className="mt-2 text-[14px] text-[#666]">
                    Desembolsado em {formatDate(loan.disbursedAt)} · saldo{" "}
                    {formatCurrency(loan.balance)}
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                    Próxima prestação
                  </div>
                  <div className="mt-1 text-[18px] font-semibold">
                    {loan.nextInstallment ? formatCurrency(loan.nextInstallment) : "—"}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {!list.length ? (
          <Card>
            <p className="text-[14px] text-[#666]">Ainda não tem empréstimos activos.</p>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
