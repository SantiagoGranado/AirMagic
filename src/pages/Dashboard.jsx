import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import MachineCard from "../components/MachineCard";
import ModalMachine from "../components/ModalMachine";

const Dashboard = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);

  useEffect(() => {
    const fetchZonesAndMachines = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      // 1. Obtener zonas del usuario
      const { data: zonas, error: zonasError } = await supabase
        .from("Zonas")
        .select("*")
        .eq("usuario_id", userId);

      if (zonasError) {
        console.error("Error cargando zonas:", zonasError);
        return;
      }

      // 2. Obtener máquinas Eco del usuario
      const { data: ecoMachines } = await supabase
        .from("MaquinasEco")
        .select("*")
        .eq("usuario_id", userId);

      // 3. Obtener máquinas Ext del usuario
      const { data: extMachines } = await supabase
        .from("MaquinasExt")
        .select("*")
        .eq("usuario_id", userId);

      // 4. Agrupar máquinas por zona
      const zonesWithMachines = zonas.map((zona) => {
        const eco = ecoMachines?.filter((m) => m.zona_id === zona.id) || [];
        const ext = extMachines?.filter((m) => m.zona_id === zona.id) || [];

        return {
          id: zona.id,
          name: zona.nombre,
          machines: [
            ...eco.map((m) => ({
              id: m.id,
              name: `ECO ${m.numero}`,
              type: "eco",
              temperature: m.temperatura_imp,
              status: m.estado === 1 ? "ON" : "OFF",
            })),
            ...ext.map((m) => ({
              id: m.id,
              name: `EXT ${m.numero}`,
              type: "ext",
              temperature: null, // Si no tiene temperatura
              status: m.estado === 1 ? "ON" : "OFF",
            })),
          ],
        };
      });

      setZones(zonesWithMachines);
      if (zonesWithMachines.length > 0) setSelectedZone(zonesWithMachines[0].id);
    };

    fetchZonesAndMachines();
  }, []);

  const scrollToZone = (zoneId) => {
    const zoneElement = document.getElementById(`zone-${zoneId}`);
    if (zoneElement) {
      const yOffset = -110; // Offset ajustado para compensar el navbar fijo
      const y =
        zoneElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleZoneSelect = (zoneId) => {
    setSelectedZone(zoneId);
    scrollToZone(zoneId); // Desplazarse a la zona seleccionada
  };

  return (
    <div className="min-h-screen bg-blue-100 text-black w-full">
      <Navbar onZoneSelect={handleZoneSelect} />
      <div className="pt-40 max-w-7xl mx-auto py-8 px-4">
        {zones.map((zone) => (
          <div
            id={`zone-${zone.id}`}
            key={zone.id}
            className={`mb-12 ${
              selectedZone === zone.id
                ? "bg-blue-200 rounded-lg p-6 shadow-xl"
                : "bg-blue-100"
            }`}
            style={{ minHeight: "350px" }} // Asegura que la zona tenga un tamaño mínimo en móvil
          >
            <h2 className="text-4xl font-bold mb-6">{zone.name}</h2>
            <div className="flex flex-wrap gap-6">
              {zone.machines.map((machine) => (
                <div
                  key={machine.id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4"
                >
                  <MachineCard machine={machine} onSelect={setSelectedMachine} />
                </div>
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
