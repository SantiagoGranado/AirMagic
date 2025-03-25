// Navbar.jsx
import React, { useEffect, useState } from "react";
// Importamos algunos iconos de react-icons
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineAreaChart } from "react-icons/ai";

const Navbar = () => {
  // Estado para manejar la hora actual
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formato de hora en español
  const timeString = currentTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Datos ficticios de la sonda exterior
  const exteriorTemperature = 20; // Cambia esto según tu API o props
  const exteriorHumidity = 40;    // Cambia esto según tu API o props

  return (
    <nav className="bg-gray-50 px-4 py-3 shadow-md flex items-center justify-between">
      {/* Sección izquierda: Hora actual y sonda exterior */}
      <div className="flex items-center space-x-6">
        <span className="font-bold text-lg">{timeString}</span>
        <div className="flex items-center space-x-2">
          <span className="font-bold">Sonda Exterior:</span>
          <span>
            {exteriorTemperature}°C / {exteriorHumidity}%
          </span>
        </div>
      </div>

      {/* Botones de selección de zonas */}
      <div className="flex items-center space-x-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
          1
        </button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
          2
        </button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
          3
        </button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
          4
        </button>
      </div>

      {/* Botones: Reportes, Diagnósticos y Gráficos como iconos */}
      <div className="flex items-center space-x-2">
        <button className="bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-pointer">
          <HiOutlineDocumentReport size={20} />
        </button>
        <button className="bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-pointer">
          <MdOutlineErrorOutline size={20} />
        </button>
        <button className="bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-pointer">
          <AiOutlineAreaChart size={20} />
        </button>
      </div>

      {/* Sección derecha: Ayuda y Perfil */}
      <div className="flex items-center space-x-2">
        <button className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 cursor-pointer">
          Ayuda
        </button>
        <button className="bg-gray-300 p-1 rounded-full hover:bg-gray-400 cursor-pointer">
          <img
            src="./img/default.png"
            alt="Perfil"
            className="w-8 h-8 rounded-full"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
