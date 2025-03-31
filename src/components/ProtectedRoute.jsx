import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly, isDashboard }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('es_admin') === 'true';

  // Verifica si el usuario está autenticado
  if (!userId) {
    navigate('/login');
    return null;
  }

  // Si es admin y está intentando acceder al Dashboard, redirige a AdminPanel
  if (isAdmin && isDashboard) {
    navigate('/admin');
    return null;
  }

  // Si la ruta es adminOnly, verifica si el usuario es admin
  if (adminOnly && !isAdmin) {
    navigate('/dashboard');  // Redirige a Dashboard si no es admin
    return null;
  }

  return children;  // Si está autenticado y cumple con el rol, renderiza el componente
};

export default ProtectedRoute;
