import React, { useState } from 'react';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from '../supabase';
import bcrypt from 'bcryptjs';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [compañia, setCompañia] = useState(user.compañia || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.foto_url || '/img/default.png');
  const [error, setError] = useState(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setNewProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError(null);

    if (!compañia.trim() || !email.trim()) {
      setError('Compañía y correo son obligatorios.');
      return;
    }

    try {
      // 0. Obtener hash actual de la contraseña desde la tabla
      const { data: current, error: fetchErr } = await supabase
        .from('Usuarios')
        .select('contraseña')
        .eq('id', user.id)
        .single();
      if (fetchErr) throw fetchErr;

      // 1. Si se ha escrito nueva contraseña, compararla con la actual
      if (password) {
        // Comprobar que no sea idéntica a la anterior
        const isSame = await bcrypt.compare(password, current.contraseña);
        if (isSame) {
          setError('La nueva contraseña debe ser diferente de la actual.');
          return;
        }
        // Validar longitud mínima
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres.');
          return;
        }
        // Actualizar en Auth
        const { error: authErr } = await supabase.auth.updateUser({ password });
        if (authErr) throw authErr;
      }

      // 2. Subir imagen si hay nueva
      let foto_url = user.foto_url;
      if (newProfileImage) {
        const ext = newProfileImage.name.split('.').pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, newProfileImage, { upsert: true });
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(path);
        foto_url = urlData.publicUrl;
      }

      // 3. Preparar campos para la actualización
      const updatedFields = {
        compañia: compañia.trim(),
        email: email.trim(),
        foto_url,
      };

      // 4. Si hay contraseña nueva, hashearla y añadirla
      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        updatedFields.contraseña = hashed;
      }

      // 5. Ejecutar update en la tabla Usuarios
      const { error: dbErr } = await supabase
        .from('Usuarios')
        .update(updatedFields)
        .eq('id', user.id);
      if (dbErr) throw dbErr;

      // 6. Notificar al padre y cerrar modal
      onUpdate({ ...user, ...updatedFields });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSaveChanges}
        className="bg-white p-6 rounded-md shadow-xl w-full max-w-lg space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Editar Perfil</h2>
          <button type="button" onClick={onClose}>
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={previewUrl}
            alt="Avatar"
            className="w-32 h-32 rounded-full mb-2 border"
          />
          <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
            Cambiar Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Compañía */}
        <input
          type="text"
          placeholder="Compañía"
          value={compañia}
          onChange={(e) => setCompañia(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Contraseña con toggle Ver/Ocultar */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña (opcional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
