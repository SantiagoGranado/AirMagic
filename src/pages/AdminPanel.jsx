import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';  // Asegúrate de tener este modal importado

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);  // Usuario seleccionado para editar
  const [isModalOpen, setIsModalOpen] = useState(false);  // Controlar el estado del modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from('Usuarios').select('*');
      if (error) {
        console.error('Error al cargar usuarios:', error.message);
      } else {
        const sortedUsuarios = data.sort((a, b) => a.compañia.localeCompare(b.compañia));
        setUsuarios(sortedUsuarios);
      }
    };
    fetchUsuarios();
  }, []);

  // Función para abrir el modal con los datos del usuario
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true); // Abrir el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);  // Limpiar el usuario seleccionado
  };

  return (
    <div className="w-full h-screen p-6 sm:p-8 bg-blue-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-0">Panel de Administrador</h1>
        <button
          className="bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out 
                        px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg cursor-pointer"
          onClick={() => navigate('/register')}
        >
          Registrar nuevo usuario
        </button>
      </div>

      {/* Vista de tabla para pantallas md en adelante */}
      <div className="overflow-x-auto h-[calc(100%-6rem)]">
        <table className="min-w-full bg-white border rounded-lg shadow-md hidden md:table">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Compañía</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Administrador</th>
              <th className="px-4 py-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t hover:bg-blue-100">
                <td className="px-4 py-2">
                  <img
                    src={u.foto_url || '/img/default.png'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-4 py-2">{u.compañia}</td>
                <td className="px-4 py-2 break-all">{u.email}</td>
                <td className="px-4 py-2">{u.es_admin ? 'Sí' : 'No'}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => handleUserSelect(u)}  // Abre el modal con los datos del usuario
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Vista en tarjetas para pantallas sm y menores */}
        <div className="md:hidden space-y-4">
          {usuarios.map((u) => (
            <div key={u.id} className="bg-white border rounded-lg shadow-md p-4">
              <div className="flex items-center mb-4">
                <img
                  src={u.foto_url || '/img/default.png'}
                  alt="avatar"
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold truncate">{u.compañia}</h3>
                  <p className="text-gray-600 break-all text-sm sm:text-base">{u.email}</p>
                </div>
                <div className="ml-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.es_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>  
                    {u.es_admin ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => handleUserSelect(u)}  // Abre el modal con los datos del usuario
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición del usuario */}
      {isModalOpen && selectedUser && (
        <EditProfileModal
          user={selectedUser}
          onClose={handleCloseModal} // Cerrar el modal
          onUpdate={(updatedUser) => {
            setUsuarios((prev) => {
              return prev.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              );
            });
          }}
        />
      )}
    </div>
  );
}
