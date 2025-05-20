// src/hooks/useMachines.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getEcoMachines, getExtMachines } from '../services/machineService.js';

/**
 * Hook que, dada la lista de zonas (rawZones), devuelve las zonas
 * enriquecidas con su array de máquinas, más estados de carga y error.
 *
 * @param {{ id: any; nombre: string }[]} rawZones
 * @returns {{
 *   zonesWithMachines: Array<{ id: any; nombre: string; machines: any[] }>,
 *   loading: boolean,
 *   error: any
 * }}
 */
const useMachines = (rawZones) => {
  const { user } = useAuth();
  const [zonesWithMachines, setZonesWithMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esperamos a tener usuario y zonas
    if (!user || !rawZones.length) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    Promise.all([
      getEcoMachines(user.id),
      getExtMachines(user.id),
    ])
      .then(([ecoRes, extRes]) => {
        if (ecoRes.error || extRes.error) {
          throw ecoRes.error || extRes.error;
        }
        const ecoMachines = ecoRes.data || [];
        const extMachines = extRes.data || [];

        const enriched = rawZones.map((zona) => {
          const eco = ecoMachines.filter((m) => m.zona_id === zona.id);
          const ext = extMachines.filter((m) => m.zona_id === zona.id);

          return {
            id: zona.id,
            nombre: zona.nombre,
            machines: [
              ...eco.map((m) => ({
                id: m.id,
                name: `ECO ${m.numero}`,
                type: 'eco',
                temperature: m.temperatura_imp,
                status: m.estado === 1 ? 'ON' : 'OFF',
              })),
              ...ext.map((m) => ({
                id: m.id,
                name: `EXT ${m.numero}`,
                type: 'ext',
                temperature: null,
                status: m.estado === 1 ? 'ON' : 'OFF',
              })),
            ],
          };
        });

        setZonesWithMachines(enriched);
      })
      .catch((err) => {
        setError(err);
        setZonesWithMachines([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, rawZones]);

  return { zonesWithMachines, loading, error };
};

export default useMachines;
