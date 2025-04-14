import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import PasswordChangeModal from "../components/PasswordChangeModal";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState("success"); // "success" o "error"
  const navigate = useNavigate();

  // Función para mostrar el pop up. Se oculta automáticamente después de 3 segundos.
  const showPopup = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
  };

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const { data, error } = await supabase
          .from("Usuarios")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error al cargar datos de usuario:", error.message);
          return;
        }
        setUser(data);
      }
    };

    fetchUserData();
  }, []);

  // Manejo de cambio de imagen
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Mostrar preview en el avatar
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Construir el filePath para la nueva imagen
    const fileExt = file.name.split(".").pop();
    const newFilePath = `${userId}/avatar.${fileExt}`;

    // Determinar el filePath actual a partir de la URL almacenada (si existe y no es la imagen por defecto)
    let oldFilePath = null;
    if (user && user.foto_url && !user.foto_url.includes("/img/default.png")) {
      const parts = user.foto_url.split("/public/avatars/");
      if (parts.length === 2) {
        oldFilePath = parts[1];
      }
    }

    // Si el nuevo filePath es distinto, eliminar la imagen antigua
    if (oldFilePath && oldFilePath !== newFilePath) {
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([oldFilePath]);
      if (deleteError) {
        console.error("Error al eliminar la imagen anterior: ", deleteError.message);
        showPopup("Error al eliminar la imagen anterior: " + deleteError.message, "error");
        // Se continúa aunque falle la eliminación
      }
    }

    // Subir la nueva imagen con opción upsert (para reemplazar si es el mismo filePath)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(newFilePath, file, { upsert: true });
    if (uploadError) {
      console.error(uploadError.message);
      showPopup("Error al subir la imagen de perfil: " + uploadError.message, "error");
      return;
    }

    // Obtener la URL pública de la imagen subida
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(newFilePath);
    const imageUrl = publicUrlData.publicUrl;

    // Actualizar la URL de la imagen en la tabla de Usuarios
    const { error: updateError } = await supabase
      .from("Usuarios")
      .update({ foto_url: imageUrl })
      .eq("id", userId);
    if (updateError) {
      console.error(updateError.message);
      showPopup("Error al actualizar la imagen de perfil: " + updateError.message, "error");
      return;
    }

    // Actualizar el estado del usuario y limpiar la vista previa
    setUser((prev) => ({ ...prev, foto_url: imageUrl }));
    setPreviewUrl(null);
    showPopup("Imagen de perfil actualizada con éxito", "success");
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-blue-100 py-10">
      <Navbar onZoneSelect={() => navigate("/dashboard")} />
      
      {/* Botón para volver */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
        >
          Volver
        </button>
      </div>

      {/* Pop up para mostrar mensajes de error o éxito */}
      {popupVisible && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded z-50 shadow ${
            popupType === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {popupMessage}
        </div>
      )}

      {/* Modal para cambiar la contraseña */}
      {showModal && (
        <PasswordChangeModal
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={() => showPopup("Contraseña cambiada con éxito", "success")}
        />
      )}

      {/* Contenedor principal del contenido, se agregó mt-12 para separarlo del centro */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Mi Perfil
        </h1>

        <div className="flex flex-col items-center">
          {/* Avatar: muestra la preview si existe, sino la imagen actual o la imagen por defecto */}
          <div className="relative mb-6">
            <img
              src={previewUrl || user.foto_url || "/img/default.png"}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
            />
            {/* Input de archivo "invisible" con label para cambiar el avatar */}
            <div className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="opacity-0 w-0 h-0"
                id="profileImageInput"
              />
              <label htmlFor="profileImageInput" className="text-xs font-semibold">
                Cambiar
              </label>
            </div>
          </div>

          <h2 className="text-xl font-semibold">{user.compañia}</h2>
          <p className="text-md text-gray-600">{user.email}</p>

          {/* Botón para abrir el modal de cambiar contraseña */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer"
            >
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
