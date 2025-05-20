// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // modos
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // campos editables
  const [company, setCompany] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  // password
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // feedback
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Helper para obtener publicUrl
  const getPublicUrl = (path) => {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  const fetchProfile = async () => {
    setLoading(true)
    // 1) obtenemos el usuario auth
    const { data: authRes, error: authErr } = await supabase.auth.getUser()
    if (authErr) {
      setError(authErr)
      setLoading(false)
      return
    }
    const userId = authRes.user.id
    // 2) leemos la fila en la tabla Usuarios
    const { data, error: fetchErr } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('id', userId)
      .single()
    if (fetchErr) {
      setError(fetchErr)
    } else {
      setProfile(data)
      setCompany(data.compañia || '')
      setAvatarPreview(data.foto_url ? getPublicUrl(data.foto_url) : '')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleAvatarChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let foto_url = profile.foto_url || ''
      // Subir nuevo avatar si existe
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const fileName = `avatars/${profile.id}_${Date.now()}.${ext}`
        const { data: uploadData, error: uploadErr } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true })
        if (uploadErr) throw uploadErr
        foto_url = uploadData.path
      }
      // Actualizar tabla Usuarios
      const { error: updateErr } = await supabase
        .from('Usuarios')
        .update({
          compañia: company,
          foto_url,
        })
        .eq('id', profile.id)
      if (updateErr) throw updateErr

      // Refrescar datos
      await fetchProfile()
      setMessage({ type: 'success', text: 'Perfil actualizado.' })
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setSaving(true)
    try {
      const { error: passErr } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (passErr) throw passErr
      setMessage({ type: 'success', text: 'Contraseña cambiada.' })
      setIsChangingPassword(false)
      setNewPassword('')
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return <LoadingSpinner />
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-lg font-medium">Error cargando perfil.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 space-y-6">
        {/* Avatar + botones */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={avatarPreview || '/default-avatar.png'}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 "
            />
            {isEditing && (
              <>
                <label
                  htmlFor="avatarInput"
                  className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  <FaCamera className="text-white cursor-pointer" />
                </label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Mensaje de feedback */}
        {message.text && (
          <div
            className={`px-4 py-2 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* VISTA */}
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Email</h2>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Compañía</h2>
              <p className="text-gray-900">{profile.compañia || '-'}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compañía
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              />
            </div>
          </div>
        )}

        {/* Cambiar contraseña */}
        {isChangingPassword && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Contraseña'}
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false)
                  setNewPassword('')
                }}
                disabled={saving}
                className="flex-1 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-semibold py-2 px-4 rounded disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Botones Editar / Guardar */}
        <div className="flex gap-4">
          {!isEditing && !isChangingPassword && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 rounded"
              >
                Editar Perfil
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-semibold py-2 rounded"
              >
                Cambiar Contraseña
              </button>
            </>
          )}
          {isEditing && (
            <>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-2 rounded disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer font-semibold py-2 rounded disabled:opacity-50"
              >
                Cancelar
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded cursor-pointer mt-4"
        >
          Cerrar Sesión
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-blue-600 hover:underline cursor-pointer mt-2"
        >
          Volver
        </button>
      </div>
    </div>
  )
}
