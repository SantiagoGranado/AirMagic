import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Buscar usuario en tu tabla personalizada
    const { data: usuarios, error: fetchError } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (fetchError || usuarios.length === 0) {
      setError('Usuario no encontrado');
      return;
    }

    const usuario = usuarios[0];

    // Comparar contraseña con el hash
    const validPassword = await bcrypt.compare(password, usuario.contraseña);
    if (!validPassword) {
      setError('Contraseña incorrecta');
      return;
    }

    // Guardar datos en localStorage
    localStorage.setItem('userId', usuario.id);
    localStorage.setItem('es_admin', usuario.es_admin ? 'true' : 'false');

    // Redirigir según el rol
    if (usuario.es_admin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
