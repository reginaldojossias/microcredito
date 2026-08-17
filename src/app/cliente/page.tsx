import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bell, FileText, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestLoanGate } from "@/components/RequestLoanGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import {
  getApplications,
  getDocuments,
  getInstallments,
  getLoans,
  getNotifications,
  getSessionProfile,
} from "@/lib/queries";
import { mapProfile } from "@/lib/mappers";

export default async function ClienteDashboardPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { dict, formatCurrency, formatDate } = await getServerI18n();
  const client = mapProfile(profile);
  const [applications, documents, loans, notifications] = await Promise.all([
    getApplications(profile.id),
    getDocuments(profile.id),
    getLoans(profile.id),
    getNotifications(profile.id),
  ]);

  const activeLoan = loans.find((l) => l.status !== "liquidado");
  const openApp = applications.find(
    (a) => !["activo", "liquidado", "rejeitado"].includes(a.status),
  );
  const installments = activeLoan ? await getInstallments(activeLoan.id) : [];
  const nextInstallment = installments.find((i) =>
    ["pendente", "atrasado", "parcial"].includes(i.status),
  );
  const unread = notifications.filter((n) => !n.read).length;
  const docsPending = documents.filter((d) =>
    ["pendente", "em_analise", "corrigir"].includes(d.status),
  ).length;

  return (
    <DashboardShell
      area="cliente"
      title={`${dict.client.greeting}, ${client.name.split(" ")[0]}`}
      subtitle={dict.client.dashboardSubtitle}
      userName={client.name}
    >
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                {dict.client.activeLoan}
              </div>
              <h2 className="mt-2 text-[28px] font-bold tracking-[-0.04em]">
                {activeLoan ? activeLoan.reference : dict.client.noActiveLoan}
              </h2>
              {activeLoan ? (
                <p className="mt-2 text-[14px] text-ink-secondary">
                  {dict.client.nextInstallment} {formatCurrency(activeLoan.nextInstallment)} ·{" "}
                  {formatDate(activeLoan.nextDueDate)}
                </p>
              ) : null}
            </div>
            {activeLoan ? <StatusPill status={activeLoan.status} /> : null}
          </div>

          {activeLoan ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [dict.client.amountReceived, formatCurrency(activeLoan.principal)],
                [dict.client.totalPayable, formatCurrency(activeLoan.totalPayable)],
                [dict.client.alreadyPaid, formatCurrency(activeLoan.paidAmount)],
                [dict.client.outstandingBalance, formatCurrency(activeLoan.balance)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="k-metric-tile"
                >
                  <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                    {label}
                  </div>
                  <div className="mt-2 text-[18px] font-semibold tracking-[-0.03em]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <RequestLoanGate verificationStatus={client.verificationStatus}>
                <Button>
                  {dict.client.requestCredit}
                  <ArrowRight size={16} />
                </Button>
              </RequestLoanGate>
            </div>
          )}
        </Card>

        <div className="grid gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="k-icon-well">
                <FileText size={18} />
              </div>
              <div>
                <div className="text-[13px] font-semibold">{dict.dashboard.clientNav.documents}</div>
                <div className="text-[12px] text-ink-tertiary">
                  {docsPending} {dict.client.documentsToReview}
                </div>
              </div>
            </div>
            <Link href="/cliente/documentos" className="k-link mt-4 inline-block">
              {dict.client.viewDocuments} →
            </Link>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="k-icon-well">
                <Bell size={18} />
              </div>
              <div>
                <div className="text-[13px] font-semibold">
                  {dict.dashboard.clientNav.notifications}
                </div>
                <div className="text-[12px] text-ink-tertiary">
                  {unread} {dict.client.unreadCount}
                </div>
              </div>
            </div>
            <Link href="/cliente/notificacoes" className="k-link mt-4 inline-block">
              {dict.client.openInbox} →
            </Link>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[18px] font-bold tracking-[-0.03em]">
              {dict.client.applicationInProgress}
            </h3>
            <Link href="/cliente/pedidos">
              <Button variant="secondary" size="sm">
                {dict.client.viewAll}
              </Button>
            </Link>
          </div>
          {openApp ? (
            <div className="rounded-2xl border border-line p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[15px] font-semibold">{openApp.reference}</div>
                  <div className="text-[13px] text-ink-secondary">
                    {openApp.productName} · {formatCurrency(openApp.amount)}
                  </div>
                </div>
                <StatusPill status={openApp.status} />
              </div>
              <p className="mt-4 text-[13px] text-ink-secondary">
                {dict.client.updatedAt} {formatDate(openApp.updatedAt)}.
              </p>
            </div>
          ) : (
            <p className="text-[14px] text-ink-secondary">{dict.client.noApplicationInReview}</p>
          )}
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[18px] font-bold tracking-[-0.03em]">
              {dict.client.nextInstallmentTitle}
            </h3>
            <Wallet size={18} className="text-gold" />
          </div>
          {nextInstallment ? (
            <div>
              <div className="text-[32px] font-bold tracking-[-0.04em]">
                {formatCurrency(nextInstallment.amount)}
              </div>
              <p className="mt-2 text-[14px] text-ink-secondary">
                {dict.client.installmentNumber} #{nextInstallment.number} · {dict.client.dueDate}{" "}
                {formatDate(nextInstallment.dueDate)}
              </p>
              <Link href="/cliente/pagamentos" className="mt-5 inline-block">
                <Button size="sm">{dict.client.registerPayment}</Button>
              </Link>
            </div>
          ) : (
            <p className="text-[14px] text-ink-secondary">{dict.client.noPendingInstallments}</p>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
