import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type SeedUser = {
  email: string;
  password: string;
  full_name: string;
  role: "cliente" | "admin" | "analista";
  phone?: string;
  address?: string;
  id_document?: string;
  profession?: string;
  income?: number;
  status?: "activo" | "pendente";
};

const users: SeedUser[] = [
  {
    email: "admin@kukula.co.mz",
    password: "demo1234",
    full_name: "Carla Mendes",
    role: "admin",
    phone: "+258 84 000 0001",
    status: "activo",
  },
  {
    email: "analista@kukula.co.mz",
    password: "demo1234",
    full_name: "Rui Almeida",
    role: "analista",
    phone: "+258 84 000 0002",
    status: "activo",
  },
  {
    email: "maria.fernandes@email.com",
    password: "demo1234",
    full_name: "Maria Fernandes",
    role: "cliente",
    phone: "+258 84 123 4567",
    address: "Maputo, KaMpfumo",
    id_document: "BI 010203040506M010",
    profession: "Comerciante",
    income: 450000,
    status: "activo",
  },
  {
    email: "joao.baptista@email.com",
    password: "demo1234",
    full_name: "João Baptista",
    role: "cliente",
    phone: "+258 86 222 3333",
    address: "Beira, Centro",
    id_document: "BI 020304050607B012",
    profession: "Agricultor",
    income: 280000,
    status: "pendente",
  },
  {
    email: "ana.costa@email.com",
    password: "demo1234",
    full_name: "Ana Costa",
    role: "cliente",
    phone: "+258 85 444 5555",
    address: "Nampula, Centro",
    id_document: "BI 030405060708N089",
    profession: "Costureira",
    income: 210000,
    status: "activo",
  },
  {
    email: "pedro.silva@email.com",
    password: "demo1234",
    full_name: "Pedro Silva",
    role: "cliente",
    phone: "+258 87 666 7777",
    address: "Matola, Machava",
    id_document: "BI 040506070809T021",
    profession: "Motorista",
    income: 320000,
    status: "activo",
  },
];

async function ensureUser(user: SeedUser) {
  const { data: list } = await supabase.auth.admin.listUsers({ perPage: 200 });
  const existing = list?.users.find((u) => u.email === user.email);

  if (existing) {
    await supabase
      .from("profiles")
      .update({
        role: user.role,
        full_name: user.full_name,
        phone: user.phone ?? null,
        address: user.address ?? null,
        id_document: user.id_document ?? null,
        profession: user.profession ?? null,
        income: user.income ?? 0,
        status: user.status ?? "pendente",
        verification_status:
          user.role !== "cliente"
            ? "verificado"
            : user.status === "activo"
              ? "verificado"
              : "nao_verificado",
        id_document_type: user.id_document ? "BI" : null,
      })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      id_document: user.id_document,
      profession: user.profession,
      income: user.income,
      status: user.status ?? "pendente",
    },
  });

  if (error) throw error;

  await supabase
    .from("profiles")
    .update({
      role: user.role,
      full_name: user.full_name,
      phone: user.phone ?? null,
      address: user.address ?? null,
      id_document: user.id_document ?? null,
      profession: user.profession ?? null,
      income: user.income ?? 0,
      status: user.status ?? "pendente",
      verification_status:
        user.role !== "cliente"
          ? "verificado"
          : user.status === "activo"
            ? "verificado"
            : "nao_verificado",
      id_document_type: user.id_document ? "BI" : null,
    })
    .eq("id", data.user.id);

  return data.user.id;
}

async function main() {
  console.log("A criar utilizadores demo...");
  const ids: Record<string, string> = {};
  for (const user of users) {
    const id = await ensureUser(user);
    ids[user.email] = id;
    console.log(`  ✓ ${user.email}`);
  }

  const { data: products } = await supabase.from("credit_products").select("*");
  if (!products?.length) {
    throw new Error("Execute primeiro a migration 001_schema.sql (produtos em falta).");
  }

  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const maria = ids["maria.fernandes@email.com"];
  const joao = ids["joao.baptista@email.com"];
  const ana = ids["ana.costa@email.com"];
  const pedro = ids["pedro.silva@email.com"];
  const carla = ids["admin@kukula.co.mz"];
  const rui = ids["analista@kukula.co.mz"];

  // Clean operational demo data for re-seed safety (keeps users/products)
  await supabase.from("payments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("installments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("disbursements").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("loans").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("loan_applications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("documents").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("A inserir documentos...");
  await supabase.from("documents").insert([
    { client_id: maria, name: "Bilhete de Identidade", doc_type: "Identificação", status: "aprovado" },
    { client_id: maria, name: "Comprovativo de Morada", doc_type: "Morada", status: "aprovado" },
    { client_id: maria, name: "Extrato de Vendas", doc_type: "Financeiro", status: "em_analise" },
    {
      client_id: maria,
      name: "Licença Comercial",
      doc_type: "Profissional",
      status: "corrigir",
      notes: "Documento ilegível. Envie uma cópia mais nítida.",
    },
    { client_id: joao, name: "Bilhete de Identidade", doc_type: "Identificação", status: "em_analise" },
    { client_id: joao, name: "Comprovativo Agrícola", doc_type: "Profissional", status: "pendente" },
  ]);

  console.log("A inserir pedidos...");
  const apps = [
    {
      reference: "KUK-2026-0142",
      client_id: maria,
      product_id: bySlug.negocio.id,
      amount: 850000,
      term: 12,
      purpose: "Reforço de stock da loja",
      status: "em_analise",
      monthly_payment: 82145,
      total_payable: 985740,
    },
    {
      reference: "KUK-2026-0098",
      client_id: maria,
      product_id: bySlug.pessoal.id,
      amount: 200000,
      term: 6,
      purpose: "Despesas familiares",
      status: "activo",
      analyst_id: carla,
      monthly_payment: 36800,
      total_payable: 220800,
    },
    {
      reference: "KUK-2026-0155",
      client_id: joao,
      product_id: bySlug.agricola.id,
      amount: 1200000,
      term: 18,
      purpose: "Compra de insumos",
      status: "info_adicional",
      analyst_id: rui,
      decision_note: "Falta plano de utilização do crédito.",
      monthly_payment: 78400,
      total_payable: 1411200,
    },
    {
      reference: "KUK-2026-0160",
      client_id: ana,
      product_id: bySlug.negocio.id,
      amount: 450000,
      term: 9,
      purpose: "Aquisição de máquinas de costura",
      status: "desembolso_pendente",
      analyst_id: carla,
      monthly_payment: 55200,
      total_payable: 496800,
    },
    {
      reference: "KUK-2026-0130",
      client_id: pedro,
      product_id: bySlug.pessoal.id,
      amount: 150000,
      term: 4,
      purpose: "Reparação de veículo",
      status: "desembolso_pendente",
      analyst_id: rui,
      monthly_payment: 41250,
      total_payable: 165000,
    },
  ];

  const { data: insertedApps, error: appsError } = await supabase
    .from("loan_applications")
    .insert(apps)
    .select("*");

  if (appsError) throw appsError;

  const appByRef = Object.fromEntries((insertedApps ?? []).map((a) => [a.reference, a]));

  await supabase.from("disbursements").insert([
    {
      application_id: appByRef["KUK-2026-0160"].id,
      amount: 450000,
      method: "transferencia",
      status: "pendente",
    },
    {
      application_id: appByRef["KUK-2026-0130"].id,
      amount: 150000,
      method: "transferencia",
      status: "pendente",
    },
  ]);

  console.log("A inserir empréstimos...");
  const { data: loanMaria, error: loanErr } = await supabase
    .from("loans")
    .insert({
      application_id: appByRef["KUK-2026-0098"].id,
      reference: "KUK-2026-0098",
      client_id: maria,
      principal: 200000,
      total_payable: 220800,
      paid_amount: 147200,
      balance: 73600,
      term: 6,
      interest_rate: 2.8,
      status: "activo",
      disbursed_at: "2026-03-18T09:00:00Z",
      next_due_date: "2026-08-18",
      next_installment_amount: 36800,
    })
    .select("*")
    .single();

  if (loanErr) throw loanErr;

  const { data: loanAna } = await supabase
    .from("loans")
    .insert({
      reference: "KUK-2025-0881",
      client_id: ana,
      principal: 300000,
      total_payable: 345000,
      paid_amount: 230000,
      balance: 115000,
      term: 10,
      interest_rate: 2.5,
      status: "em_atraso",
      disbursed_at: "2025-11-02T09:00:00Z",
      next_due_date: "2026-07-28",
      next_installment_amount: 34500,
    })
    .select("*")
    .single();

  await supabase.from("loans").insert({
    reference: "KUK-2025-0702",
    client_id: pedro,
    principal: 180000,
    total_payable: 198000,
    paid_amount: 198000,
    balance: 0,
    term: 6,
    interest_rate: 2.8,
    status: "liquidado",
    disbursed_at: "2025-08-12T09:00:00Z",
    next_due_date: null,
    next_installment_amount: 0,
  });

  const installments = [
    { number: 1, due_date: "2026-04-18", status: "pago", paid_amount: 36800, paid_at: "2026-04-17T10:00:00Z" },
    { number: 2, due_date: "2026-05-18", status: "pago", paid_amount: 36800, paid_at: "2026-05-16T10:00:00Z" },
    { number: 3, due_date: "2026-06-18", status: "pago", paid_amount: 36800, paid_at: "2026-06-18T10:00:00Z" },
    { number: 4, due_date: "2026-07-18", status: "pago", paid_amount: 36800, paid_at: "2026-07-15T10:00:00Z" },
    { number: 5, due_date: "2026-08-18", status: "pendente", paid_amount: 0 },
    { number: 6, due_date: "2026-09-18", status: "pendente", paid_amount: 0 },
  ].map((i) => ({
    loan_id: loanMaria.id,
    amount: 36800,
    ...i,
  }));

  await supabase.from("installments").insert(installments);

  await supabase.from("payments").insert([
    {
      loan_id: loanMaria.id,
      amount: 36800,
      method: "Transferência bancária",
      status: "confirmado",
      paid_at: "2026-07-15T14:32:00Z",
      confirmed_by: carla,
    },
    {
      loan_id: loanMaria.id,
      amount: 36800,
      method: "Carteira móvel",
      status: "confirmado",
      paid_at: "2026-06-18T11:00:00Z",
      confirmed_by: carla,
    },
    {
      loan_id: loanAna!.id,
      amount: 34500,
      method: "Carteira móvel",
      status: "pendente",
      paid_at: "2026-08-10T09:00:00Z",
    },
  ]);

  await supabase.from("notifications").insert([
    {
      user_id: maria,
      type: "analise",
      title: "Pedido em análise",
      message: "O pedido KUK-2026-0142 está a ser analisado pela equipa de crédito.",
      read: false,
    },
    {
      user_id: maria,
      type: "lembrete",
      title: "Lembrete de prestação",
      message: "A prestação de 36.800 MT vence a 18/08/2026.",
      read: false,
    },
    {
      user_id: maria,
      type: "pagamento",
      title: "Pagamento confirmado",
      message: "Recebemos o pagamento de 36.800 MT referente ao empréstimo KUK-2026-0098.",
      read: true,
    },
    {
      user_id: maria,
      type: "pedido",
      title: "Pedido recebido",
      message: "O seu pedido KUK-2026-0142 foi registado com sucesso.",
      read: true,
    },
  ]);

  await supabase.from("audit_logs").insert([
    {
      action: "Aprovação de crédito",
      actor_id: carla,
      actor_name: "Carla Mendes",
      target: "KUK-2026-0160",
      detail: "Pedido aprovado no valor de 450.000 MT",
    },
    {
      action: "Pedido de informação adicional",
      actor_id: rui,
      actor_name: "Rui Almeida",
      target: "KUK-2026-0155",
      detail: "Solicitado plano de utilização do crédito",
    },
    {
      action: "Confirmação de desembolso",
      actor_id: null,
      actor_name: "Sistema",
      target: "KUK-2026-0098",
      detail: "Desembolso confirmado. Empréstimo activado.",
    },
  ]);

  console.log("\nSeed concluído.");
  console.log("Contas demo:");
  console.log("  admin@kukula.co.mz / demo1234");
  console.log("  analista@kukula.co.mz / demo1234");
  console.log("  maria.fernandes@email.com / demo1234");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
