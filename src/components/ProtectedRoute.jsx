// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  // 1) Mientras se comprueba la sesión/rol, mostramos el spinner
  if (loading) {
    return <LoadingSpinner />;
  }
  // 2) Si no hay usuario, lo enviamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // 3) Si es admin, forzamos la ruta /admin
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  // 4) Usuario normal: renderizamos la ruta solicitada
  return children;
}
