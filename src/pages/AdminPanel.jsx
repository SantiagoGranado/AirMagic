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
        // Ordenar los usuarios alfabéticamente por 'compañia'
        const sortedUsuarios = data.sort((a, b) => {
          if (a.compañia < b.compañia) return -1;
          if (a.compañia > b.compañia) return 1;
          return 0;
        });
        setUsuarios(sortedUsuarios);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-blue-100">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out 
            sm:px-8 sm:py-4 sm:text-lg 
            xs:px-4 xs:py-2 xs:text-sm 
            ml-4"
          onClick={() => navigate('/register')}
        >
          Registrar nuevo usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md hidden sm:table">
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
              <tr key={u.id} className="border-t hover:bg-blue-100"> {/* Cambio de color al pasar el ratón */}
                <td className="px-4 py-2">
                  <img
                    src={u.foto_url ? u.foto_url : '/img/default.png'}
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

        {/* Vista en formato lista para dispositivos móviles */}
        <div className="sm:hidden">
          {usuarios.map((u) => (
            <div key={u.id} className="bg-white border rounded-lg shadow-md mb-4 p-4">
              <div className="flex items-center mb-4">
                <img
                  src={u.foto_url ? u.foto_url : '/img/default.png'}
                  alt="avatar"
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{u.compañia}</h3>
                  <p className="text-gray-600">{u.email}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Administrador:</p>
                <p className="font-semibold">{u.es_admin ? 'Sí' : 'No'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
