// src/components/Register.jsx
import React, { useState } from "react";
import { supabase } from "../supabase.js";

export default function Register({ onClose, onCreate }) {
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [compania,  setCompania]  = useState("");
  const [file,      setFile]      = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    let fotoPath = "";

    try {
      // 1) Crear en Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      const userId = signUpData.user.id;

      // 2) Subir avatar con pattern userId_timestamp.ext
      if (file) {
        setUploading(true);
        const ext = file.name.split(".").pop();
        const filename = `${userId}_${Date.now()}.${ext}`;
        const storagePath = `avatars/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
        setUploading(false);
        if (uploadError) throw uploadError;

        fotoPath = storagePath;
      }

      // 3) Insertar perfil en tabla `Usuarios`
      const { data: inserted, error: insertError } = await supabase
        .from("Usuarios")
        .insert([
          {
            id:        userId,
            email:     email,
            compañia:  compania,   // mapeo explícito
            foto_url:  fotoPath,
            es_admin:  false       // asegurar booleano si no hay default
          },
        ])
        .select()    // para obtener el registro insertado
        .single();   // y poder inspeccionarlo

      if (insertError) throw insertError;
      console.log("Perfil insertado correctamente:", inserted);

      // 4) Notificar al padre y cerrar
      await onCreate({
        id:        inserted.id,
        email:     inserted.email,
        compania:  inserted.compañia,
        foto_url:  inserted.foto_url,
      });
      onClose();

      // Reset
      setEmail("");
      setPassword("");
      setCompania("");
      setFile(null);
    } catch (err) {
      console.error("Error creando usuario:", err);
      alert("No se pudo crear el usuario: " + err.message);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
            />
          </div>

          {/* Compañía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compañía
            </label>
            <input
              type="text"
              value={compania}
              onChange={(e) => setCompania(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Subiendo avatar…</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
