// MachineCard.jsx

import React from "react";

const MachineCard = ({ machine, onSelect }) => {
  const { name, type, temperature, status } = machine;

  // Podrías usar imágenes diferentes para cada tipo de máquina
  const ecoImage = "/assets/eco_machine.png";
  const extImage = "/assets/ext_machine.png";

  // Función para apagar la máquina (lógica a tu gusto)
  const handlePowerOff = (e) => {
    e.stopPropagation(); // Evitar que se abra el modal al hacer clic en el botón
    console.log(`Apagando máquina ${name}`);
    // Aquí puedes llamar a una API o actualizar estado, etc.
  };

  return (
    <div
      onClick={() => onSelect(machine)}
      className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100"
    >
      <h3 className="font-bold text-lg mb-2">{name}</h3>

      {/* Render condicional para ECO */}
      {type === "eco" && (
        <div>
          <img
            src={ecoImage}
            alt="Eco Machine"
            className="w-16 h-16 object-contain mx-auto mb-2"
          />
          <p className="mb-2">Temp: {temperature} °C</p>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={handlePowerOff}
          >
            Apagar
          </button>
        </div>
      )}

      {/* Render condicional para EXT */}
      {type === "ext" && (
        <div>
          <img
            src={extImage}
            alt="Ext Machine"
            className="w-16 h-16 object-contain mx-auto mb-2"
          />
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={handlePowerOff}
          >
            Apagar
          </button>
        </div>
      )}
    </div>
  );
};

export default MachineCard;
