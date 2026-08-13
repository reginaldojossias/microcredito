import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NovoPedidoForm } from "@/components/forms/NovoPedidoForm";
import { getProducts, getSessionProfile } from "@/lib/queries";

export default async function NovoPedidoPage() {
  const { user, profile } = await getSessionProfile();
  if (!user || !profile) redirect("/login");

  const products = await getProducts();

  return (
    <DashboardShell
      area="cliente"
      title="Novo pedido"
      subtitle="Simule as condições antes de enviar o pedido de crédito."
      userName={profile.full_name}
    >
      <NovoPedidoForm products={products} />
    </DashboardShell>
  );
}
