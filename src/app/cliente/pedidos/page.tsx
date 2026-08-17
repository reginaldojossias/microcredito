import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestLoanGate } from "@/components/RequestLoanGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import { getApplications, getSessionProfile } from "@/lib/queries";
import type { VerificationStatus } from "@/lib/types";

export default async function PedidosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatCurrency, formatDate } = await getServerI18n();
  const list = await getApplications(profile.id);
  const verificationStatus =
    (profile.verification_status as VerificationStatus | undefined) ??
    "nao_verificado";

  return (
    <DashboardShell
      area="cliente"
      title="Pedidos de crédito"
      subtitle="Consulte o estado de cada pedido e o número de referência."
      userName={profile.full_name}
    >
      <div className="mb-6 flex justify-end">
        <RequestLoanGate verificationStatus={verificationStatus}>
          <Button>
            <Plus size={16} />
            Novo pedido
          </Button>
        </RequestLoanGate>
      </div>

      <div className="grid gap-3">
        {list.map((app) => (
          <Card key={app.id} hover>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[16px] font-semibold">{app.reference}</h3>
                  <StatusPill status={app.status} />
                </div>
                <p className="mt-2 text-[14px] text-ink-secondary">
                  {app.productName} · {formatCurrency(app.amount)} · {app.term} meses
                </p>
                <p className="mt-1 text-[12px] text-ink-tertiary">
                  Criado em {formatDate(app.createdAt)} · actualizado em{" "}
                  {formatDate(app.updatedAt)}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                  Prestação estimada
                </div>
                <div className="mt-1 text-[18px] font-semibold">
                  {formatCurrency(app.monthlyPayment)}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {!list.length ? (
          <Card>
            <p className="text-[14px] text-ink-secondary">Ainda não tem pedidos.</p>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
