import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [compañia, setCompañia] = useState(''); // Cambié 'nombre' y 'apellido' por 'compañia'
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

    // Validación mínima de la contraseña
    if (password.length < 6) {
      setErrors({ password: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.includes('already registered')) {
        setErrors({ email: 'El correo ya está registrado' });
      } else {
        setErrors({ general: 'Error al registrar: ' + error.message });
      }
      return;
    }

    const userId = data.user?.id;
    let foto_url = null;

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

    // Insertar los datos del usuario en la tabla `Usuarios`
    const { error: insertError } = await supabase.from('Usuarios').insert([
      {
        id: userId,
        compañia,        // Usamos el nuevo campo `compañia`
        foto_url,
        email,
        contraseña: hashedPassword,
        es_admin: false, // Por defecto, los usuarios no serán administradores
      },
    ]);

    if (insertError) {
      setErrors({ general: 'Error al guardar en base de datos: ' + insertError.message });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold text-center">Registro</h1>

        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

        <input
          type="text"
          placeholder="Compañía"
          value={compañia}
          onChange={(e) => setCompañia(e.target.value)} // Se cambió de 'nombre' a 'compañia'
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

        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Registrarse
        </button>
      </form>
    </div>
  );
}
