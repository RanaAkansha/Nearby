-- Create storage bucket for post images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict do nothing;

-- Set up public read access for the bucket
create policy "Public read access" on storage.objects
  for select using (bucket_id = 'post-images');

-- Allow authenticated users to upload
create policy "Authenticated upload" on storage.objects
  for insert with check (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Allow deletion by owner
create policy "Delete own uploads" on storage.objects
  for delete using (bucket_id = 'post-images' AND auth.uid() = owner);
