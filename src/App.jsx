import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

function App() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('es_admin') === 'true';

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
  };

  const PrivateAdminRoute = ({ children }) => {
    return isAuthenticated && isAdmin ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateAdminRoute>
            <AdminPanel />
          </PrivateAdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
