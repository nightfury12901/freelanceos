-- Migration 002: Row Level Security Policies
-- Run AFTER 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- ─── Users ─────────────────────────────────────────────────────────────────
-- Users can only see and update their own row
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ─── Invoices ──────────────────────────────────────────────────────────────
CREATE POLICY "invoices_all_own" ON public.invoices
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Contracts ─────────────────────────────────────────────────────────────
CREATE POLICY "contracts_all_own" ON public.contracts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Documents ─────────────────────────────────────────────────────────────
CREATE POLICY "documents_all_own" ON public.documents
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Reminders ─────────────────────────────────────────────────────────────
CREATE POLICY "reminders_all_own" ON public.reminders
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
