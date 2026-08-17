import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  getAdminStats,
  getAuditLogs,
  getSessionProfile,
} from "@/lib/queries";
import { getServerI18n } from "@/lib/i18n/server";

export default async function AdminRelatoriosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatCurrency, formatDateTime } = await getServerI18n();
  const [stats, auditLog] = await Promise.all([getAdminStats(), getAuditLogs()]);

  return (
    <DashboardShell
      area="admin"
      title="Relatórios"
      subtitle="Indicadores, histórico operacional e trilha de auditoria."
      userName={profile.full_name}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Clientes activos" value={String(stats.clientesActivos)} />
        <StatCard label="Cobranças abertas" value={String(stats.cobrancasAbertas)} />
        <StatCard
          label="Carteira"
          value={`${Math.round(stats.carteiraActiva / 1_000_000)}M`}
          hint={formatCurrency(stats.carteiraActiva)}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-[18px] font-bold tracking-[-0.03em]">Resumo operacional</h3>
          <div className="mt-5 space-y-4">
            {[
              ["Pedidos pendentes", String(stats.pedidosPendentes)],
              ["Desembolsos do mês", formatCurrency(stats.desembolsosMes)],
              ["Taxa de inadimplência", `${stats.taxaInadimplencia}%`],
              ["Clientes activos", String(stats.clientesActivos)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-[14px]">
                <span className="text-[#666]">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-[18px] font-bold tracking-[-0.03em]">Histórico de auditoria</h3>
          <div className="mt-5 space-y-4">
            {auditLog.map((entry) => (
              <div key={entry.id} className="border-b border-[#F5F5F5] pb-3 last:border-0">
                <div className="font-medium">{entry.action}</div>
                <div className="mt-1 text-[13px] text-[#666]">
                  {entry.actor} · {entry.target}
                </div>
                <div className="mt-1 text-[12px] text-[#999]">
                  {formatDateTime(entry.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
