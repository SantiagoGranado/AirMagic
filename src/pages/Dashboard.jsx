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
    // Puedes agregar más zonas según necesites
  ];

  return (
    <div className="min-h-screen bg-blue-100 text-black w-full">
      <Navbar />
      <div className="max-w-6xl mx-auto py-8 px-4">
        {zones.map((zone) => (
          <div key={zone.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-6">{zone.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 rounded bg-gray-100">
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
