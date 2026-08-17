import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { getServerI18n } from "@/lib/i18n/server";
import { getNotifications, getSessionProfile } from "@/lib/queries";

export default async function NotificacoesPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { formatDateTime } = await getServerI18n();
  const notifications = await getNotifications(profile.id);

  return (
    <DashboardShell
      area="cliente"
      title="Notificações"
      subtitle="Confirmações, lembretes de vencimento e avisos de atraso."
      userName={profile.full_name}
    >
      <div className="grid gap-3">
        {notifications.map((item) => (
          <Card key={item.id} className={item.read ? "opacity-80" : "border-line-strong"}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {!item.read ? <span className="h-2 w-2 rounded-full bg-charcoal" /> : null}
                  <h3 className="text-[15px] font-semibold">{item.title}</h3>
                </div>
                <p className="mt-2 text-[14px] text-ink-secondary">{item.message}</p>
              </div>
              <div className="text-[12px] text-ink-tertiary">
                {formatDateTime(item.createdAt)}
              </div>
            </div>
          </Card>
        ))}
        {!notifications.length ? (
          <Card>
            <p className="text-[14px] text-ink-secondary">Sem notificações.</p>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
