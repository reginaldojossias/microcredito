import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CollectionReminderButton } from "@/components/forms/CollectionReminderButton";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  getCollectionSettings,
  getLoans,
  getSessionProfile,
} from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminCobrancasPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const [loans, settings] = await Promise.all([
    getLoans(),
    getCollectionSettings(),
  ]);
  const overdue = loans.filter((l) => l.status === "em_atraso");

  return (
    <DashboardShell
      area="admin"
      title="Cobranças"
      subtitle="Lembretes, avisos de atraso e gestão de mora."
      userName={profile.full_name}
    >
      <Card className="mb-4">
        <h3 className="text-[18px] font-bold tracking-[-0.03em]">Regras configuráveis</h3>
        <p className="mt-2 text-[14px] text-[#666]">
          Juros de mora, períodos de tolerância e encargos seguem as regras da instituição.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Tolerância", `${settings?.grace_days ?? 3} dias`],
            ["Mora diária", `${settings?.daily_penalty_rate ?? 0.15}%`],
            ["Canal preferencial", settings?.preferred_channel ?? "SMS + App"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-4"
            >
              <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                {label}
              </div>
              <div className="mt-2 text-[16px] font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3">
        {overdue.map((loan) => (
          <Card key={loan.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[16px] font-semibold">{loan.reference}</h3>
                  <StatusPill status={loan.status} />
                </div>
                <p className="mt-2 text-[14px] text-[#666]">
                  {loan.clientName} · vencimento {formatDate(loan.nextDueDate)} · saldo{" "}
                  {formatCurrency(loan.balance)}
                </p>
              </div>
              <CollectionReminderButton loanId={loan.id} />
            </div>
          </Card>
        ))}
        {!overdue.length ? (
          <Card>
            <p className="text-[14px] text-[#666]">Sem empréstimos em atraso.</p>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
