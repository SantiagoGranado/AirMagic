import React from "react";
import { FaThermometerHalf } from "react-icons/fa"; // Importamos el icono

const MachineCard = ({ machine, onSelect }) => {
  const { name, type, temperature } = machine;

  // Define las rutas de las imágenes según el tipo
  const ecoImage = "/img/eco.png";
  const extImage = "/img/ext.png";

  const handlePowerOff = (e) => {
    e.stopPropagation();
    console.log(`Apagando máquina ${name}`);
    // Aquí puedes agregar la lógica de apagado
  };

  // Selecciona la imagen según el tipo
  const machineImage = type === "eco" ? ecoImage : extImage;

  return (
    <div
      onClick={() => onSelect(machine)}
      className="bg-gray-50 p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100"
    >
      <h3 className="font-bold text-2xl mb-4">{name}</h3>
      <div className="flex items-center space-x-2">
        <img
          src={machineImage}
          alt={`${type} machine`}
          className="w-38 h-24 object-contain"
        />
        <div className="flex flex-col text-xl">
          {type === "eco" && (
            <p className="mb-4">
              <FaThermometerHalf className="inline-block mr-2" />
              {temperature} °C
            </p>
          )}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
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
