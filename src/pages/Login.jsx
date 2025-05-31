// src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const translateError = (msg) => {
    if (msg.includes('auth/user-not-found')) return 'El usuario no existe.';
    if (msg.includes('auth/wrong-password')) return 'Contraseña incorrecta.';
    if (msg.includes('auth/invalid-email')) return 'Email no válido.';
    if (msg.includes('auth/too-many-requests')) return 'Demasiados intentos. Intenta más tarde.';
    if (msg.includes('auth/network-request-failed')) return 'Error de red. Verifica tu conexión a internet.';
    return 'Error al iniciar sesión.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones previas al envío
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    setSubmitting(true);

    try {
      const { isAdmin } = await login(email, password);
      toast.success('¡Sesión iniciada con éxito!');
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    } catch (err) {
      const message = translateError(err.message || '');
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-blue-200 bg-center flex items-center justify-center px-4"
      
    >
      <div className="w-full max-w-md bg-black/50 border border-white/20 rounded-xl shadow-2xl backdrop-blur-md p-8">
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-md mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              onInvalid={(e) => {
                e.preventDefault();
                toast.error('Introduce un email válido.');
              }}
              className="w-full px-4 py-2 bg-white/80 text-black border border-gray-300 rounded-md shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 bg-white/80 text-black border border-gray-300 rounded-md shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md cursor-pointer transform transition duration-300 ease-in-out ${
              submitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            }`}
          >
            {submitting ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
