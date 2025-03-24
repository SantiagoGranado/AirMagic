import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MachineCard from "../components/MachineCard";
import ModalMachine from "../components/ModalMachine";

const Dashboard = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);

  const machines = [
    { id: 1, name: "ECO 1", type: "eco", temperature: 22, status: "ON" },
    { id: 2, name: "EXT 1", type: "ext", temperature: 18, status: "OFF" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center w-full">
      {/* Navbar */}
      <Navbar />

      {/* Contenedores de máquinas con mejor alineación */}
      <div className="mt-5 grid grid-cols-2 gap-4 max-w-6xl w-full text-center">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} onSelect={setSelectedMachine} />
        ))}
      </div>

      {/* Modal para editar máquinas */}
      {selectedMachine && (
        <ModalMachine machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
      )}
    </div>
  );

};

export default Dashboard;
