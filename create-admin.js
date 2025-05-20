// create-admin.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL         = 'https://czfuwfgybzjurkbpxvyp.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZnV3Zmd5YnpqdXJrYnB4dnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyMTI0NiwiZXhwIjoyMDU4Mzk3MjQ2fQ.bqvusO7nywbSlAUDOxSpquVtuDXgPo7XxYWz66uPlKM';

const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function main() {
  // 1) Crear el usuario en Auth
  const { user, error: errAuth } = await supabaseAdmin.auth.admin.createUser({
    email:         'admin@airmagic.com',
    password:      'Secret123!',
    email_confirm: true,
  });
  if (errAuth) {
    console.error('Error creando Auth-user:', errAuth);
    process.exit(1);
  }
  console.log('✅ Auth user creado con UID:', user.id);

  // 2) Crear el perfil en la tabla Usuarios
  const { data, error: errProfile } = await supabaseAdmin
    .from('Usuarios')
    .insert([{
      id:        user.id,
      email:     'admin@airmagic.com',
      es_admin:  true,
      compañia:  'AirMagic',
      foto_url:  '',
    }]);
  if (errProfile) {
    console.error('Error insertando perfil:', errProfile);
    process.exit(1);
  }
  console.log('✅ Perfil admin creado en Usuarios:', data);
}

main();
