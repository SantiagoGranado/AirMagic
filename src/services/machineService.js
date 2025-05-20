import { supabase } from '../supabase';

/**
 * Obtiene todas las máquinas Eco de un usuario.
 * @param {string} userId
 * @returns {Promise<{ data: any[], error: any }>}
 */
export const getEcoMachines = async (userId) => {
  const { data, error } = await supabase
    .from('MaquinasEco')
    .select('*')
    .eq('usuario_id', userId);

  return { data, error };
};

/**
 * Obtiene todas las máquinas Ext de un usuario.
 * @param {string} userId
 * @returns {Promise<{ data: any[], error: any }>}
 */
export const getExtMachines = async (userId) => {
  const { data, error } = await supabase
    .from('MaquinasExt')
    .select('*')
    .eq('usuario_id', userId);

  return { data, error };
};

/**
 * Actualiza una máquina (eco o ext) dado su id y la tabla.
 * @param {string|number} id
 * @param {'MaquinasEco'|'MaquinasExt'} table
 * @param {object} changes
 * @returns {Promise<{ data: any, error: any }>}
 */
export const updateMachine = async (id, table, changes) => {
  const { data, error } = await supabase
    .from(table)
    .update(changes)
    .eq('id', id);

  return { data, error };
};
