import React, { useEffect, useState } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineAreaChart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";  // Importa Link de react-router-dom
import { supabase } from "../supabase"; // Asegúrate de importar el cliente supabase

const Navbar = ({ onZoneSelect }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [zones, setZones] = useState([]); // Para almacenar las zonas obtenidas de la base de datos
  const [profile, setProfile] = useState(null); // Estado para almacenar datos del perfil del usuario

  // Actualiza la hora cada segundo
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

  // Obtener las zonas desde la base de datos (desde Supabase)
  useEffect(() => {
    const fetchZones = async () => {
      const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage

      if (userId) {
        // Obtener las zonas asociadas al usuario
        const { data: zonesData, error } = await supabase
          .from("Zonas")
          .select("*")
          .eq("usuario_id", userId); // Filtrar zonas por el usuario

        if (error) {
          console.error("Error al obtener zonas:", error);
          return;
        }

        setZones(zonesData); // Actualiza el estado con las zonas obtenidas
      }
    };

    fetchZones();
  }, []); // Solo se ejecuta al cargar el componente

  // Obtener datos del perfil del usuario, en este caso la foto de perfil (campo "foto_url")
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const { data, error } = await supabase
          .from("Usuarios")   // Asegúrate de que el nombre de la tabla es correcto
          .select("foto_url")
          .eq("id", userId)
          .single();
        if (error) {
          console.error("Error al obtener el perfil:", error);
          return;
        }
        setProfile(data);
      }
    };

    fetchProfile();
  }, []); // Solo se ejecuta al cargar el componente

  // Definir la fuente de la imagen de perfil según si está definida en el perfil o usar la imagen por defecto
  const profilePictureSrc = profile?.foto_url || "img/default.png";

  const exteriorTemperature = 20;
  const exteriorHumidity = 40;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Sección izquierda: Hora y sonda */}
        <div className="flex items-center">
          <span className="font-bold text-2xl">{timeString}</span>
          <div className="ml-4 flex items-center space-x-2">
            <span className="font-bold text-lg">Sonda Exterior:</span>
            <span className="text-lg">
              {exteriorTemperature}°C / {exteriorHumidity}%
            </span>
          </div>
        </div>

        {/* Botón de menú para móvil */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl focus:outline-none"
          >
            {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Menú completo en desktop */}
        <div className="hidden md:flex items-center space-x-3">
          {zones.map((zone) => (
            <button
              key={zone.id}
              className="bg-blue-500 text-white px-4 py-2 rounded text-xl cursor-pointer"
              onClick={() => onZoneSelect(zone.id)}
            >
              {zone.nombre}
            </button>
          ))}
          <button className="bg-gray-200 p-3 rounded hover:bg-gray-300 cursor-pointer">
            <HiOutlineDocumentReport size={26} />
          </button>
          <button className="bg-gray-200 p-3 rounded hover:bg-gray-300 cursor-pointer">
            <MdOutlineErrorOutline size={26} />
          </button>
          <button className="bg-gray-200 p-3 rounded hover:bg-gray-300 cursor-pointer">
            <AiOutlineAreaChart size={26} />
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-xl cursor-pointer">
            Ayuda
          </button>
          {/* Redirigir a la página de perfil y mostrar la foto de perfil si está disponible */}
          <Link to="/profile">
            <button className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 cursor-pointer">
              <img
                src={profilePictureSrc}
                alt="Perfil"
                className="w-10 h-10 rounded-full"
              />
            </button>
          </Link>
        </div>
      </div>

      {/* Menú desplegable para móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-wrap justify-around">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-xl flex-1 m-1"
                  onClick={() => {
                    onZoneSelect(zone.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {zone.nombre}
                </button>
              ))}
            </div>
            <div className="flex justify-around mt-3">
              <button className="bg-gray-200 p-3 rounded hover:bg-gray-300">
                <HiOutlineDocumentReport size={26} />
              </button>
              <button className="bg-gray-200 p-3 rounded hover:bg-gray-300">
                <MdOutlineErrorOutline size={26} />
              </button>
              <button className="bg-gray-200 p-3 rounded hover:bg-gray-300">
                <AiOutlineAreaChart size={26} />
              </button>
            </div>
            <div className="flex justify-around mt-3">
              <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-xl">
                Ayuda
              </button>
              {/* Redirigir a la página de perfil en móvil y mostrar la foto de perfil */}
              <Link to="/profile">
                <button className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 cursor-pointer">
                  <img
                    src={profilePictureSrc}
                    alt="Perfil"
                    className="w-10 h-10 rounded-full"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
