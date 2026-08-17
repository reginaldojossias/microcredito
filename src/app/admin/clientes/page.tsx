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
          className="k-input"
        />
      </Card>

      <div className="k-table-wrap">
        <table className="k-table min-w-[800px]">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Rendimento</th>
              <th>Desde</th>
              <th>Estado</th>
              <th>Verificação</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-ink-tertiary">{client.idDocument}</div>
                </td>
                <td>
                  <div>{client.email}</div>
                  <div className="text-ink-tertiary">{client.phone}</div>
                </td>
                <td>{formatCurrency(client.income)}</td>
                <td>{formatDate(client.createdAt)}</td>
                <td>
                  <StatusPill status={client.status} />
                </td>
                <td>
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
