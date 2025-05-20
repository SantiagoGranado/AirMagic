// src/hooks/useZones.jsx
import { useState, useEffect } from 'react';
import { getZonesByUser } from '../services/zoneService.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Hook para obtener las zonas del usuario actual.
 * Proporciona estados de loading y error.
 */
const useZones = () => {
  const { user } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getZonesByUser(user.id)
      .then(({ data, error }) => {
        if (error) {
          setError(error);
          setZones([]);
        } else {
          setZones(data);
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  return { zones, loading, error };
};

export default useZones;
