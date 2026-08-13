import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CreateDocumentForm } from "@/components/forms/CreateDocumentForm";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getDocuments, getSessionProfile } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function DocumentosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const docs = await getDocuments(profile.id);

  return (
    <DashboardShell
      area="cliente"
      title="Documentos"
      subtitle="Envie e acompanhe o estado de cada documento do seu perfil."
      userName={profile.full_name}
    >
      <div className="mb-6">
        <CreateDocumentForm />
      </div>

      <div className="grid gap-3">
        {docs.map((doc) => (
          <Card
            key={doc.id}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold">{doc.name}</div>
              <div className="mt-1 text-[13px] text-[#666]">
                {doc.type} · enviado em {formatDate(doc.uploadedAt)}
              </div>
              {doc.notes ? (
                <p className="mt-2 text-[13px] text-[#777]">{doc.notes}</p>
              ) : null}
            </div>
            <StatusPill status={doc.status} />
          </Card>
        ))}
        {!docs.length ? (
          <Card>
            <p className="text-[14px] text-[#666]">Ainda não enviou documentos.</p>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
