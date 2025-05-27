// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { MdOutlineErrorOutline, MdHelp } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useZones from "../hooks/useZones.jsx";
import { supabase } from "../supabase.js";
import HistoryModal from "./HistoryModal.jsx";

export default function Navbar({ onZoneSelect }) {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl]               = useState("/img/default.png");
  const [currentTime, setCurrentTime]           = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { zones, loading: zonesLoading, error: zonesError } = useZones();

  const [isHelpOpen, setIsHelpOpen]       = useState(false);
  const [sonda, setSonda]                 = useState({ temperatura: null, humedad: null });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 1) Reloj
  useEffect(() => {
    const iv = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // 2) Avatar
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("Usuarios")
        .select("foto_url")
        .eq("id", user.id)
        .single();
      if (!error && data?.foto_url) {
        const { data: urlData } = supabase
          .storage
          .from("avatars")
          .getPublicUrl(data.foto_url);
        setAvatarUrl(urlData.publicUrl);
      }
    })();
  }, [user]);

  // 3) Sonda exterior
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("SondaExterior")
        .select("temperatura, humedad")
        .eq("usuario_id", user.id)
        .single();
      if (!error && data) {
        setSonda({ temperatura: data.temperatura, humedad: data.humedad });
      }
    })();
  }, [user]);

  const timeString = currentTime.toLocaleTimeString("es-ES", {
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // handlers
  const openHelp     = () => setIsHelpOpen(true);
  const closeHelp    = () => setIsHelpOpen(false);
  const openHistory  = () => setIsHistoryOpen(true);
  const closeHistory = () => setIsHistoryOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Hora y Sonda Exterior */}
          <div className="flex items-center space-x-6">
            <span className="text-2xl font-bold text-gray-800">{timeString}</span>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-semibold text-lg">Sonda Exterior:</span>
              <span className="text-lg">
                {sonda.temperatura != null && sonda.humedad != null
                  ? `${sonda.temperatura.toFixed(1)}°C / ${sonda.humedad.toFixed(1)}%`
                  : "–"}
              </span>
            </div>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-3xl text-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {zonesLoading ? (
              <span className="text-gray-400 italic">Cargando zonas...</span>
            ) : zonesError ? (
              <span className="text-red-500 italic">Error cargando zonas</span>
            ) : (
              zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => onZoneSelect(zone.id)}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold px-4 py-2 rounded transition text-lg"
                >
                  {zone.nombre}
                </button>
              ))
            )}

            {/* Historial */}
            <button
              onClick={openHistory}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
              title="Historial de Alarmas y Avisos"
            >
              <MdOutlineErrorOutline size={24} />
            </button>

            {/* Ayuda */}
            <button
              onClick={openHelp}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
              title="Ayuda"
            >
              <MdHelp size={24} />
            </button>

            {/* Perfil */}
            <Link to="/profile">
              <img
                src={avatarUrl}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-gray-400"
              />
            </Link>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
            <div className="flex flex-col p-4 space-y-4">
              {zonesLoading ? (
                <span className="text-gray-400 italic text-center">Cargando zonas...</span>
              ) : zonesError ? (
                <span className="text-red-500 italic text-center">Error cargando zonas</span>
              ) : (
                zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      onZoneSelect(zone.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded text-lg"
                  >
                    {zone.nombre}
                  </button>
                ))
              )}
              <div className="flex justify-around pt-4 border-t border-gray-300">
                <button
                  onClick={openHistory}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <MdOutlineErrorOutline size={24} />
                </button>
                <button
                  onClick={openHelp}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <MdHelp size={24} />
                </button>
                <Link to="/profile">
                  <img
                    src={avatarUrl}
                    alt="Perfil"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modal de Ayuda (original) */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-8xl p-6 overflow-auto h-[80vh]">
            <button
              onClick={closeHelp}
              className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={24} />
            </button>

            {/* Desktop */}
            <img
              src="./public/img/tutorial.png"
              alt="Tutorial"
              className="hidden md:block w-full h-full object-contain rounded"
            />

            {/* Mobile */}
            <div className="block md:hidden fixed inset-0 z-50 bg-white overflow-x-auto overflow-y-auto">
              <button
                onClick={closeHelp}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <AiOutlineClose size={28} />
              </button>
              <div className="min-w-[1000px] h-full flex justify-center items-center p-4">
                <img
                  src="../public/img/tutorial.png"
                  alt="Tutorial Móvil"
                  className="w-[1000px] max-w-none object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial */}
      {isHistoryOpen && <HistoryModal onClose={closeHistory} />}
    </>
  );
}
