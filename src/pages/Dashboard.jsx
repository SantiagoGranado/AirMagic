// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext.jsx";
import useZones from "../hooks/useZones.jsx";
import Navbar from "../components/Navbar.jsx";
import MachineCard from "../components/MachineCard.jsx";
import ModalMachine from "../components/ModalMachine.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const { zones: rawZones, loading: zonesLoading } = useZones();
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Estado para saber si aún estamos cargando las máquinas por zona
  const [loadingMachines, setLoadingMachines] = useState(true);
  // Estado para controlar el timeout de 5 segundos
  const [timeoutReached, setTimeoutReached] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Al montar, empezamos el timeout de 5s
    timerRef.current = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);

    // Limpiar en unmount
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // Si ya hemos cargado las máquinas antes de que expire el timeout, limpiamos el timer
    if (!loadingMachines) {
      clearTimeout(timerRef.current);
    }
  }, [loadingMachines]);

  useEffect(() => {
    // Si todavía están cargando las zonas, o no hay zonas, o no hay usuario, salimos
    if (zonesLoading || !rawZones.length || !user) return;

    const fetchZonesAndMachines = async () => {
      setLoadingMachines(true);
      const userId = user.id;

      const { data: ecoMachines = [], error: ecoError } = await supabase
        .from("MaquinasEco")
        .select("*")
        .eq("usuario_id", userId);
      if (ecoError) {
        console.error(ecoError);
      }

      const { data: extMachines = [], error: extError } = await supabase
        .from("MaquinasExt")
        .select("*")
        .eq("usuario_id", userId);
      if (extError) {
        console.error(extError);
      }

      const zonesWithMachines = rawZones.map((zona) => {
        const eco = ecoMachines.filter((m) => m.zona_id === zona.id);
        const ext = extMachines.filter((m) => m.zona_id === zona.id);

        const mapMachine = (m, type) => ({
          id: m.id,
          name: `${type === "eco" ? "ECO" : "EXT"} ${m.numero}`,
          type,
          temperature: type === "eco" ? m.temperatura_imp : null,
          status: m.estado === 1 ? "ON" : "OFF",
          avisos: m.avisos === true || m.avisos === 1 || m.avisos === "ON",
          alarmas:
            m.alarmas === true || m.alarmas === 1 || m.alarmas === "ON",
        });

        return {
          id: zona.id,
          name: zona.nombre,
          machines: [
            ...eco.map((m) => mapMachine(m, "eco")),
            ...ext.map((m) => mapMachine(m, "ext")),
          ],
        };
      });

      setZones(zonesWithMachines);
      setLoadingMachines(false);

      // Si no hay zona seleccionada y existen zonas, seleccionamos la primera
      if (!selectedZone && zonesWithMachines.length > 0) {
        setSelectedZone(zonesWithMachines[0].id);
      }
    };

    fetchZonesAndMachines();
  }, [rawZones, zonesLoading, user]);

  const scrollToZone = (zoneId) => {
    const el = document.getElementById(`zone-${zoneId}`);
    if (!el) return;
    const yOffset = -110;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleZoneSelect = (zoneId) => {
    setSelectedZone(zoneId);
    scrollToZone(zoneId);
  };

  // Comprobamos si hay al menos una máquina en todas las zonas
  const hasMachines = zones.some((zone) => zone.machines.length > 0);

  // Estado combinado de carga
  const stillLoading = zonesLoading || loadingMachines;

  // Lógica de renderizado:
  // 1) Si todavía estamos cargando y NO se ha cumplido el timeout (5s), mostramos spinner
  if (stillLoading && !timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <LoadingSpinner />
      </div>
    );
  }

  // 2) Si NO hay máquinas (después de cargar o tras timeout) mostramos mensaje
  if (!hasMachines) {
    return (
      <div className="min-h-screen bg-blue-50 text-black w-full">
        <Navbar onZoneSelect={handleZoneSelect} />
        <div className="pt-40 max-w-7xl mx-auto py-8 px-4">
          <p className="text-center text-xl text-gray-600">
            El técnico aún no ha instalado las máquinas.{" "}
            Estamos trabajando en la instalación; en breves estarán disponibles.
          </p>
        </div>
      </div>
    );
  }

  // 3) Si ya cargó y hay máquinas, mostramos el dashboard normal
  return (
    <div className="min-h-screen bg-blue-50 text-black w-full">
      <Navbar onZoneSelect={handleZoneSelect} />
      <div className="pt-40 max-w-7xl mx-auto py-8 px-4">
        {zones.map((zone) => (
          <div
            id={`zone-${zone.id}`}
            key={zone.id}
            className={`mb-12 bg-blue-100 p-6 rounded-lg shadow-md transition-all duration-300 ${
              selectedZone === zone.id
                ? "bg-blue-200 shadow-xl scale-[1.02]"
                : ""
            }`}
            style={{ minHeight: "350px" }}
          >
            <h2 className="text-4xl font-bold mb-6">{zone.name}</h2>
            <div className="flex flex-wrap gap-6">
              {zone.machines.map((machine) => (
                <div
                  key={machine.id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4"
                >
                  <MachineCard
                    machine={machine}
                    onSelect={setSelectedMachine}
                  />
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
