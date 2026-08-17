import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getServerI18n } from "@/lib/i18n/server";
import { getClients, getSessionProfile } from "@/lib/queries";

export default async function AdminClientesPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatCurrency, formatDate } = await getServerI18n();
  const clients = await getClients();

  return (
    <DashboardShell
      area="admin"
      title="Clientes"
      subtitle="Pesquisa e gestão de clientes da instituição."
      userName={profile.full_name}
    >
      <Card className="mb-4">
        <input
          placeholder="Pesquisar por nome, email ou documento..."
          className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
        />
      </Card>

      <div className="overflow-x-auto rounded-[18px] border border-[#E5E5E5] bg-white">
        <table className="w-full min-w-[800px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#F0F0F0] text-[11px] uppercase tracking-[0.08em] text-[#999]">
              <th className="px-5 py-4 font-medium">Cliente</th>
              <th className="px-5 py-4 font-medium">Contacto</th>
              <th className="px-5 py-4 font-medium">Rendimento</th>
              <th className="px-5 py-4 font-medium">Desde</th>
              <th className="px-5 py-4 font-medium">Estado</th>
              <th className="px-5 py-4 font-medium">Verificação</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-[#F7F7F7]">
                <td className="px-5 py-4">
                  <div className="font-medium">{client.name}</div>
                  <div className="text-[#999]">{client.idDocument}</div>
                </td>
                <td className="px-5 py-4">
                  <div>{client.email}</div>
                  <div className="text-[#999]">{client.phone}</div>
                </td>
                <td className="px-5 py-4">{formatCurrency(client.income)}</td>
                <td className="px-5 py-4">{formatDate(client.createdAt)}</td>
                <td className="px-5 py-4">
                  <StatusPill status={client.status} />
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={client.verificationStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
