export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "cliente" | "admin" | "analista" | "gestor";
          full_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          id_document: string | null;
          profession: string | null;
          income: number;
          status: "activo" | "pendente" | "bloqueado";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "cliente" | "admin" | "analista" | "gestor";
          full_name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          id_document?: string | null;
          profession?: string | null;
          income?: number;
          status?: "activo" | "pendente" | "bloqueado";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "cliente" | "admin" | "analista" | "gestor";
          full_name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          id_document?: string | null;
          profession?: string | null;
          income?: number;
          status?: "activo" | "pendente" | "bloqueado";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      credit_products: {
        Row: {
          id: string;
          slug: string | null;
          name: string;
          description: string;
          min_amount: number;
          max_amount: number;
          min_term: number;
          max_term: number;
          interest_rate: number;
          requirements: string[];
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          name: string;
          description: string;
          min_amount: number;
          max_amount: number;
          min_term: number;
          max_term: number;
          interest_rate: number;
          requirements?: string[];
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string | null;
          name?: string;
          description?: string;
          min_amount?: number;
          max_amount?: number;
          min_term?: number;
          max_term?: number;
          interest_rate?: number;
          requirements?: string[];
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          doc_type: string;
          status: "pendente" | "em_analise" | "aprovado" | "rejeitado" | "corrigir";
          file_url: string | null;
          notes: string | null;
          reviewed_by: string | null;
          uploaded_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          doc_type: string;
          status?: "pendente" | "em_analise" | "aprovado" | "rejeitado" | "corrigir";
          file_url?: string | null;
          notes?: string | null;
          reviewed_by?: string | null;
          uploaded_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          doc_type?: string;
          status?: "pendente" | "em_analise" | "aprovado" | "rejeitado" | "corrigir";
          file_url?: string | null;
          notes?: string | null;
          reviewed_by?: string | null;
          uploaded_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey";
            columns: ["client_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      loan_applications: {
        Row: {
          id: string;
          reference: string;
          client_id: string;
          product_id: string;
          amount: number;
          term: number;
          purpose: string;
          status:
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
          analyst_id: string | null;
          decision_note: string | null;
          monthly_payment: number;
          total_payable: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          client_id: string;
          product_id: string;
          amount: number;
          term: number;
          purpose: string;
          status?: Database["public"]["Tables"]["loan_applications"]["Row"]["status"];
          analyst_id?: string | null;
          decision_note?: string | null;
          monthly_payment?: number;
          total_payable?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference?: string;
          client_id?: string;
          product_id?: string;
          amount?: number;
          term?: number;
          purpose?: string;
          status?: Database["public"]["Tables"]["loan_applications"]["Row"]["status"];
          analyst_id?: string | null;
          decision_note?: string | null;
          monthly_payment?: number;
          total_payable?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loan_applications_client_id_fkey";
            columns: ["client_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loan_applications_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "credit_products";
            referencedColumns: ["id"];
          },
        ];
      };
      loans: {
        Row: {
          id: string;
          application_id: string | null;
          reference: string;
          client_id: string;
          principal: number;
          total_payable: number;
          paid_amount: number;
          balance: number;
          term: number;
          interest_rate: number;
          status: "activo" | "em_atraso" | "liquidado";
          disbursed_at: string | null;
          next_due_date: string | null;
          next_installment_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id?: string | null;
          reference: string;
          client_id: string;
          principal: number;
          total_payable: number;
          paid_amount?: number;
          balance: number;
          term: number;
          interest_rate: number;
          status?: "activo" | "em_atraso" | "liquidado";
          disbursed_at?: string | null;
          next_due_date?: string | null;
          next_installment_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string | null;
          reference?: string;
          client_id?: string;
          principal?: number;
          total_payable?: number;
          paid_amount?: number;
          balance?: number;
          term?: number;
          interest_rate?: number;
          status?: "activo" | "em_atraso" | "liquidado";
          disbursed_at?: string | null;
          next_due_date?: string | null;
          next_installment_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loans_client_id_fkey";
            columns: ["client_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      installments: {
        Row: {
          id: string;
          loan_id: string;
          number: number;
          due_date: string;
          amount: number;
          paid_amount: number;
          status: "pendente" | "pago" | "atrasado" | "parcial";
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          loan_id: string;
          number: number;
          due_date: string;
          amount: number;
          paid_amount?: number;
          status?: "pendente" | "pago" | "atrasado" | "parcial";
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          loan_id?: string;
          number?: number;
          due_date?: string;
          amount?: number;
          paid_amount?: number;
          status?: "pendente" | "pago" | "atrasado" | "parcial";
          paid_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "installments_loan_id_fkey";
            columns: ["loan_id"];
            referencedRelation: "loans";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          loan_id: string;
          installment_id: string | null;
          amount: number;
          method: string;
          status: "confirmado" | "pendente" | "falhado";
          paid_at: string;
          confirmed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          loan_id: string;
          installment_id?: string | null;
          amount: number;
          method: string;
          status?: "confirmado" | "pendente" | "falhado";
          paid_at?: string;
          confirmed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          loan_id?: string;
          installment_id?: string | null;
          amount?: number;
          method?: string;
          status?: "confirmado" | "pendente" | "falhado";
          paid_at?: string;
          confirmed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_loan_id_fkey";
            columns: ["loan_id"];
            referencedRelation: "loans";
            referencedColumns: ["id"];
          },
        ];
      };
      disbursements: {
        Row: {
          id: string;
          application_id: string;
          loan_id: string | null;
          amount: number;
          method: string;
          status: "pendente" | "processando" | "confirmado" | "falhado";
          confirmed_at: string | null;
          confirmed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          loan_id?: string | null;
          amount: number;
          method?: string;
          status?: "pendente" | "processando" | "confirmado" | "falhado";
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          loan_id?: string | null;
          amount?: number;
          method?: string;
          status?: "pendente" | "processando" | "confirmado" | "falhado";
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "disbursements_application_id_fkey";
            columns: ["application_id"];
            referencedRelation: "loan_applications";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type:
            | "pedido"
            | "analise"
            | "aprovacao"
            | "rejeicao"
            | "desembolso"
            | "lembrete"
            | "atraso"
            | "pagamento"
            | "liquidacao";
          title: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: Database["public"]["Tables"]["notifications"]["Row"]["type"];
          title: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: Database["public"]["Tables"]["notifications"]["Row"]["type"];
          title?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          action: string;
          actor_id: string | null;
          actor_name: string;
          target: string;
          detail: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          actor_id?: string | null;
          actor_name: string;
          target: string;
          detail?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: string;
          actor_id?: string | null;
          actor_name?: string;
          target?: string;
          detail?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      collection_settings: {
        Row: {
          id: number;
          grace_days: number;
          daily_penalty_rate: number;
          preferred_channel: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          grace_days?: number;
          daily_penalty_rate?: number;
          preferred_channel?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          grace_days?: number;
          daily_penalty_rate?: number;
          preferred_channel?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      next_loan_reference: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "cliente" | "admin" | "analista" | "gestor";
      profile_status: "activo" | "pendente" | "bloqueado";
      document_status: "pendente" | "em_analise" | "aprovado" | "rejeitado" | "corrigir";
      loan_status: "activo" | "em_atraso" | "liquidado";
      installment_status: "pendente" | "pago" | "atrasado" | "parcial";
      payment_status: "confirmado" | "pendente" | "falhado";
      disbursement_status: "pendente" | "processando" | "confirmado" | "falhado";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CreditProductRow = Database["public"]["Tables"]["credit_products"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type LoanApplicationRow = Database["public"]["Tables"]["loan_applications"]["Row"];
export type LoanRow = Database["public"]["Tables"]["loans"]["Row"];
export type InstallmentRow = Database["public"]["Tables"]["installments"]["Row"];
export type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
export type DisbursementRow = Database["public"]["Tables"]["disbursements"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type AuditLogRow = Database["public"]["Tables"]["audit_logs"]["Row"];
export type CollectionSettingsRow =
  Database["public"]["Tables"]["collection_settings"]["Row"];
