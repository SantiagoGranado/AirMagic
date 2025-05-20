// src/components/AdminPanel.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUsers.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EditProfileModal from "../components/EditProfileModal.jsx";
import Register from "../pages/Register.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPanel() {
  const { users, loading, error, editUser, createUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleUpdate = async (updatedUser) => {
    try {
      await editUser(updatedUser.id, {
        compania: updatedUser.compania,
        foto_url: updatedUser.foto_url,
      });
      toast.success("Usuario actualizado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando usuario");
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCreateUser = async (newUser) => {
    try {
      await createUser(newUser);
      toast.success("Usuario creado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error creando usuario");
    }
    setIsCreateOpen(false);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-lg">Error cargando usuarios.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Panel de Administración
      </h1>

      <div className="flex justify-end mb-6 space-x-4">
        
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-5 py-2.5 cursor-pointer rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow transition"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">
                  Avatar
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">
                  Compañía
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-center text-base font-semibold text-gray-700 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const compania = u.compañia || "—";
                const avatarUrl = u.avatar_public_url || "/img/default.png";
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-800">
                      {compania}
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-800 break-all">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(u)}
                        className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {users.map((u) => {
          const compania = u.compañia || "—";
          const avatarUrl = u.avatar_public_url || "/img/default.png";
          return (
            <div
              key={u.id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {compania}
                  </p>
                  <p className="text-sm text-gray-500 break-all">{u.email}</p>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => handleEdit(u)}
                  className="mt-2 sm:mt-0 px-4 py-2 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedUser && (
        <EditProfileModal
          user={selectedUser}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
      {isCreateOpen && (
        <Register
          onClose={handleCloseCreate}
          onCreate={handleCreateUser}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
