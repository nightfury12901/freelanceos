-- Migration 001: Initial Schema
-- Run this in Supabase Studio SQL Editor or via CLI

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  gstin TEXT,
  profession TEXT,
  lut_filed BOOLEAN DEFAULT FALSE,
  turnover_bracket TEXT,
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'agency')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('domestic', 'export')),
  client_name TEXT NOT NULL,
  client_gstin TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  gst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  lut_num TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('nda', 'sow', 'retainer')),
  fields_json JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table (e-FIRA uploads, attachments)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('efira', 'invoice_attachment', 'contract')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gstr1', 'itr', 'lut_renewal', 'efira')),
  due_date DATE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_invoice_id ON public.documents(invoice_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON public.reminders(due_date);
