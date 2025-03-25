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
      {/* Fondo semitransparente */}
      <div className="absolute inset-0"></div>

      {/* Contenedor principal del modal */}
      <div className="relative bg-gray-50 p-6 rounded-lg shadow-2xl w-full max-w-5xl z-10">
        {/* Título (ECO/EXT + nombre) en la parte superior */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          {type.toUpperCase()}
        </h2>

        {/* Zona principal con 5 "columnas" (flex) */}
        <div className="flex items-start justify-center space-x-6">
          {/* Columna izquierda: Auto, Manual, Power */}
          <div className="flex flex-col space-y-4">
            <button className="cursor-pointer bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 text-xl">
              Auto
            </button>
            {type === "eco" && (
              <button className="cursor-pointer bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 text-xl">
                Manual
              </button>
            )}
            <button className="cursor-pointer bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 text-xl">
              Power
            </button>
          </div>

          {/* Range vertical a la izquierda de la imagen */}
          <div className="h-64 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              className="w-40 transform rotate-90"
            />
          </div>

          {/* Imagen de la máquina en el centro */}
          <div className="bg-gray-100 w-64 h-64 flex items-center justify-center rounded-lg">
            <img
              src={machineImage}
              alt={`${type} machine`}
              className="object-contain w-48 h-48"
            />
          </div>

          {/* Range vertical a la derecha de la imagen */}
          <div className="h-64 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              className="w-40 transform rotate-90"
            />
          </div>

          {/* Columna derecha: botones adicionales */}
          <div className="flex flex-col space-y-4">
            {type === "eco" && (
              <button className="cursor-pointer bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 text-xl flex items-center justify-center">
                <FaThermometerHalf className="mr-2" />
                {temperature} °C
              </button>
            )}
            <button className="cursor-pointer bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 text-xl">
              Opción 2
            </button>
            <button className="cursor-pointer bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 text-xl">
              Opción 3
            </button>
            {/* Agrega más botones si los necesitas */}
          </div>
        </div>

        {/* Botón Salir en la parte inferior, centrado */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="cursor-pointer bg-gray-300 px-6 py-3 rounded hover:bg-gray-400 text-2xl"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMachine;
