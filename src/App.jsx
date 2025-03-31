import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';  // Usar el componente de protección de ruta
import ErrorPage from './pages/ErrorPage';

function App() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('es_admin') === 'true';

  // Componente para rutas privadas (solo accesibles si el usuario está logueado)
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
  };

  // Componente para rutas privadas de administrador (solo accesibles si el usuario es admin)
  const PrivateAdminRoute = ({ children }) => {
    return isAuthenticated && isAdmin ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Routes>
      {/* Ruta para iniciar sesión */}
      <Route path="/login" element={<Login />} />
      
      {/* Ruta de registro, protegida por el admin (solo accesible si el usuario es admin) */}
      <Route
        path="/register"
        element={
          isAuthenticated && isAdmin ? <Register /> : <Navigate to="/login" />
        }
      />

      {/* Ruta de Dashboard, accesible solo para usuarios logueados pero NO administradores */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {isAdmin ? <Navigate to="/admin" /> : <Dashboard />}
          </PrivateRoute>
        }
      />
      
      {/* Ruta del Panel de Administrador, accesible solo para administradores */}
      <Route
        path="/admin"
        element={
          <PrivateAdminRoute>
            <AdminPanel />
          </PrivateAdminRoute>
        }
      />

      {/* Ruta para páginas no encontradas (Error 404) */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
