import { supabase } from '../supabase';

/**
 * Obtiene todas las zonas de un usuario.
 * @param {string} userId
 * @returns {Promise<{ data: Array, error: any }>}
 */
export const getZonesByUser = async (userId) => {
  const { data, error } = await supabase
    .from('Zonas')
    .select('*')
    .eq('usuario_id', userId);

  return { data, error };
};