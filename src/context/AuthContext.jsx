import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getSession,
  onAuthStateChange,
} from '../services/authService.js';
import { getUserProfile } from '../services/userService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession]   = useState(null);
  const [user, setUser]         = useState(null);
  const [isAdmin, setIsAdmin]   = useState(false);
  const [loading, setLoading]   = useState(true);

  // Carga el flag es_admin desde la tabla Usuarios
  const loadAdminFlag = async (userId) => {
    const { data, error } = await getUserProfile(userId);
    if (error) {
      console.error('Error cargando es_admin:', error);
      setIsAdmin(false);
    } else {
      setIsAdmin(!!data.es_admin);
    }
  };

  useEffect(() => {
    // 1) Sesión existente
    getSession().then(({ data: { session } = {} }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadAdminFlag(session.user.id);
      }
      setLoading(false);
    });

    // 2) Escucha cambios en Auth (login/logout)
    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadAdminFlag(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login que además consulta es_admin en tabla Usuarios
  const login = async (email, password) => {
    const { data, error } = await loginService({ email, password });
    if (error) throw error;

    setSession(data.session);
    setUser(data.user);

    const { data: profile, error: profileError } = await getUserProfile(data.user.id);
    if (profileError) console.error('Error cargando es_admin tras login:', profileError);
    const adminFlag = !!profile?.es_admin;
    setIsAdmin(adminFlag);

    return { ...data, isAdmin: adminFlag };
  };

  const register = async (email, password) => {
    const { data, error } = await registerService({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await logoutService();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
