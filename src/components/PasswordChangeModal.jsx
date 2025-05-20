import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "../supabase";

const PasswordChangeModal = ({ user, onClose, onSuccess }) => {
  // Estados para los valores de los inputs de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Estado de error
  const [error, setError] = useState(null);
  // Estados para mostrar/ocultar contraseñas
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar que la nueva contraseña tenga al menos 6 caracteres
    if (newPasswordInput.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Validar que la nueva contraseña y su confirmación sean iguales
    if (newPasswordInput !== confirmPassword) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    // Validar que la nueva contraseña no sea igual a la actual
    if (currentPassword === newPasswordInput) {
      setError("La nueva contraseña no puede ser igual a la actual.");
      return;
    }

    // Se asume que el objeto user tiene el campo "contraseña" con el hash almacenado.
    const isMatch = bcrypt.compareSync(currentPassword, user.contraseña);
    if (!isMatch) {
      setError("La contraseña actual es incorrecta.");
      return;
    }

    // Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPasswordInput, 10);

    // Actualizar el registro en la tabla "Usuarios"
    const { error: updateError } = await supabase
      .from("Usuarios")
      .update({ contraseña: hashedNewPassword })
      .eq("id", user.id);

    if (updateError) {
      setError("Error al actualizar la contraseña: " + updateError.message);
      console.error(updateError.message);
      return;
    }

    // Si todo salió bien, ejecutamos el callback onSuccess y cerramos el modal
    onSuccess && onSuccess();
    onClose();
  };

  // Función para renderizar un input con botón para ver/ocultar contraseña
  const renderPasswordInput = (
    label,
    value,
    onChange,
    showPassword,
    setShowPassword
  ) => (
    <div className="mb-4 relative">
      <label className="block text-gray-700 mb-1">{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded pr-12"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 top-9 text-sm text-blue-600 cursor-pointer"
      >
        {showPassword ? "Ocultar" : "Ver"}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handlePasswordChangeSubmit}>
          {renderPasswordInput(
            "Contraseña Actual",
            currentPassword,
            (e) => setCurrentPassword(e.target.value),
            showCurrent,
            setShowCurrent
          )}
          {renderPasswordInput(
            "Nueva Contraseña",
            newPasswordInput,
            (e) => setNewPasswordInput(e.target.value),
            showNew,
            setShowNew
          )}
          {renderPasswordInput(
            "Confirmar Nueva Contraseña",
            confirmPassword,
            (e) => setConfirmPassword(e.target.value),
            showConfirm,
            setShowConfirm
          )}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 rounded bg-gray-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
