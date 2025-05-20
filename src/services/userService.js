import { supabase } from '../supabase.js';

/**
 * Obtiene la lista de todos los usuarios (para el panel de admin).
 * Trae todas las columnas y deja el orden para el cliente.
 */
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('*');
  return { data, error };
};

/**
 * Actualiza un usuario por su id en la tabla Usuarios.
 */
export const updateUser = async (id, changes) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .update(changes)
    .eq('id', id);
  return { data, error };
};

/**
 * Obtiene el flag es_admin desde la tabla Usuarios para un userId dado.
 */
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('es_admin')
    .eq('id', userId)
    .single();
  return { data, error };
};
