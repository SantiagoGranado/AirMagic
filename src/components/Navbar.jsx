import React, { useEffect, useState } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineAreaChart } from "react-icons/ai";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Datos ficticios para la sonda exterior
  const exteriorTemperature = 20;
  const exteriorHumidity = 40;

  return (
    <nav className="bg-white px-6 py-4 shadow-md flex flex-col md:flex-row items-center justify-between">
      {/* Sección izquierda: Hora y sonda */}
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
        <span className="font-bold text-2xl">{timeString}</span>
        <div className="flex items-center space-x-3">
          <span className="font-bold text-xl">Sonda Exterior:</span>
          <span className="text-xl">
            {exteriorTemperature}°C / {exteriorHumidity}%
          </span>
        </div>
      </div>

      {/* Selección de zonas */}
      <div className="flex flex-wrap items-center justify-center space-x-3 my-3 md:my-0">
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-xl">
          1
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-xl">
          2
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-xl">
          3
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-xl">
          4
        </button>
      </div>

      {/* Botones de iconos: Reportes, Diagnósticos y Gráficos */}
      <div className="flex items-center space-x-3">
        <button className="bg-gray-200 p-3 rounded hover:bg-gray-300 cursor-pointer">
          <HiOutlineDocumentReport size={26} />
        </button>
        <button className="bg-gray-200 p-3 rounded hover:bg-gray-300 cursor-pointer">
          <MdOutlineErrorOutline size={26} />
        </button>
        <button className="bg-gray-200 p-3 rounded hover:bg-gray-300 cursor-pointer">
          <AiOutlineAreaChart size={26} />
        </button>
      </div>

      {/* Ayuda y Perfil */}
      <div className="flex items-center space-x-3">
        <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer text-xl">
          Ayuda
        </button>
        <button className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 cursor-pointer">
          <img
            src="img/default.png"
            alt="Perfil"
            className="w-10 h-10 rounded-full"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
