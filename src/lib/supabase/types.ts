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
export type ReminderType   = "gstr1" | "itr" | "lut_renewal" | "efira";
export type ClientStatus   = "active" | "on_hold" | "completed" | "prospect";

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
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          role: string | null;               // e.g. "Product Designer at Acme"
          status: ClientStatus;
          notes: string | null;
          tags: string[] | null;             // e.g. ["startup","retainer"]
          total_billed: number;              // denormalized for speed
          project_title: string | null;
          project_description: string | null;
          project_deadline: string | null;
          progress_percent: number;
          milestones: Json;                  // Array of { id: string, label: string, done: boolean }
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
          status?: ClientStatus;
          notes?: string | null;
          tags?: string[] | null;
          total_billed?: number;
          project_title?: string | null;
          project_description?: string | null;
          project_deadline?: string | null;
          progress_percent?: number;
          milestones?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
          status?: ClientStatus;
          notes?: string | null;
          tags?: string[] | null;
          total_billed?: number;
          project_title?: string | null;
          project_description?: string | null;
          project_deadline?: string | null;
          progress_percent?: number;
          milestones?: Json;
          updated_at?: string;
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
