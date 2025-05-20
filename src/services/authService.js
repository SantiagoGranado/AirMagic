// src/services/authService.js
import { supabase } from '../supabase';

export const register = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = () =>
  supabase.auth.getSession();

export const onAuthStateChange = (callback) =>
  supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

// Obtenemos el campo es_admin de la tabla "Usuarios" (sensible a mayúsculas)
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('es_admin')
    .eq('id', userId)
    .single();
  return { data, error };
};
