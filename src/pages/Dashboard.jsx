// Dashboard.jsx

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MachineCard from "../components/MachineCard";
import ModalMachine from "../components/ModalMachine";

const Dashboard = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Ejemplo de zonas y máquinas
  const zones = [
    {
      id: 1,
      name: "Zona 1",
      machines: [
        { id: 101, name: "ECO 1", type: "eco", temperature: 22, status: "ON" },
        { id: 102, name: "EXT 1", type: "ext", temperature: 18, status: "OFF" },
        
      ],
    },
    {
      id: 2,
      name: "Zona 2",
      machines: [
        { id: 201, name: "ECO 2", type: "eco", temperature: 20, status: "ON" },
        { id: 202, name: "EXT 2", type: "ext", temperature: 16, status: "OFF" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 text-black w-full">
      <Navbar />

      <div className="max-w-6xl mx-auto py-5 ">
        {zones.map((zone) => (
          <div key={zone.id} className="mb-6">
            <h2 className="text-xl font-bold mb-4 ">{zone.name}</h2>
            
            {/* Ajustamos a 4 columnas y menor gap */}
            <div className="grid grid-cols-4 gap-2 bg-gray-50 p-4 rounded-md">
              {zone.machines.map((machine) => (
                <MachineCard
                  key={machine.id}
                  machine={machine}
                  onSelect={setSelectedMachine}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedMachine && (
        <ModalMachine
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
