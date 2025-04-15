import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [compañia, setCompañia] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);  // Para seleccionar si el nuevo usuario es admin
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const isLoggedAdmin = localStorage.getItem('es_admin') === 'true';

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validación de contraseña
    if (password.length < 6) {
      setErrors({ password: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Verificar si es admin
    if (!isLoggedAdmin) {
      setErrors({ general: 'Solo un administrador puede registrar usuarios administradores.' });
      return;
    }

    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrors({ general: 'Error al registrar: ' + error.message });
      return;
    }

    const userId = data.user?.id;
    let foto_url = null;

    // Subir foto del usuario
    if (file && userId) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        setErrors({ general: 'Error al subir la imagen: ' + uploadError.message });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      foto_url = publicUrlData.publicUrl;
    }

    // Encriptar contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en la tabla Usuarios
    const { error: insertError } = await supabase.from('Usuarios').insert([
      {
        id: userId,
        compañia,
        foto_url,
        email,
        contraseña: hashedPassword,
        es_admin: isAdmin,  // Solo un admin puede registrar otros como admin
      },
    ]);

    if (insertError) {
      setErrors({ general: 'Error al guardar en base de datos: ' + insertError.message });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-blue-100 flex items-center justify-center h-screen">
      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold text-center">Registrar Nuevo Usuario</h1>

        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

        <input
          type="text"
          placeholder="Compañía"
          value={compañia}
          onChange={(e) => setCompañia(e.target.value)}
          className="border p-2 rounded"
          required
        />

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

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
            className="mr-2"
          />
          <span>Registrar como administrador</span>
        </label>

        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition"
        >
          <span className="text-sm text-gray-600 mb-1">Arrastra tu imagen aquí o haz clic</span>
          <span className="text-blue-600 font-semibold">Seleccionar avatar</span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover mx-auto mt-2 border"
          />
        )}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Registrar</button>
      </form>
    </div>
  );
}
