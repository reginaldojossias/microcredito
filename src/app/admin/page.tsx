import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import {
  getAdminStats,
  getApplications,
  getAuditLogs,
  getLoans,
  getSessionProfile,
} from "@/lib/queries";

export default async function AdminDashboardPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { dict, formatCurrency, formatDateTime } = await getServerI18n();
  const [stats, applications, loans, auditLog] = await Promise.all([
    getAdminStats(),
    getApplications(),
    getLoans(),
    getAuditLogs(),
  ]);

  const queue = applications.filter((a) =>
    ["enviado", "em_analise", "info_adicional", "aprovado", "desembolso_pendente"].includes(
      a.status,
    ),
  );
  const overdue = loans.filter((l) => l.status === "em_atraso");

  return (
    <DashboardShell
      area="admin"
      title={dict.admin.operationalPanel}
      subtitle={dict.admin.operationalSubtitle}
      userName={profile.full_name}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={dict.admin.activePortfolio}
          value={`${(stats.carteiraActiva / 1_000_000).toFixed(1)}M`}
          hint={formatCurrency(stats.carteiraActiva)}
        />
        <StatCard
          label={dict.admin.pendingApplications}
          value={String(stats.pedidosPendentes)}
        />
        <StatCard
          label={dict.admin.monthlyDisbursements}
          value={`${(stats.desembolsosMes / 1_000_000).toFixed(1)}M`}
          hint={formatCurrency(stats.desembolsosMes)}
        />
        <StatCard label={dict.admin.delinquency} value={`${stats.taxaInadimplencia}%`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[18px] font-bold tracking-[-0.03em]">{dict.admin.analysisQueue}</h3>
            <Link href="/admin/pedidos" className="k-link">
              {dict.client.viewAll} →
            </Link>
          </div>
          <div className="space-y-3">
            {queue.slice(0, 5).map((app) => (
              <Link
                key={app.id}
                href={`/admin/pedidos/${app.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-line p-4 transition hover:border-line-strong sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold">{app.reference}</div>
                  <div className="text-[13px] text-ink-secondary">
                    {app.clientName} · {formatCurrency(app.amount)}
                  </div>
                </div>
                <StatusPill status={app.status} />
              </Link>
            ))}
            {!queue.length ? (
              <p className="text-[14px] text-ink-secondary">{dict.admin.emptyQueue}</p>
            ) : null}
          </div>
        </Card>

        <Card>
          <h3 className="mb-5 text-[18px] font-bold tracking-[-0.03em]">
            {dict.admin.overdueLoans}
          </h3>
          <div className="space-y-3">
            {overdue.map((loan) => (
              <div key={loan.id} className="rounded-2xl border border-line p-4">
                <div className="font-semibold">{loan.reference}</div>
                <div className="mt-1 text-[13px] text-ink-secondary">{loan.clientName}</div>
                <div className="mt-2 text-[14px] font-medium">
                  {formatCurrency(loan.balance)}
                </div>
              </div>
            ))}
            {!overdue.length ? (
              <p className="text-[14px] text-ink-secondary">{dict.admin.noOverdue}</p>
            ) : null}
            <Link href="/admin/cobrancas" className="k-link inline-block">
              {dict.admin.openCollectionsLink} →
            </Link>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="mb-5 text-[18px] font-bold tracking-[-0.03em]">{dict.admin.recentAudit}</h3>
        <div className="space-y-3">
          {auditLog.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-2 border-b border-line pb-3 last:border-0 sm:flex-row sm:justify-between"
            >
              <div>
                <div className="font-medium">{entry.action}</div>
                <div className="text-[13px] text-ink-secondary">
                  {entry.actor} · {entry.target} · {entry.detail}
                </div>
              </div>
              <div className="text-[12px] text-ink-tertiary">
                {formatDateTime(entry.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
