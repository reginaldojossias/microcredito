import type {
  AuditEntry,
  Client,
  CreditProduct,
  DocumentItem,
  Installment,
  Loan,
  LoanApplication,
  NotificationItem,
  Payment,
} from "@/lib/types";
import type {
  AuditLogRow,
  CreditProductRow,
  DocumentRow,
  InstallmentRow,
  LoanApplicationRow,
  LoanRow,
  NotificationRow,
  PaymentRow,
  Profile,
} from "@/lib/database.types";

export function mapProfile(row: Profile): Client {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    address: row.address ?? "",
    idDocument: row.id_document ?? "",
    idDocumentType: row.id_document_type ?? "",
    dateOfBirth: row.date_of_birth
      ? String(row.date_of_birth).slice(0, 10)
      : "",
    province: row.province ?? "",
    district: row.district ?? "",
    neighborhood: row.neighborhood ?? "",
    profession: row.profession ?? "",
    income: Number(row.income ?? 0),
    createdAt: row.created_at ? String(row.created_at).slice(0, 10) : "",
    status: row.status,
    verificationStatus:
      row.verification_status === "em_analise" ||
      row.verification_status === "verificado" ||
      row.verification_status === "rejeitado"
        ? row.verification_status
        : "nao_verificado",
  };
}

export function mapProduct(row: CreditProductRow): CreditProduct {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    minAmount: Number(row.min_amount),
    maxAmount: Number(row.max_amount),
    minTerm: row.min_term,
    maxTerm: row.max_term,
    interestRate: Number(row.interest_rate),
    requirements: row.requirements ?? [],
  };
}

export function mapDocument(row: DocumentRow): DocumentItem {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    type: row.doc_type,
    status: row.status,
    uploadedAt: row.uploaded_at.slice(0, 10),
    notes: row.notes ?? undefined,
  };
}

export function mapApplication(
  row: LoanApplicationRow & {
    profiles?: { full_name: string } | null;
    client?: { full_name: string } | null;
    credit_products?: { name: string } | null;
    analyst?: { full_name: string } | null;
  },
): LoanApplication {
  return {
    id: row.id,
    reference: row.reference,
    clientId: row.client_id,
    clientName: row.client?.full_name ?? row.profiles?.full_name ?? "Cliente",
    productId: row.product_id,
    productName: row.credit_products?.name ?? "Produto",
    amount: Number(row.amount),
    term: row.term,
    purpose: row.purpose,
    status: row.status,
    createdAt: row.created_at.slice(0, 10),
    updatedAt: row.updated_at.slice(0, 10),
    analyst: row.analyst?.full_name,
    decisionNote: row.decision_note ?? undefined,
    monthlyPayment: Number(row.monthly_payment),
    totalPayable: Number(row.total_payable),
  };
}

export function mapLoan(
  row: LoanRow & {
    profiles?: { full_name: string } | null;
    client?: { full_name: string } | null;
  },
): Loan {
  return {
    id: row.id,
    applicationId: row.application_id ?? "",
    reference: row.reference,
    clientId: row.client_id,
    clientName: row.client?.full_name ?? row.profiles?.full_name ?? "Cliente",
    principal: Number(row.principal),
    totalPayable: Number(row.total_payable),
    paidAmount: Number(row.paid_amount),
    balance: Number(row.balance),
    term: row.term,
    interestRate: Number(row.interest_rate),
    status: row.status,
    disbursedAt: row.disbursed_at?.slice(0, 10) ?? "",
    nextDueDate: row.next_due_date ?? "—",
    nextInstallment: Number(row.next_installment_amount ?? 0),
  };
}

export function mapInstallment(row: InstallmentRow): Installment {
  return {
    id: row.id,
    loanId: row.loan_id,
    number: row.number,
    dueDate: row.due_date,
    amount: Number(row.amount),
    paidAmount: Number(row.paid_amount),
    status: row.status,
    paidAt: row.paid_at?.slice(0, 10),
  };
}

export function mapPayment(
  row: PaymentRow & {
    loans?: { reference: string; profiles?: { full_name: string } | null } | null;
  },
): Payment {
  return {
    id: row.id,
    loanId: row.loan_id,
    loanReference: row.loans?.reference ?? "",
    clientName: row.loans?.profiles?.full_name ?? "",
    amount: Number(row.amount),
    method: row.method,
    status: row.status,
    paidAt: row.paid_at.slice(0, 10),
  };
}

export function mapNotification(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    createdAt: row.created_at,
    read: row.read,
  };
}

export function mapAudit(row: AuditLogRow): AuditEntry {
  return {
    id: row.id,
    action: row.action,
    actor: row.actor_name,
    target: row.target,
    createdAt: row.created_at,
    detail: row.detail ?? "",
  };
}
