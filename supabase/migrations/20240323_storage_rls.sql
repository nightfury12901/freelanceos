-- Storage configuration for FreelanceOS
-- Run this in your Supabase SQL Editor

-- 1. Create the bucket
insert into storage.buckets (id, name, public) 
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- 2. Allow authenticated users to upload files to their own folder within the 'documents' bucket
create policy "Users can upload their own documents"
on storage.objects for insert
with check (
  bucket_id = 'documents' and 
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow users to update/upsert their existing documents
create policy "Users can update their own documents"
on storage.objects for update
using (
  bucket_id = 'documents' and 
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'documents' and 
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to read (download) their own documents
create policy "Users can read their own documents"
on storage.objects for select
using (
  bucket_id = 'documents' and 
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = auth.uid()::text
);
