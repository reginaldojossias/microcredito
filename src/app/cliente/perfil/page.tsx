import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getSessionProfile } from "@/lib/queries";
import { mapProfile } from "@/lib/mappers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PerfilPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const client = mapProfile(profile);
  const initials = client.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <DashboardShell
      area="cliente"
      title="Perfil"
      subtitle="Dados pessoais e profissionais associados à sua conta."
      userName={client.name}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[18px] font-semibold text-white">
            {initials}
          </div>
          <h2 className="mt-5 text-[22px] font-bold tracking-[-0.04em]">{client.name}</h2>
          <p className="mt-1 text-[14px] text-[#666]">{client.email}</p>
          <div className="mt-4">
            <StatusPill status={client.status} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["Telefone", client.phone],
              ["Documento", client.idDocument],
              ["Morada", client.address],
              ["Profissão", client.profession],
              ["Rendimento mensal", formatCurrency(client.income)],
              ["Cliente desde", formatDate(client.createdAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
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
