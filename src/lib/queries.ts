import { createClient } from "@/lib/supabase/server";
import {
  mapApplication,
  mapAudit,
  mapDocument,
  mapInstallment,
  mapLoan,
  mapNotification,
  mapPayment,
  mapProduct,
  mapProfile,
} from "@/lib/mappers";
import type { Profile } from "@/lib/database.types";

export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, profile: profile as Profile | null };
}

export async function requireProfile() {
  const session = await getSessionProfile();
  if (!session.user || !session.profile) {
    throw new Error("Não autenticado");
  }
  return session as {
    supabase: Awaited<ReturnType<typeof createClient>>;
    user: NonNullable<typeof session.user>;
    profile: Profile;
  };
}

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("credit_products")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function getClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "cliente")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapProfile);
}

export async function getDocuments(clientId?: string) {
  const supabase = await createClient();
  let query = supabase.from("documents").select("*").order("uploaded_at", { ascending: false });
  if (clientId) query = query.eq("client_id", clientId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapDocument);
}

export async function getApplications(clientId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("loan_applications")
    .select(
      "*, client:profiles!client_id(full_name), credit_products(name), analyst:profiles!analyst_id(full_name)",
    )
    .order("created_at", { ascending: false });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapApplication(row as never));
}

export async function getApplicationById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loan_applications")
    .select(
      "*, client:profiles!client_id(full_name), credit_products(name), analyst:profiles!analyst_id(full_name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapApplication(data as never) : null;
}

export async function getLoans(clientId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("loans")
    .select("*, client:profiles!client_id(full_name)")
    .order("created_at", { ascending: false });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapLoan(row as never));
}

export async function getLoanById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loans")
    .select("*, client:profiles!client_id(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapLoan(data as never) : null;
}

export async function getInstallments(loanId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("installments")
    .select("*")
    .eq("loan_id", loanId)
    .order("number");

  if (error) throw error;
  return (data ?? []).map(mapInstallment);
}

export async function getPayments(clientId?: string) {
  const supabase = await createClient();

  if (clientId) {
    const { data: loans } = await supabase.from("loans").select("id").eq("client_id", clientId);
    const loanIds = (loans ?? []).map((l) => l.id);
    if (!loanIds.length) return [];

    const { data, error } = await supabase
      .from("payments")
      .select("*, loans(reference, client_id)")
      .in("loan_id", loanIds)
      .order("paid_at", { ascending: false });

    if (error) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", clientId)
      .maybeSingle();

    return (data ?? []).map((row) =>
      mapPayment({
        ...row,
        loans: {
          reference: (row.loans as { reference: string } | null)?.reference ?? "",
          profiles: { full_name: profile?.full_name ?? "" },
        },
      } as never),
    );
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*, loans(reference, client_id)")
    .order("paid_at", { ascending: false });

  if (error) throw error;

  const clientIds = Array.from(
    new Set(
      (data ?? [])
        .map((row) => (row.loans as { client_id?: string } | null)?.client_id)
        .filter(Boolean) as string[],
    ),
  );

  const { data: profiles } = clientIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", clientIds)
    : { data: [] as { id: string; full_name: string }[] };

  const nameById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_name]));

  return (data ?? []).map((row) => {
    const loan = row.loans as { reference: string; client_id: string } | null;
    return mapPayment({
      ...row,
      loans: {
        reference: loan?.reference ?? "",
        profiles: { full_name: nameById[loan?.client_id ?? ""] ?? "" },
      },
    } as never);
  });
}

export async function getNotifications(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapNotification);
}

export async function getAuditLogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []).map(mapAudit);
}

export async function getDisbursements() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("disbursements")
    .select(
      "*, loan_applications(reference, amount, client_id, status, client:profiles!client_id(full_name))",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCollectionSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collection_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAdminStats() {
  const supabase = await createClient();

  const [loansRes, appsRes, clientsRes, overdueRes, paymentsRes] = await Promise.all([
    supabase.from("loans").select("balance, status, paid_amount, principal"),
    supabase.from("loan_applications").select("id, status"),
    supabase.from("profiles").select("id").eq("role", "cliente").eq("status", "activo"),
    supabase.from("loans").select("id").eq("status", "em_atraso"),
    supabase
      .from("payments")
      .select("amount, paid_at, status")
      .eq("status", "confirmado"),
  ]);

  const loans = loansRes.data ?? [];
  const apps = appsRes.data ?? [];
  const activeLoans = loans.filter((l) => l.status !== "liquidado");
  const carteiraActiva = activeLoans.reduce((sum, l) => sum + Number(l.balance), 0);
  const pedidosPendentes = apps.filter((a) =>
    ["enviado", "em_analise", "info_adicional"].includes(a.status),
  ).length;

  const month = new Date().toISOString().slice(0, 7);
  // Desembolsos approx from loans disbursed this month
  const { data: disbursed } = await supabase
    .from("loans")
    .select("principal, disbursed_at")
    .gte("disbursed_at", `${month}-01`);

  const desembolsosMes = (disbursed ?? []).reduce(
    (sum, l) => sum + Number(l.principal),
    0,
  );

  const totalLoans = loans.length || 1;
  const taxaInadimplencia = ((overdueRes.data?.length ?? 0) / totalLoans) * 100;

  return {
    carteiraActiva,
    pedidosPendentes,
    desembolsosMes,
    taxaInadimplencia: Number(taxaInadimplencia.toFixed(1)),
    clientesActivos: clientsRes.data?.length ?? 0,
    cobrancasAbertas: overdueRes.data?.length ?? 0,
  };
}
