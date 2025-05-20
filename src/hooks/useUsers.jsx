import { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../services/userService.js';
import { supabase } from '../supabase.js';

/**
 * Hook para cargar y editar usuarios (panel de admin).
 * Extrae el campo `compañia` (con tilde) y calcula URL pública de avatar.
 */
export default function useUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await getUsers();

    if (error) {
      setError(error);
      setUsers([]);
    } else {
      const mapped = data.map((u) => {
        // Leer siempre la columna con tilde
        const compañia = u['compañia'] ?? '';
        // Calcular URL pública del avatar
        let avatar_public_url = '/img/default.png';
        if (u.foto_url) {
          const path = u.foto_url.startsWith('avatars/')
            ? u.foto_url
            : `avatars/${u.foto_url}`;
          const { data: d } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(path);
          avatar_public_url = d.publicUrl ?? avatar_public_url;
        }
        return {
          ...u,
          compañia,
          avatar_public_url,
        };
      });
      setUsers(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const editUser = async (id, changes) => {
    const { data, error } = await updateUser(id, changes);
    if (error) throw error;
    await fetchUsers();
    return data;
  };

  return { users, loading, error, editUser };
}
