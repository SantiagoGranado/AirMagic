// Navbar.jsx
import React, { useEffect, useState } from "react";

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
    <nav className="bg-white px-4 py-3 shadow-md flex items-center justify-between">
      {/* Sección izquierda: Hora actual y sonda exterior */}
      <div className="flex items-center space-x-6">
        {/* Hora actual */}
        <span className="font-bold text-lg">{timeString}</span>
        
        {/* Sonda Exterior */}
        <div className="flex items-center space-x-2">
          <span className="font-bold">Sonda Exterior:</span>
          <span>{exteriorTemperature}°C / {exteriorHumidity}%</span>
        </div>
      </div>

      {/* Botones de selección de zonas */}
      <div className="flex items-center space-x-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded">1</button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">2</button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">3</button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">4</button>
        {/* Agrega más zonas si lo requieres */}
      </div>

      {/* Botones: Reportes, Diagnósticos y Gráficos */}
      <div className="flex items-center space-x-2">
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          Reportes
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          Diagnósticos
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          Gráficos
        </button>
      </div>

      {/* Sección derecha: Ayuda y Perfil */}
      <div className="flex items-center space-x-2">
        <button className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
          Ayuda
        </button>
        <button className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
          Perfil
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
