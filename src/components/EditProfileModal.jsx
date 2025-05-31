import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../supabase.js';

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [company, setCompany] = useState(user.compañia || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.foto_url
      ? supabase.storage.from('avatars').getPublicUrl(user.foto_url).data.publicUrl
      : '/img/default.png'
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCompany(user.compañia || '');
    setAvatarPreview(
      user.foto_url
        ? supabase.storage.from('avatars').getPublicUrl(user.foto_url).data.publicUrl
        : '/img/default.png'
    );
    setAvatarFile(null);
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let foto_url = user.foto_url || '';
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const fileName = `avatars/${user.id}_${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadErr } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        foto_url = uploadData.path;
      }

      const { error: updateErr } = await supabase
        .from('Usuarios')
        .update({
          compañia: company,
          foto_url,
        })
        .eq('id', user.id);
      if (updateErr) throw updateErr;

      const { data: urlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(foto_url);

      onUpdate({
        ...user,
        compañia: company,
        foto_url,
        avatar_public_url: urlData.publicUrl,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition text-2xl font-bold cursor-pointer"
        >
          ×
        </button>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Editar Usuario</h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarPreview}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover shadow-md mb-3"
          />
          <label className="cursor-pointer text-sm text-blue-600 hover:underline font-medium">
            Cambiar Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compañía
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 rounded-lg border cursor-pointer border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
