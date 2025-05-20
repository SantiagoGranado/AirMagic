// src/components/ModalMachine.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaThermometerHalf } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const ModalMachine = ({ machine, onClose }) => {
  if (!machine) return null;

  const { id, name, type } = machine;
  const ecoImage = "/img/eco.png";
  const extImage = "/img/ext.png";
  const machineImage = type === "eco" ? ecoImage : extImage;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [status, setStatus] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedMode, setSelectedMode] = useState("auto");
  
  // Estilo CSS para el parpadeo más rápido
  const pulseStyle = {
    animation: "pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  };
  
  // Definición de la animación de parpadeo rápido
  const pulseKeyframes = `
    @keyframes pulse-fast {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
      const modoTexto = type === "eco"
        ? { 0: "auto", 1: "manual", 2: "manual_bomba", 3: "power" }[data.estado]
        : { 0: "auto", 1: "manual_ext", 2: "off" }[data.estado];
      setSelectedMode(modoTexto);
    };
    fetchStatus();
  }, [id, type]);

  const handleSetEstado = async (modo) => {
    const estados = type === "eco"
      ? { auto: 0, manual: 1, manual_bomba: 2, power: 3 }
      : { auto: 0, manual_ext: 1, off: 2 };
    const valor = estados[modo];
    const table = type === "eco" ? "MaquinasEco" : "MaquinasExt";
    await supabase.from(table).update({ estado: valor }).eq("id", id);
    setStatus((prev) => ({ ...prev, estado: valor }));
    setSelectedMode(modo);
  };

  const handleSliderChange = async (field, value) => {
    setStatus((prev) => ({ ...prev, [field]: value }));
    const table = type === "eco" ? "MaquinasEco" : "MaquinasExt";
    await supabase.from(table).update({ [field]: value }).eq("id", id);
  };

  // Nueva función para manejar el toggle de la válvula de llenado
  const handleToggleLlenado = async () => {
    if (type !== "eco") return;
    
    const newValue = !status.llenado;
    setStatus((prev) => ({ ...prev, llenado: newValue }));
    
    const { error } = await supabase
      .from("MaquinasEco")
      .update({ llenado: newValue })
      .eq("id", id);
      
    if (error) {
      console.error("Error al actualizar válvula de llenado:", error);
      // Revertir en caso de error
      setStatus((prev) => ({ ...prev, llenado: !newValue }));
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
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-0 sm:px-6">
      <style>{pulseKeyframes}</style>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-screen h-screen md:h-auto md:w-full md:max-w-6xl bg-white rounded-none md:rounded-2xl shadow-lg max-h-screen md:max-h-[90vh] overflow-y-auto z-10 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center">
          {type.toUpperCase()} - {name}
        </h2>

        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6">
          {/* Modos */}
          <div className="flex flex-col space-y-3 w-full lg:w-1/4">
            <button
              onClick={() => handleSetEstado("auto")}
              className={getButtonClass("auto")}
            >
              Auto
            </button>
            {type === "eco" ? (
              <>
                <button
                  onClick={() => handleSetEstado("manual")}
                  className={getButtonClass("manual")}
                >
                  Manual
                </button>
                <button
                  onClick={() => handleSetEstado("manual_bomba")}
                  className={getButtonClass("manual_bomba")}
                >
                  Manual + Bomba
                </button>
                <button
                  onClick={() => handleSetEstado("power")}
                  className={getButtonClass("power")}
                >
                  Apagada
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSetEstado("manual_ext")}
                  className={getButtonClass("manual_ext")}
                >
                  Manual Ext
                </button>
                <button
                  onClick={() => handleSetEstado("off")}
                  className={getButtonClass("off")}
                >
                  Apagada
                </button>
              </>
            )}
          </div>

          {/* Imagen y sliders */}
          <div className="flex flex-row items-center justify-center gap-4 flex-shrink-0">
            <div className="h-48 flex items-center justify-center w-10 shrink-0">
              <input
                type="range"
                min="0"
                max="15"
                value={status.velocidad_min}
                onChange={(e) =>
                  handleSliderChange("velocidad_min", +e.target.value)
                }
                className="w-40 transform -rotate-90 accent-cyan-500"
              />
            </div>
            <div className="bg-gray-100 w-48 h-48 flex items-center justify-center rounded-lg">
              <img
                src={machineImage}
                alt="machine"
                className="object-contain w-40 h-40"
              />
            </div>
            <div className="h-48 flex items-center justify-center w-10 shrink-0">
              <input
                type="range"
                min="0"
                max="15"
                value={status.velocidad_max}
                onChange={(e) =>
                  handleSliderChange("velocidad_max", +e.target.value)
                }
                className="w-40 transform -rotate-90 accent-emerald-400"
              />
            </div>
          </div>

          {/* Lectura de estados */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>Alarmas</span>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center justify-center h-6 w-6 text-xs text-white rounded-full ${
                    status.alarmas ? "bg-red-500" : "bg-gray-400"
                  }`}
                  style={status.alarmas ? pulseStyle : {}}
                >
                  {status.alarmas ? "ON" : "OFF"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>Avisos</span>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center justify-center h-6 w-6 text-xs text-white rounded-full ${
                    status.avisos ? "bg-yellow-400" : "bg-gray-400"
                  }`}
                  style={status.avisos ? pulseStyle : {}}
                >
                  {status.avisos ? "ON" : "OFF"}
                </span>
              </div>
            </div>
            {type === "eco" && (
              <>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>Valvula de llenado</span>
                  <div className="flex items-center">
                    <button
                      onClick={handleToggleLlenado}
                      className={`inline-flex items-center justify-center h-8 w-16 text-xs text-white rounded-full transition-colors ${
                        status.llenado ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
                      }`}
                    >
                      {status.llenado ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>Vaciado</span>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 text-xs text-white rounded-full ${
                        status.vaciado ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {status.vaciado ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between bg-gray-100 p-2 rounded">
                  <span>Nivel agua cubeta</span>
                  <span className="font-semibold">{status.nivel_agua}</span>
                </div>
                <div className="flex justify-between bg-gray-100 p-2 rounded">
                  <span className="flex items-center gap-1">
                    <FaThermometerHalf /> Temperatura
                  </span>
                  <span className="font-semibold">
                    {status.temperatura_imp} °C
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between bg-gray-100 p-2 rounded">
              <span>Velocidad actual</span>
              <span className="font-semibold">
                {status.velocidad_actual} / 15
              </span>
            </div>
          </div>
        </div>

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