"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/queries";
import { simulateLoan, isProfileVerified } from "@/lib/utils";
import type { Database } from "@/lib/database.types";
import type { IdDocumentType } from "@/lib/types";
import { ID_DOCUMENT_TYPES } from "@/lib/types";

type ApplicationStatus = Database["public"]["Tables"]["loan_applications"]["Row"]["status"];
type DocumentStatus = Database["public"]["Tables"]["documents"]["Row"]["status"];

async function writeAudit(
  action: string,
  target: string,
  detail: string,
  actorId: string,
  actorName: string,
) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    action,
    target,
    detail,
    actor_id: actorId,
    actor_name: actorName,
  });
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const isStaff =
    profile?.role === "admin" ||
    profile?.role === "analista" ||
    profile?.role === "gestor";

  if (next) redirect(next);
  redirect(isStaff ? "/admin" : "/cliente");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const address = String(formData.get("address") ?? "");
  const idDocument = String(formData.get("id_document") ?? "");
  const profession = String(formData.get("profession") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        address,
        id_document: idDocument,
        profession,
        role: "cliente",
        status: "pendente",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/cliente");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createLoanApplicationAction(formData: FormData) {
  const { supabase, profile } = await requireProfile();

  if (!isProfileVerified(profile)) {
    return {
      error:
        "O seu perfil ainda não está verificado. Complete a verificação de identidade antes de solicitar um empréstimo.",
      code: "profile_not_verified" as const,
    };
  }

  const productId = String(formData.get("product_id") ?? "");
  const amount = Number(formData.get("amount"));
  const term = Number(formData.get("term"));
  const purpose = String(formData.get("purpose") ?? "");

  const { data: product, error: productError } = await supabase
    .from("credit_products")
    .select("*")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Produto inválido" };
  }

  const sim = simulateLoan(amount, term, Number(product.interest_rate));

  const { data: referenceData } = await supabase.rpc("next_loan_reference");
  const reference = referenceData ?? `KUK-${Date.now()}`;

  const { data: app, error } = await supabase
    .from("loan_applications")
    .insert({
      reference,
      client_id: profile.id,
      product_id: productId,
      amount,
      term,
      purpose,
      status: "em_analise",
      monthly_payment: sim.monthlyPayment,
      total_payable: sim.totalPayable,
    })
    .select("id, reference")
    .single();

  if (error) return { error: error.message };

  await supabase.from("notifications").insert({
    user_id: profile.id,
    type: "pedido",
    title: "Pedido recebido",
    message: `O seu pedido ${reference} foi registado com sucesso.`,
  });

  await writeAudit(
    "Novo pedido de crédito",
    reference,
    `Montante ${amount} · ${term} meses`,
    profile.id,
    profile.full_name,
  );

  revalidatePath("/cliente");
  revalidatePath("/cliente/pedidos");
  revalidatePath("/admin/pedidos");

  return { success: true, reference: app.reference, id: app.id };
}

export async function decideApplicationAction(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "") as ApplicationStatus;
  const note = String(formData.get("note") ?? "");

  if (!["aprovado", "rejeitado", "info_adicional"].includes(decision)) {
    return { error: "Decisão inválida" };
  }

  const nextStatus: ApplicationStatus =
    decision === "aprovado" ? "desembolso_pendente" : decision;

  const { data: app, error } = await supabase
    .from("loan_applications")
    .update({
      status: nextStatus,
      decision_note: note || null,
      analyst_id: profile.id,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { error: error.message };

  if (decision === "aprovado") {
    await supabase.from("disbursements").insert({
      application_id: app.id,
      amount: app.amount,
      method: "transferencia",
      status: "pendente",
    });
  }

  const notifType =
    decision === "aprovado"
      ? "aprovacao"
      : decision === "rejeitado"
        ? "rejeicao"
        : "analise";

  await supabase.from("notifications").insert({
    user_id: app.client_id,
    type: notifType,
    title:
      decision === "aprovado"
        ? "Pedido aprovado"
        : decision === "rejeitado"
          ? "Pedido rejeitado"
          : "Informação adicional necessária",
    message:
      note ||
      `O pedido ${app.reference} foi actualizado para ${nextStatus.replaceAll("_", " ")}.`,
  });

  await writeAudit(
    `Decisão: ${decision}`,
    app.reference,
    note || `Estado ${nextStatus}`,
    profile.id,
    profile.full_name,
  );

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/desembolsos");
  revalidatePath("/cliente");
  revalidatePath("/cliente/pedidos");

  return { success: true };
}

export async function updateDocumentStatusAction(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as DocumentStatus;
  const notes =
    status === "corrigir"
      ? "Documento ilegível. Solicitar nova cópia."
      : null;

  const { data, error } = await supabase
    .from("documents")
    .update({
      status,
      notes,
      reviewed_by: profile.id,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { error: error.message };

  const isIdentityDoc =
    data.doc_type === "Identificação" ||
    ID_DOCUMENT_TYPES.some((t) => t.value === data.doc_type);

  if (isIdentityDoc) {
    if (status === "aprovado") {
      await supabase
        .from("profiles")
        .update({
          verification_status: "verificado",
          status: "activo",
        })
        .eq("id", data.client_id);

      await supabase.from("notifications").insert({
        user_id: data.client_id,
        type: "aprovacao",
        title: "Perfil verificado",
        message:
          "A sua identidade foi aprovada. Já pode solicitar um empréstimo.",
      });
    } else if (status === "corrigir") {
      await supabase
        .from("profiles")
        .update({ verification_status: "rejeitado" })
        .eq("id", data.client_id);

      await supabase.from("notifications").insert({
        user_id: data.client_id,
        type: "analise",
        title: "Verificação incompleta",
        message:
          "O documento de identidade precisa de correção. Volte a enviar a verificação.",
      });
    }
  }

  await writeAudit(
    `Documento ${status}`,
    data.name,
    `Cliente ${data.client_id}`,
    profile.id,
    profile.full_name,
  );

  revalidatePath("/admin/documentos");
  revalidatePath("/cliente/documentos");
  revalidatePath("/cliente/perfil");
  revalidatePath("/cliente/verificacao");
  revalidatePath("/cliente");
  return { success: true };
}

const VERIFICATION_MIGRATION_HINT =
  "A base de dados ainda não tem os campos de verificação. No Supabase → SQL Editor, execute o ficheiro supabase/migrations/002_profile_verification.sql e tente novamente.";

function isMissingSchemaError(message: string) {
  return /column|schema cache|does not exist|verification_status|date_of_birth|id_document_type/i.test(
    message,
  );
}

export async function submitVerificationAction(formData: FormData) {
  try {
    const { supabase, profile } = await requireProfile();

    // Projectos que só correram o 001 antigo não têm estas colunas
    if (!("verification_status" in profile)) {
      return { error: VERIFICATION_MIGRATION_HINT };
    }

    if (profile.verification_status === "verificado") {
      return { error: "O seu perfil já está verificado." };
    }

    if (profile.verification_status === "em_analise") {
      return {
        error: "A sua verificação já está em análise. Aguarde a decisão.",
      };
    }

    const fullName = String(formData.get("full_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const dateOfBirth = String(formData.get("date_of_birth") ?? "").trim();
    const profession = String(formData.get("profession") ?? "").trim();
    const income = Number(formData.get("income") ?? 0);
    const province = String(formData.get("province") ?? "").trim();
    const district = String(formData.get("district") ?? "").trim();
    const neighborhood = String(formData.get("neighborhood") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const idDocumentType = String(
      formData.get("id_document_type") ?? "",
    ).trim() as IdDocumentType;
    const idDocument = String(formData.get("id_document") ?? "").trim();
    const rawFile = formData.get("identity_file");

    const allowedTypes = ID_DOCUMENT_TYPES.map((t) => t.value);
    if (!allowedTypes.includes(idDocumentType)) {
      return { error: "Seleccione um tipo de documento válido." };
    }

    if (
      !fullName ||
      !phone ||
      !dateOfBirth ||
      !profession ||
      !province ||
      !district ||
      !neighborhood ||
      !address ||
      !idDocument
    ) {
      return { error: "Preencha todos os campos obrigatórios." };
    }

    const file =
      rawFile instanceof File
        ? rawFile
        : rawFile &&
            typeof rawFile === "object" &&
            "arrayBuffer" in rawFile &&
            "size" in rawFile &&
            typeof (rawFile as Blob).size === "number"
          ? (rawFile as Blob & { name?: string; type?: string })
          : null;

    if (!file || file.size === 0) {
      return { error: "Envie uma cópia do documento de identidade." };
    }

    const maxBytes = 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      return { error: "O ficheiro não pode exceder 8 MB." };
    }

    const originalName =
      ("name" in file && file.name?.trim()) || "documento-identidade";
    const ext = originalName.includes(".")
      ? originalName.split(".").pop()?.toLowerCase() || "bin"
      : "bin";
    const storagePath = `${profile.id}/${Date.now()}-${idDocumentType}.${ext}`;

    let fileUrl: string | null = null;
    try {
      const { error: uploadError } = await supabase.storage
        .from("client-documents")
        .upload(storagePath, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        const missingBucket =
          /bucket not found|not found|does not exist/i.test(uploadError.message);
        if (missingBucket) {
          // Continua sem Storage: o pedido de verificação não fica bloqueado
          fileUrl = `pending-upload:${originalName}`;
        } else {
          return { error: `Falha no envio do ficheiro: ${uploadError.message}` };
        }
      } else {
        fileUrl = storagePath;
      }
    } catch (uploadException) {
      const message =
        uploadException instanceof Error
          ? uploadException.message
          : "erro desconhecido no upload";
      return { error: `Falha no envio do ficheiro: ${message}` };
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        date_of_birth: dateOfBirth || null,
        profession,
        income: Number.isFinite(income) ? income : 0,
        province,
        district,
        neighborhood,
        address,
        id_document_type: idDocumentType,
        id_document: idDocument,
        verification_status: "em_analise",
      })
      .eq("id", profile.id);

    if (profileError) {
      return {
        error: isMissingSchemaError(profileError.message)
          ? VERIFICATION_MIGRATION_HINT
          : profileError.message,
      };
    }

    const docLabel =
      ID_DOCUMENT_TYPES.find((t) => t.value === idDocumentType)?.labelPt ??
      idDocumentType;

    const { error: docError } = await supabase.from("documents").insert({
      client_id: profile.id,
      name: `${docLabel} - ${idDocument}`,
      doc_type: idDocumentType,
      status: "em_analise",
      file_url: fileUrl,
      notes:
        fileUrl?.startsWith("pending-upload:")
          ? `Ficheiro recebido (${originalName}), Storage ainda não configurado.`
          : null,
    });

    if (docError) return { error: docError.message };

    await supabase.from("notifications").insert({
      user_id: profile.id,
      type: "analise",
      title: "Verificação enviada",
      message:
        "Os seus dados e documento de identidade foram enviados para análise.",
    });

    await writeAudit(
      "Pedido de verificação de perfil",
      profile.email,
      `${docLabel} ${idDocument}`,
      profile.id,
      fullName,
    );

    revalidatePath("/cliente");
    revalidatePath("/cliente/perfil");
    revalidatePath("/cliente/verificacao");
    revalidatePath("/cliente/documentos");
    revalidatePath("/admin/documentos");
    revalidatePath("/admin/clientes");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado na verificação.";
    return {
      error: isMissingSchemaError(message) ? VERIFICATION_MIGRATION_HINT : message,
    };
  }
}

export async function createDocumentAction(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  const name = String(formData.get("name") ?? "");
  const docType = String(formData.get("doc_type") ?? "Geral");

  const { error } = await supabase.from("documents").insert({
    client_id: profile.id,
    name,
    doc_type: docType,
    status: "em_analise",
  });

  if (error) return { error: error.message };

  revalidatePath("/cliente/documentos");
  revalidatePath("/admin/documentos");
  return { success: true };
}

export async function confirmDisbursementAction(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  const disbursementId = String(formData.get("id") ?? "");

  const { data: disbursement, error: dError } = await supabase
    .from("disbursements")
    .select("*, loan_applications(*)")
    .eq("id", disbursementId)
    .single();

  if (dError || !disbursement?.loan_applications) {
    return { error: dError?.message ?? "Desembolso não encontrado" };
  }

  const app = disbursement.loan_applications;
  const { data: product } = await supabase
    .from("credit_products")
    .select("interest_rate")
    .eq("id", app.product_id)
    .single();

  const interestRate = Number(product?.interest_rate ?? 2.5);
  const monthly = Number(app.monthly_payment);
  const total = Number(app.total_payable);

  const { data: loan, error: loanError } = await supabase
    .from("loans")
    .insert({
      application_id: app.id,
      reference: app.reference,
      client_id: app.client_id,
      principal: Number(app.amount),
      total_payable: total,
      paid_amount: 0,
      balance: total,
      term: app.term,
      interest_rate: interestRate,
      status: "activo",
      disbursed_at: new Date().toISOString(),
      next_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      next_installment_amount: monthly,
    })
    .select("*")
    .single();

  if (loanError) return { error: loanError.message };

  const installments = Array.from({ length: app.term }, (_, i) => {
    const due = new Date();
    due.setMonth(due.getMonth() + i + 1);
    return {
      loan_id: loan.id,
      number: i + 1,
      due_date: due.toISOString().slice(0, 10),
      amount: monthly,
      paid_amount: 0,
      status: "pendente" as const,
    };
  });

  await supabase.from("installments").insert(installments);

  await supabase
    .from("disbursements")
    .update({
      status: "confirmado",
      confirmed_at: new Date().toISOString(),
      confirmed_by: profile.id,
      loan_id: loan.id,
    })
    .eq("id", disbursementId);

  await supabase
    .from("loan_applications")
    .update({ status: "activo" })
    .eq("id", app.id);

  await supabase.from("notifications").insert({
    user_id: app.client_id,
    type: "desembolso",
    title: "Desembolso confirmado",
    message: `O valor do pedido ${app.reference} foi desembolsado. O empréstimo está activo.`,
  });

  await writeAudit(
    "Confirmação de desembolso",
    app.reference,
    `Empréstimo activado · ${app.amount}`,
    profile.id,
    profile.full_name,
  );

  revalidatePath("/admin/desembolsos");
  revalidatePath("/admin/emprestimos");
  revalidatePath("/cliente");
  revalidatePath("/cliente/emprestimos");

  return { success: true };
}

export async function registerPaymentAction(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  const loanId = String(formData.get("loan_id") ?? "");
  const amount = Number(formData.get("amount"));
  const method = String(formData.get("method") ?? "Carteira móvel");

  const { data: loan, error: loanError } = await supabase
    .from("loans")
    .select("*")
    .eq("id", loanId)
    .single();

  if (loanError || !loan) return { error: "Empréstimo não encontrado" };

  const { data: nextInstallment } = await supabase
    .from("installments")
    .select("*")
    .eq("loan_id", loanId)
    .in("status", ["pendente", "atrasado", "parcial"])
    .order("number")
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("payments").insert({
    loan_id: loanId,
    installment_id: nextInstallment?.id ?? null,
    amount,
    method,
    status: "confirmado",
    confirmed_by: profile.id,
  });

  if (error) return { error: error.message };

  if (nextInstallment) {
    const paidAmount = Number(nextInstallment.paid_amount) + amount;
    const fullyPaid = paidAmount >= Number(nextInstallment.amount);
    await supabase
      .from("installments")
      .update({
        paid_amount: Math.min(paidAmount, Number(nextInstallment.amount)),
        status: fullyPaid ? "pago" : "parcial",
        paid_at: fullyPaid ? new Date().toISOString() : null,
      })
      .eq("id", nextInstallment.id);
  }

  const newPaid = Number(loan.paid_amount) + amount;
  const newBalance = Math.max(Number(loan.balance) - amount, 0);

  const { data: upcoming } = await supabase
    .from("installments")
    .select("*")
    .eq("loan_id", loanId)
    .in("status", ["pendente", "atrasado", "parcial"])
    .order("number")
    .limit(1)
    .maybeSingle();

  await supabase
    .from("loans")
    .update({
      paid_amount: newPaid,
      balance: newBalance,
      status: newBalance === 0 ? "liquidado" : loan.status,
      next_due_date: upcoming?.due_date ?? null,
      next_installment_amount: upcoming ? Number(upcoming.amount) - Number(upcoming.paid_amount) : 0,
    })
    .eq("id", loanId);

  await supabase.from("notifications").insert({
    user_id: loan.client_id,
    type: newBalance === 0 ? "liquidacao" : "pagamento",
    title: newBalance === 0 ? "Empréstimo liquidado" : "Pagamento confirmado",
    message:
      newBalance === 0
        ? `O empréstimo ${loan.reference} foi liquidado.`
        : `Recebemos o pagamento de ${amount} referente a ${loan.reference}.`,
  });

  await writeAudit(
    "Pagamento registado",
    loan.reference,
    `${method} · ${amount}`,
    profile.id,
    profile.full_name,
  );

  revalidatePath("/cliente/pagamentos");
  revalidatePath("/cliente/emprestimos");
  revalidatePath("/admin/pagamentos");
  revalidatePath("/admin/emprestimos");

  return { success: true };
}

export async function sendCollectionReminderAction(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  const loanId = String(formData.get("loan_id") ?? "");

  const { data: loan } = await supabase.from("loans").select("*").eq("id", loanId).single();
  if (!loan) return { error: "Empréstimo não encontrado" };

  await supabase.from("notifications").insert({
    user_id: loan.client_id,
    type: "atraso",
    title: "Aviso de atraso",
    message: `Existe saldo em atraso no empréstimo ${loan.reference}. Regularize a prestação em aberto.`,
  });

  await writeAudit(
    "Lembrete de cobrança",
    loan.reference,
    "Aviso de atraso enviado",
    profile.id,
    profile.full_name,
  );

  revalidatePath("/admin/cobrancas");
  return { success: true };
}
