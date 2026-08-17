import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NovoPedidoForm } from "@/components/forms/NovoPedidoForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getProducts, getSessionProfile } from "@/lib/queries";
import { getServerI18n } from "@/lib/i18n/server";
import { isProfileVerified } from "@/lib/utils";

export default async function NovoPedidoPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const { dict } = await getServerI18n();
  const products = await getProducts();
  const verified = isProfileVerified(profile);

  return (
    <DashboardShell
      area="cliente"
      title="Novo pedido"
      subtitle="Simule as condições antes de enviar o pedido de crédito."
      userName={profile.full_name}
    >
      {!verified ? (
        <Card className="max-w-2xl">
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-[14px] text-danger"
          >
            <p className="font-medium">{dict.verification.blockedTitle}</p>
            <p className="mt-1">
              {profile.verification_status === "em_analise"
                ? dict.verification.blockedPending
                : dict.verification.blockedBody}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cliente/verificacao">
              <Button>
                {profile.verification_status === "em_analise"
                  ? dict.verification.viewStatus
                  : dict.verification.goVerify}
              </Button>
            </Link>
            <Link href="/cliente/pedidos">
              <Button variant="secondary">{dict.common.back}</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <NovoPedidoForm products={products} />
      )}
    </DashboardShell>
  );
}
