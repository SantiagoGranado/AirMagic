import React from "react";
import { FaThermometerHalf } from "react-icons/fa";

const MachineCard = ({ machine, onSelect }) => {
  const { name, type, temperature } = machine;

  // Rutas de las imágenes según el tipo
  const ecoImage = "/img/eco.png";
  const extImage = "/img/ext.png";
  const machineImage = type === "eco" ? ecoImage : extImage;

  // Manejador del botón de apagado
  const handlePowerOff = (e) => {
    e.stopPropagation();
    console.log(`Apagando máquina ${name}`);
    // Lógica para apagar la máquina
  };

  return (
    <div
      onClick={() => onSelect(machine)}
      className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer w-full md:w-72 lg:w-[320px]"
    >
      <div className="flex flex-row">
        {/* Imagen a la izquierda */}
        <div className="flex-shrink-0 mr-4">
          <img
            src={machineImage}
            alt={`${type} machine`}
            className="w-40 h-24 object-contain"
          />
        </div>
        {/* Datos a la derecha */}
        <div className="flex flex-col justify-between flex-grow">
          <h3 className="font-bold text-2xl mb-2 break-words">{name}</h3>
          {/* Contenedor para la temperatura con altura mínima para reservar espacio */}
          <div className="text-xl text-gray-700 flex items-center min-h-[1.5rem]">
            {type === "eco" ? (
              <>
                <FaThermometerHalf className="mr-2" />
                {temperature}°C
              </>
            ) : (
              <span className="opacity-0">placeholder</span>
            )}
          </div>
          <button
            onClick={handlePowerOff}
            className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600 transition w-max"
          >
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
