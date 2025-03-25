// MachineCard.jsx

import React from "react";

const MachineCard = ({ machine, onSelect }) => {
  const { name, type, temperature, status } = machine;

  // Imágenes según el tipo de máquina
  const ecoImage = "./img/eco.png";
  const extImage = "./img/ext.png";

  // Función para apagar la máquina
  const handlePowerOff = (e) => {
    e.stopPropagation(); // Evita abrir el modal al hacer clic en el botón
    console.log(`Apagando máquina ${name}`);
    // Lógica adicional para apagar la máquina (API, estado, etc.)
  };

  // Determina la imagen según el tipo
  const machineImage = type === "eco" ? ecoImage : extImage;

  return (
    <div
      onClick={() => onSelect(machine)}
      className="bg-white w-60 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100"
    >
      {/* Título de la máquina */}
      <h3 className="font-bold text-xl mb-2">{name}</h3>

      {/* Contenido en dos columnas: imagen a la izquierda, info a la derecha */}
      <div className="flex items-center space-x-4">
        {/* Imagen */}
        <img
          src={machineImage}
          alt={`${type} machine`}
          className="w-20 h-20 object-contain"
        />

        {/* Información y botón */}
        <div className="flex flex-col">
          {/* Solo ECO muestra temperatura */}
          {type === "eco" && (
            <p className="mb-2 text-lg">Temp: {temperature} °C</p>
          )}
          {/* EXT podría también mostrar la temperatura si lo deseas */}
          {type === "ext" && (
            <p className="mb-2 text-lg">Temp: {temperature} °C</p>
          )}

          <button
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600 text-sm"
            onClick={handlePowerOff}
          >
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
