import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kodedicmzwpalitszlos.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZGVkaWNtendwYWxpdHN6bG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMjM3MzksImV4cCI6MjA3NjY5OTczOX0.cth1XDZqdQuiuGY2wsm7bWYoRpOy-pagiVxjp0K8J4g';

// The user has provided their Supabase credentials directly.
// These are now hardcoded to ensure the application connects successfully.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);