// src/components/ModalMachine.jsx
import React from "react";
import { FaThermometerHalf } from "react-icons/fa"; // Icono para la temperatura

const ModalMachine = ({ machine, onClose }) => {
  if (!machine) return null;

  const { name, type, temperature } = machine;

  // Imágenes para cada tipo de máquina
  const ecoImage = "/img/eco.png";
  const extImage = "/img/ext.png";

  // Selecciona la imagen según el tipo
  const machineImage = type === "eco" ? ecoImage : extImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay suave para oscurecer un poco el fondo */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Contenedor principal del modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-2xl w-full max-w-3xl z-10">
        {/* Botón de cierre en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-600"
        >
          X
        </button>

        {/* Título (ECO/EXT + nombre) */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          {type.toUpperCase()} {name}
        </h2>

        {/* Área principal: 3 columnas (izquierda, centro, derecha) */}
        <div className="flex justify-center space-x-6">
          {/* Columna izquierda: Auto, Manual, Power */}
          <div className="flex flex-col space-y-4">
            <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
              Auto
            </button>
            {/* Muestra "Manual" solo en ECO, por ejemplo */}
            {type === "eco" && (
              <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
                Manual
              </button>
            )}
            <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
              Power
            </button>
          </div>

          {/* Columna central: Imagen de la máquina */}
          <div className="flex items-center justify-center bg-gray-100 w-64 h-64 rounded-lg">
            <img
              src={machineImage}
              alt={`${type} machine`}
              className="object-contain w-48 h-48"
            />
          </div>

          {/* Columna derecha: Diferencia si es ECO o EXT */}
          {type === "eco" ? (
            <div className="flex flex-col space-y-4">
              {/* Botón con la temperatura (icono termómetro) */}
              <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 flex items-center justify-center">
                <FaThermometerHalf className="mr-2" />
                {temperature}°C
              </button>
              {/* Dos botones de ejemplo */}
              <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
                Opción 2
              </button>
              <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
                Opción 3
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {/* En EXT no mostramos temperatura, sino 3 botones de ejemplo */}
              <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
                Opción 1
              </button>
              <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
                Opción 2
              </button>
              <button className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">
                Opción 3
              </button>
            </div>
          )}
        </div>

        {/* Botón Salir en la parte inferior */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMachine;
