import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ConfirmDisbursementButton } from "@/components/forms/ConfirmDisbursementButton";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getDisbursements, getSessionProfile } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDesembolsosPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const items = await getDisbursements();

  return (
    <DashboardShell
      area="admin"
      title="Desembolsos"
      subtitle="Só após confirmação o empréstimo passa para o estado activo."
      userName={profile.full_name}
    >
      <div className="grid gap-3">
        {items.map((item) => {
          const app = item.loan_applications as {
            reference: string;
            amount: number;
            client?: { full_name: string } | null;
          } | null;

          return (
            <Card key={item.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[16px] font-semibold">
                      {app?.reference ?? "Pedido"}
                    </h3>
                    <StatusPill
                      status={
                        item.status === "confirmado" ? "activo" : "desembolso_pendente"
                      }
                    />
                  </div>
                  <p className="mt-2 text-[14px] text-[#666]">
                    {app?.client?.full_name ?? "Cliente"} ·{" "}
                    {formatCurrency(Number(item.amount))} · método: {item.method}
                  </p>
                </div>
                {item.status !== "confirmado" ? (
                  <ConfirmDisbursementButton id={item.id} />
                ) : (
                  <div className="text-[13px] text-[#666]">
                    Empréstimo activo · plano de pagamentos gerado
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        {!items.length ? (
          <Card>
            <p className="text-[14px] text-[#666]">Sem desembolsos pendentes.</p>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
