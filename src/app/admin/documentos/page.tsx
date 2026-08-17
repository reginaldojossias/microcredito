import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DocumentReviewActions } from "@/components/forms/DocumentReviewActions";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import { getClients, getDocuments, getSessionProfile } from "@/lib/queries";

export default async function AdminDocumentosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatDate } = await getServerI18n();
  const [documents, clients] = await Promise.all([getDocuments(), getClients()]);
  const clientName = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  return (
    <DashboardShell
      area="admin"
      title="Verificação de documentos"
      subtitle="Analise documentos associados aos perfis dos clientes."
      userName={profile.full_name}
    >
      <div className="grid gap-3">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[15px] font-semibold">{doc.name}</h3>
                  <StatusPill status={doc.status} />
                </div>
                <p className="mt-2 text-[13px] text-[#666]">
                  {clientName[doc.clientId] ?? "Cliente"} · {doc.type} ·{" "}
                  {formatDate(doc.uploadedAt)}
                </p>
                {doc.notes ? (
                  <p className="mt-2 text-[13px] text-[#777]">{doc.notes}</p>
                ) : null}
              </div>
              <DocumentReviewActions id={doc.id} />
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
