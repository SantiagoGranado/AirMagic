// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const url     = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Faltan variables de entorno VITE_SUPABASE_*');
}

export const supabase = createClient(url, anonKey);
