import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaThermometerHalf } from "react-icons/fa";

const ModalMachine = ({ machine, onClose }) => {
  if (!machine) return null;

  const { id, name, type } = machine;
  const ecoImage = "/img/eco.png";
  const extImage = "/img/ext.png";
  const machineImage = type === "eco" ? ecoImage : extImage;

  const [status, setStatus] = useState(null);
  const [selectedMode, setSelectedMode] = useState("auto");

  useEffect(() => {
    const fetchStatus = async () => {
      const table = type === "eco" ? "MaquinasEco" : "MaquinasExt";

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error cargando datos de la máquina:", error);
        return;
      }

      setStatus(data);

      // Set mode visual desde el estado numérico
      const modoTexto = {
        0: "auto",
        1: "manual",
        2: "manual_bomba",
        3: "power",
      }[data.estado];
      setSelectedMode(modoTexto);
    };

    fetchStatus();
  }, [id, type]);

  const handleSetEstado = async (modo) => {
    const estados = {
      auto: 0,
      manual: 1,
      manual_bomba: 2,
      power: 3,
    };

    const valor = estados[modo];
    const table = type === "eco" ? "MaquinasEco" : "MaquinasExt";

    const { error } = await supabase
      .from(table)
      .update({ estado: valor })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando estado:", error);
    } else {
      setStatus((prev) => ({ ...prev, estado: valor }));
      setSelectedMode(modo);
    }
  };

  const handleSliderChange = async (field, value) => {
    setStatus((prev) => ({ ...prev, [field]: value }));

    const table = type === "eco" ? "MaquinasEco" : "MaquinasExt";
    const { error } = await supabase
      .from(table)
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error(`Error actualizando ${field}:`, error);
    }
  };

  const getButtonClass = (mode) => {
    const base = "py-2 px-4 rounded text-base sm:text-lg transition cursor-pointer";
    return selectedMode === mode
      ? `bg-blue-500 text-white font-semibold ${base}`
      : `bg-gray-200 hover:bg-gray-300 ${base}`;
  };

  if (!status) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded shadow-lg">
          <p className="text-lg">Cargando datos de la máquina...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-0 sm:px-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-screen h-screen md:h-auto md:w-full md:max-w-6xl bg-white rounded-none md:rounded-2xl shadow-[0_10px_60px_rgba(0,0,0,0.3)] max-h-screen md:max-h-[90vh] overflow-y-auto z-10 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center">
          {type.toUpperCase()} - {name}
        </h2>

        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6">
          {/* Modos */}
          <div className="flex flex-col space-y-3 w-full lg:w-1/4">
            <button onClick={() => handleSetEstado("auto")} className={getButtonClass("auto")}>Auto</button>
            {type === "eco" && (
              <>
                <button onClick={() => handleSetEstado("manual")} className={getButtonClass("manual")}>Manual</button>
                <button onClick={() => handleSetEstado("manual_bomba")} className={getButtonClass("manual_bomba")}>Manual + Bomba</button>
              </>
            )}
            <button onClick={() => handleSetEstado("power")} className={getButtonClass("power")}>Power</button>
          </div>

          {/* Imagen y sliders */}
          <div className="flex flex-row items-center justify-center gap-4 flex-shrink-0">
            {/* Slider velocidad mínima */}
            <div className="h-48 flex items-center justify-center w-10 shrink-0">
              <input
                type="range"
                min="0"
                max="16"
                value={status.velocidad_min}
                onChange={(e) => handleSliderChange("velocidad_min", parseInt(e.target.value))}
                className="w-40 transform -rotate-90 accent-cyan-500"
              />
            </div>

            {/* Imagen */}
            <div className="bg-gray-100 w-48 h-48 flex items-center justify-center rounded-lg">
              <img src={machineImage} alt={`${type} machine`} className="object-contain w-40 h-40" />
            </div>

            {/* Slider velocidad máxima */}
            <div className="h-48 flex items-center justify-center w-10 shrink-0">
              <input
                type="range"
                min="0"
                max="16"
                value={status.velocidad_max}
                onChange={(e) => handleSliderChange("velocidad_max", parseInt(e.target.value))}
                className="w-40 transform -rotate-90 accent-emerald-400"
              />
            </div>
          </div>

          {/* Estado de sensores */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base">
              <div className="flex justify-between bg-gray-100 p-2 rounded">
                <span>Alarmas</span>
                <span className={`text-white px-2 rounded-full ${status.alarmas ? "bg-green-500" : "bg-gray-400"}`}>
                  {status.alarmas ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex justify-between bg-gray-100 p-2 rounded">
                <span>Avisos</span>
                <span className={`text-white px-2 rounded-full ${status.avisos ? "bg-green-500" : "bg-gray-400"}`}>
                  {status.avisos ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex justify-between bg-gray-100 p-2 rounded">
                <span>Velocidad actual</span>
                <span className="font-semibold">{status.velocidad_actual} / 16</span>
              </div>

              {type === "eco" && (
                <>
                  <div className="flex justify-between bg-gray-100 p-2 rounded">
                    <span>Electroválvula llenado</span>
                    <span className={`text-white px-2 rounded-full ${status.llenado ? "bg-green-500" : "bg-gray-400"}`}>
                      {status.llenado ? "ON" : "OFF"}
                    </span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-2 rounded">
                    <span>Electroválvula vaciado</span>
                    <span className={`text-white px-2 rounded-full ${status.vaciado ? "bg-green-500" : "bg-gray-400"}`}>
                      {status.vaciado ? "ON" : "OFF"}
                    </span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-2 rounded">
                    <span>Nivel agua cubeta</span>
                    <span className="font-semibold">{status.nivel_agua}</span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-2 rounded">
                    <span className="flex items-center gap-1">
                      <FaThermometerHalf /> Temperatura
                    </span>
                    <span className="font-semibold">{status.temperatura_imp} °C</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Botón cerrar */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded text-lg font-semibold transition cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMachine;
