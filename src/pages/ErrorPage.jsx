import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/login');  // Redirige al login principal
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-400">Error 404</h1>
        <p className="mt-4 text-xl">La página que buscas no existe.</p>
        <button
          onClick={handleRedirect}
          className="mt-6 cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
