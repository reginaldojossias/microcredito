import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DecisionForm } from "@/components/forms/DecisionForm";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  getApplicationById,
  getDocuments,
  getSessionProfile,
} from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminPedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const app = await getApplicationById(id);
  if (!app) notFound();

  const clientDocs = await getDocuments(app.clientId);

  return (
    <DashboardShell
      area="admin"
      title={app.reference}
      subtitle="Consulta de dados, documentos, histórico e decisão de crédito."
      userName={profile.full_name}
    >
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[24px] font-bold tracking-[-0.04em]">{app.clientName}</h2>
              <p className="mt-2 text-[14px] text-[#666]">
                {app.productName} · finalidade: {app.purpose}
              </p>
            </div>
            <StatusPill status={app.status} />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Montante", formatCurrency(app.amount)],
              ["Prazo", `${app.term} meses`],
              ["Prestação", formatCurrency(app.monthlyPayment)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-4"
              >
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                  {label}
                </div>
                <div className="mt-2 text-[18px] font-semibold">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-[16px] font-semibold">Documentos do cliente</h3>
            <div className="mt-3 space-y-2">
              {clientDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-[#E5E5E5] px-4 py-3"
                >
                  <div>
                    <div className="text-[14px] font-medium">{doc.name}</div>
                    <div className="text-[12px] text-[#999]">
                      {formatDate(doc.uploadedAt)}
                    </div>
                  </div>
                  <StatusPill status={doc.status} />
                </div>
              ))}
              {!clientDocs.length ? (
                <p className="text-[13px] text-[#666]">Sem documentos.</p>
              ) : null}
            </div>
          </div>
        </Card>

        <DecisionForm
          id={app.id}
          currentStatus={app.status}
          initialNote={app.decisionNote ?? ""}
        />
      </div>
    </DashboardShell>
  );
}
