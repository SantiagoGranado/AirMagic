// src/components/MachineCard.jsx

import React from "react";

const MachineCard = ({ machine, onSelect }) => {
  const { name, type, avisos, alarmas } = machine;

  const ecoImage = "/img/eco.png";
  const extImage = "/img/ext.png";
  const machineImage = type === "eco" ? ecoImage : extImage;

  // Duración del parpadeo (más rápido)
  const blinkDuration = "0.5s";

  return (
    <div
      onClick={() => onSelect(machine)}
      className="bg-white p-4 rounded-lg shadow hover:shadow-lg md:w-64 lg:w-72 flex flex-col items-center justify-between h-64 cursor-pointer transition"
    >
      <div className="w-32 h-24 mb-4">
        <img
          src={machineImage}
          alt={`${type} machine`}
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="font-bold text-lg text-gray-800 text-center mb-4 break-words">
        {name}
      </h3>

      <p className="text-sm font-medium text-gray-600 mb-2">Alarmas y avisos</p>

      <div className="flex gap-4">
        {/* Avisos */}
        <div className="flex flex-col items-center">
          <div
            className={`w-5 h-5 rounded-full ${
              avisos ? "bg-yellow-400 animate-pulse" : "bg-gray-300"
            }`}
            style={avisos ? { animationDuration: blinkDuration } : {}}
          ></div>
          <span className="text-xs mt-1 text-gray-600">Avisos</span>
        </div>

        {/* Alarmas */}
        <div className="flex flex-col items-center">
          <div
            className={`w-5 h-5 rounded-full ${
              alarmas ? "bg-red-500 animate-pulse" : "bg-gray-300"
            }`}
            style={alarmas ? { animationDuration: blinkDuration } : {}}
          ></div>
          <span className="text-xs mt-1 text-gray-600">Alarmas</span>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
