// src/components/HistoryModal.jsx
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { supabase } from "../supabase.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function HistoryModal({ onClose }) {
  const { user } = useAuth();
  const [tab, setTab]         = useState("alarmas");
  const [alarmas, setAlarmas] = useState([]);
  const [avisos, setAvisos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [{ data: aData, error: aErr }, { data: vData, error: vErr }] =
        await Promise.all([
          supabase
            .from("HistorialAlarmas")
            .select("id, maquina_id, maquina_tipo, codigo_error, ocurrido_en")
            .eq("usuario_id", user.id)
            .order("ocurrido_en", { ascending: false }),
          supabase
            .from("HistorialAvisos")
            .select("id, maquina_id, maquina_tipo, codigo_aviso, ocurrido_en")
            .eq("usuario_id", user.id)
            .order("ocurrido_en", { ascending: false }),
        ]);
      if (!aErr) setAlarmas(aData);
      if (!vErr) setAvisos(vData);
      setLoading(false);
    })();
  }, [user]);

  return (
    // Overlay: click here to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal content: prevent clicks inside from closing */}
      <div
        className="relative bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500  cursor-pointer hover:text-gray-700"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {["alarmas", "avisos"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 -mb-px ${
                tab === t
                  ? "border-b-2 border-blue-600 font-semibold cursor-pointer"
                  : "text-gray-500 cursor-pointer"
              }`}
            >
              {t === "alarmas" ? "Alarmas" : "Avisos"}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Cargando historial…</p>
        ) : tab === "alarmas" ? (
          alarmas.length === 0 ? (
            <p>No hay registros de alarmas para tu usuario.</p>
          ) : (
            <ul className="space-y-3">
              {alarmas.map((a) => (
                <li key={a.id} className="p-3 bg-red-50 rounded">
                  <p className="text-sm text-gray-600">
                    {new Date(a.ocurrido_en).toLocaleString()}
                  </p>
                  <p className="font-medium">[{a.codigo_error}]</p>
                  <p className="text-xs text-gray-500">
                    Máquina {a.maquina_tipo.toUpperCase()} — ID: {a.maquina_id}
                  </p>
                </li>
              ))}
            </ul>
          )
        ) : avisos.length === 0 ? (
          <p>No hay registros de avisos para tu usuario.</p>
        ) : (
          <ul className="space-y-3">
            {avisos.map((v) => (
              <li key={v.id} className="p-3 bg-yellow-50 rounded">
                <p className="text-sm text-gray-600">
                  {new Date(v.ocurrido_en).toLocaleString()}
                </p>
                <p className="font-medium">[{v.codigo_aviso}]</p>
                <p className="text-xs text-gray-500">
                  Máquina {v.maquina_tipo.toUpperCase()} — ID: {v.maquina_id}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
