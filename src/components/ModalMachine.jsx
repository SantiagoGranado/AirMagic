// ModalMachine.jsx

import React from "react";

const ModalMachine = ({ machine, onClose }) => {
  if (!machine) return null;

  const { name, type, temperature, status } = machine;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
          onClick={onClose}
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4">{name}</h2>
        
        {type === "eco" && (
          <div>
            <p>Modo: <strong>ECO</strong></p>
            <p>Temperatura: {temperature} °C</p>
            <p>Status: {status}</p>
            {/* Aquí más campos que sean propios de ECO */}
          </div>
        )}

        {type === "ext" && (
          <div>
            <p>Modo: <strong>EXT</strong></p>
            <p>Status: {status}</p>
            {/* Aquí más campos que sean propios de EXT */}
          </div>
        )}

        {/* Botones de acción adicionales, si los necesitas */}
      </div>
    </div>
  );
};

export default ModalMachine;
