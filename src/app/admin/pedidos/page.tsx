import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import { getApplications, getSessionProfile } from "@/lib/queries";

export default async function AdminPedidosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatCurrency, formatDate } = await getServerI18n();
  const applications = await getApplications();

  return (
    <DashboardShell
      area="admin"
      title="Pedidos de crédito"
      subtitle="Fila de análise, decisão e acompanhamento de pedidos."
      userName={profile.full_name}
    >
      <div className="grid gap-3">
        {applications.map((app) => (
          <Link key={app.id} href={`/admin/pedidos/${app.id}`}>
            <Card hover>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[16px] font-semibold">{app.reference}</h3>
                    <StatusPill status={app.status} />
                  </div>
                  <p className="mt-2 text-[14px] text-ink-secondary">
                    {app.clientName} · {app.productName} · {formatCurrency(app.amount)} ·{" "}
                    {app.term} meses
                  </p>
                  <p className="mt-1 text-[12px] text-ink-tertiary">
                    Actualizado em {formatDate(app.updatedAt)}
                    {app.analyst ? ` · Analista: ${app.analyst}` : ""}
                  </p>
                </div>
                <div className="k-link">Analisar →</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
