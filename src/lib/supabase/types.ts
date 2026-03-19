export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlanTier = "free" | "pro" | "agency";
export type InvoiceType = "domestic" | "export";
export type TemplateType = "nda" | "sow" | "retainer";
export type DocType = "efira" | "invoice_attachment" | "contract";
export type ReminderType = "gstr1" | "itr" | "lut_renewal" | "efira";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          gstin: string | null;
          profession: string | null;
          lut_filed: boolean;
          turnover_bracket: string | null;
          plan_tier: PlanTier;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          gstin?: string | null;
          profession?: string | null;
          lut_filed?: boolean;
          turnover_bracket?: string | null;
          plan_tier?: PlanTier;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          gstin?: string | null;
          profession?: string | null;
          lut_filed?: boolean;
          turnover_bracket?: string | null;
          plan_tier?: PlanTier;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          type: InvoiceType;
          client_name: string;
          client_gstin: string | null;
          items: Json;
          total: number;
          gst_amount: number;
          lut_num: string | null;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: InvoiceType;
          client_name: string;
          client_gstin?: string | null;
          items: Json;
          total: number;
          gst_amount: number;
          lut_num?: string | null;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: InvoiceType;
          client_name?: string;
          client_gstin?: string | null;
          items?: Json;
          total?: number;
          gst_amount?: number;
          lut_num?: string | null;
          pdf_url?: string | null;
          created_at?: string;
        };
      };
      contracts: {
        Row: {
          id: string;
          user_id: string;
          template_type: TemplateType;
          fields_json: Json;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_type: TemplateType;
          fields_json: Json;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_type?: TemplateType;
          fields_json?: Json;
          pdf_url?: string | null;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          invoice_id: string | null;
          file_url: string;
          doc_type: DocType;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          invoice_id?: string | null;
          file_url: string;
          doc_type: DocType;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          invoice_id?: string | null;
          file_url?: string;
          doc_type?: DocType;
          created_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          type: ReminderType;
          due_date: string;
          sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: ReminderType;
          due_date: string;
          sent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: ReminderType;
          due_date?: string;
          sent?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
