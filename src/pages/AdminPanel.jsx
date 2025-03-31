import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from('Usuarios').select('*');
      if (error) {
        console.error('Error al cargar usuarios:', error.message);
      } else {
        setUsuarios(data);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/register')}
        >
          Registrar nuevo usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Compañía</th> 
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Administrador</th> 
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={u.foto_url ? u.foto_url : '/img/default.png'} // Si no tiene foto, muestra la imagen por defecto
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-4 py-2">{u.compañia}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.es_admin ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
