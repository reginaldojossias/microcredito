import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bell, FileText, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  getApplications,
  getDocuments,
  getInstallments,
  getLoans,
  getNotifications,
  getSessionProfile,
} from "@/lib/queries";
import { mapProfile } from "@/lib/mappers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClienteDashboardPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

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
      title={`Olá, ${client.name.split(" ")[0]}`}
      subtitle="Acompanhe pedidos, documentos e a sua situação financeira."
      userName={client.name}
    >
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                Empréstimo activo
              </div>
              <h2 className="mt-2 text-[28px] font-bold tracking-[-0.04em]">
                {activeLoan ? activeLoan.reference : "Sem empréstimo activo"}
              </h2>
              {activeLoan ? (
                <p className="mt-2 text-[14px] text-[#666]">
                  Próxima prestação {formatCurrency(activeLoan.nextInstallment)} ·{" "}
                  {formatDate(activeLoan.nextDueDate)}
                </p>
              ) : null}
            </div>
            {activeLoan ? <StatusPill status={activeLoan.status} /> : null}
          </div>

          {activeLoan ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Valor recebido", formatCurrency(activeLoan.principal)],
                ["Total a pagar", formatCurrency(activeLoan.totalPayable)],
                ["Já pago", formatCurrency(activeLoan.paidAmount)],
                ["Saldo em aberto", formatCurrency(activeLoan.balance)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-4"
                >
                  <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
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
              <Link href="/cliente/pedidos/novo">
                <Button>
                  Solicitar crédito
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          )}
        </Card>

        <div className="grid gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-[#F3F3F3]">
                <FileText size={18} />
              </div>
              <div>
                <div className="text-[13px] font-semibold">Documentos</div>
                <div className="text-[12px] text-[#999]">{docsPending} por tratar</div>
              </div>
            </div>
            <Link href="/cliente/documentos" className="mt-4 inline-block text-[13px] font-medium">
              Ver documentos →
            </Link>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-[#F3F3F3]">
                <Bell size={18} />
              </div>
              <div>
                <div className="text-[13px] font-semibold">Notificações</div>
                <div className="text-[12px] text-[#999]">{unread} por ler</div>
              </div>
            </div>
            <Link
              href="/cliente/notificacoes"
              className="mt-4 inline-block text-[13px] font-medium"
            >
              Abrir caixa →
            </Link>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[18px] font-bold tracking-[-0.03em]">Pedido em curso</h3>
            <Link href="/cliente/pedidos">
              <Button variant="secondary" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          {openApp ? (
            <div className="rounded-2xl border border-[#E5E5E5] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[15px] font-semibold">{openApp.reference}</div>
                  <div className="text-[13px] text-[#666]">
                    {openApp.productName} · {formatCurrency(openApp.amount)}
                  </div>
                </div>
                <StatusPill status={openApp.status} />
              </div>
              <p className="mt-4 text-[13px] text-[#666]">
                Actualizado em {formatDate(openApp.updatedAt)}.
              </p>
            </div>
          ) : (
            <p className="text-[14px] text-[#666]">Não existe pedido em análise.</p>
          )}
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[18px] font-bold tracking-[-0.03em]">Próxima prestação</h3>
            <Wallet size={18} className="text-[#999]" />
          </div>
          {nextInstallment ? (
            <div>
              <div className="text-[32px] font-bold tracking-[-0.04em]">
                {formatCurrency(nextInstallment.amount)}
              </div>
              <p className="mt-2 text-[14px] text-[#666]">
                Prestação #{nextInstallment.number} · vencimento{" "}
                {formatDate(nextInstallment.dueDate)}
              </p>
              <Link href="/cliente/pagamentos" className="mt-5 inline-block">
                <Button size="sm">Registar pagamento</Button>
              </Link>
            </div>
          ) : (
            <p className="text-[14px] text-[#666]">Sem prestações pendentes.</p>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
