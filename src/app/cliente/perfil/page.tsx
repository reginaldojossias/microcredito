import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getSessionProfile } from "@/lib/queries";
import { getServerI18n } from "@/lib/i18n/server";
import { mapProfile } from "@/lib/mappers";
import { ID_DOCUMENT_TYPES } from "@/lib/types";

export default async function PerfilPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { dict, formatCurrency, formatDate, locale } = await getServerI18n();
  const client = mapProfile(profile);
  const initials = client.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  const docTypeLabel =
    ID_DOCUMENT_TYPES.find((t) => t.value === client.idDocumentType)?.[
      locale === "en" ? "labelEn" : "labelPt"
    ] ??
    client.idDocumentType ??
    "—";

  const needsVerification = client.verificationStatus !== "verificado";

  return (
    <DashboardShell
      area="cliente"
      title="Perfil"
      subtitle="Dados pessoais e profissionais associados à sua conta."
      userName={client.name}
    >
      {needsVerification ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-[14px] text-danger"
        >
          <p className="font-medium">{dict.verification.blockedTitle}</p>
          <p className="mt-1">
            {client.verificationStatus === "em_analise"
              ? dict.verification.blockedPending
              : dict.verification.profileBanner}
          </p>
          <Link href="/cliente/verificacao" className="mt-3 inline-block">
            <Button size="sm" className="bg-danger text-white hover:bg-danger/90 border-transparent">
              {client.verificationStatus === "em_analise"
                ? dict.verification.viewStatus
                : dict.verification.goVerify}
            </Button>
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal text-[18px] font-semibold text-white">
            {initials}
          </div>
          <h2 className="mt-5 text-[22px] font-bold tracking-[-0.04em]">{client.name}</h2>
          <p className="mt-1 text-[14px] text-ink-secondary">{client.email}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill status={client.status} />
            <StatusPill status={client.verificationStatus} />
          </div>
          {needsVerification && client.verificationStatus !== "em_analise" ? (
            <Link href="/cliente/verificacao" className="mt-5 inline-block">
              <Button size="sm">{dict.verification.goVerify}</Button>
            </Link>
          ) : null}
        </Card>

        <Card className="lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["Telefone", client.phone],
              ["Tipo de documento", docTypeLabel],
              ["Documento", client.idDocument],
              ["Data de nascimento", client.dateOfBirth ? formatDate(client.dateOfBirth) : "—"],
              ["Província", client.province],
              ["Distrito", client.district],
              ["Bairro", client.neighborhood],
              ["Morada", client.address],
              ["Profissão", client.profession],
              ["Rendimento mensal", formatCurrency(client.income)],
              ["Cliente desde", formatDate(client.createdAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                  {label}
                </div>
                <div className="mt-1 text-[14px] font-medium">{value || "—"}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
