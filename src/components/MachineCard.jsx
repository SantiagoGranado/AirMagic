import React from "react";
import { useState } from "react";
const MachineCard = ({ machine, onSelect }) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(machine)}
    >
      <h2 className="font-bold text-lg">{machine.name}</h2>
      <p>🌡️ {machine.temperature}°C</p>
      <button className={`mt-2 px-4 py-2 rounded-lg text-white ${machine.status === "ON" ? "bg-green-500" : "bg-red-500"}`}>
        {machine.status}
      </button>
    </div>
  );
};

export default MachineCard;
