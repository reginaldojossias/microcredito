export type UserRole = "cliente" | "admin" | "analista" | "gestor";

export type DocumentStatus = "pendente" | "em_analise" | "aprovado" | "rejeitado" | "corrigir";

export type VerificationStatus =
  | "nao_verificado"
  | "em_analise"
  | "verificado"
  | "rejeitado";

export type IdDocumentType =
  | "BI"
  | "Passaporte"
  | "carta_conducao"
  | "cartao_eleitor";

export const ID_DOCUMENT_TYPES: { value: IdDocumentType; labelPt: string; labelEn: string }[] = [
  { value: "BI", labelPt: "BI", labelEn: "National ID (BI)" },
  { value: "Passaporte", labelPt: "Passaporte", labelEn: "Passport" },
  {
    value: "carta_conducao",
    labelPt: "Carta de condução",
    labelEn: "Driver's licence",
  },
  {
    value: "cartao_eleitor",
    labelPt: "Cartão de eleitor",
    labelEn: "Voter card",
  },
];

export type LoanApplicationStatus =
  | "rascunho"
  | "enviado"
  | "em_analise"
  | "info_adicional"
  | "aprovado"
  | "rejeitado"
  | "contrato_pendente"
  | "contrato_aceite"
  | "desembolso_pendente"
  | "activo"
  | "liquidado"
  | "em_atraso";

export type InstallmentStatus = "pendente" | "pago" | "atrasado" | "parcial";

export type NotificationType =
  | "pedido"
  | "analise"
  | "aprovacao"
  | "rejeicao"
  | "desembolso"
  | "lembrete"
  | "atraso"
  | "pagamento"
  | "liquidacao";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  idDocument: string;
  idDocumentType: string;
  dateOfBirth: string;
  province: string;
  district: string;
  neighborhood: string;
  profession: string;
  income: number;
  createdAt: string;
  status: "activo" | "pendente" | "bloqueado";
  verificationStatus: VerificationStatus;
}

export interface DocumentItem {
  id: string;
  clientId: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadedAt: string;
  notes?: string;
}

export interface CreditProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRate: number;
  requirements: string[];
}

export interface LoanApplication {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  productId: string;
  productName: string;
  amount: number;
  term: number;
  purpose: string;
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt: string;
  analyst?: string;
  decisionNote?: string;
  monthlyPayment: number;
  totalPayable: number;
}

export interface Loan {
  id: string;
  applicationId: string;
  reference: string;
  clientId: string;
  clientName: string;
  principal: number;
  totalPayable: number;
  paidAmount: number;
  balance: number;
  term: number;
  interestRate: number;
  status: "activo" | "em_atraso" | "liquidado";
  disbursedAt: string;
  nextDueDate: string;
  nextInstallment: number;
}

export interface Installment {
  id: string;
  loanId: string;
  number: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: InstallmentStatus;
  paidAt?: string;
}

export interface Payment {
  id: string;
  loanId: string;
  loanReference: string;
  clientName: string;
  amount: number;
  method: string;
  status: "confirmado" | "pendente" | "falhado";
  paidAt: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  createdAt: string;
  detail: string;
}
