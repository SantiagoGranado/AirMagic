// src/hooks/useProfile.jsx
import { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword } from '../services/userService.js';

/**
 * Hook para manejar datos del perfil de usuario.
 */
const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga inicial del perfil
  useEffect(() => {
    setLoading(true);
    getProfile()
      .then(({ user, error }) => {
        if (error) throw error;
        setProfile(user);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Función para actualizar campos básicos (p.ej. email, metadata)
  const saveProfile = async (updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await updateProfile(updates);
      if (error) throw error;
      setProfile(data.user);
      return data.user;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar contraseña
  const savePassword = async (password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await changePassword({ password });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, saveProfile, savePassword };
};

export default useProfile;
