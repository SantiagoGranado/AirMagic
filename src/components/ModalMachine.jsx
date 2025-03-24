import React from "react";
import { useState } from "react";
const ModalMachine = ({ machine, onClose }) => {
  if (!machine) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">{machine.name}</h2>
        <div className="flex space-x-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded-lg">Auto</button>
          <button className="bg-gray-300 px-4 py-2 rounded-lg">Manual</button>
        </div>
        <p className="mt-4">🌡️ {machine.temperature}°C</p>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalMachine;
