-- Migration 003: Supabase Storage Setup
-- Run in Supabase Studio SQL Editor

-- Create private storage bucket for compliance documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compliance-docs',
  'compliance-docs',
  FALSE,  -- private bucket
  10485760,  -- 10MB max file size
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Users can upload to their own folder only
CREATE POLICY "storage_upload_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'compliance-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Users can read their own files only
CREATE POLICY "storage_read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'compliance-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Users can delete their own files
CREATE POLICY "storage_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'compliance-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
