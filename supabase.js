import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://YOUR-PROJECT.supabase.co',
  'YOUR-PUBLIC-ANON-KEY'
);
