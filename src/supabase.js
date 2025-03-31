import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czfuwfgybzjurkbpxvyp.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZnV3Zmd5YnpqdXJrYnB4dnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjEyNDYsImV4cCI6MjA1ODM5NzI0Nn0.Si5esMeMLFeEGUbVtPOp0PY2HbKPLo1lgcWY9AbBe74';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
