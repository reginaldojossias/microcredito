import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { VerificationForm } from "@/components/forms/VerificationForm";
import { getServerI18n } from "@/lib/i18n/server";
import { getSessionProfile } from "@/lib/queries";
import { mapProfile } from "@/lib/mappers";

export default async function VerificacaoPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { dict } = await getServerI18n();
  const client = mapProfile(profile);

  return (
    <DashboardShell
      area="cliente"
      title={dict.verification.pageTitle}
      subtitle={dict.verification.pageSubtitle}
      userName={client.name}
    >
      <VerificationForm
        verificationStatus={client.verificationStatus}
        prefill={{
          fullName: client.name,
          phone: client.phone,
          dateOfBirth: client.dateOfBirth,
          profession: client.profession,
          income: client.income,
          province: client.province,
          district: client.district,
          neighborhood: client.neighborhood,
          address: client.address,
          idDocument: client.idDocument,
          idDocumentType: client.idDocumentType,
        }}
      />
    </DashboardShell>
  );
}
