
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl font-bold text-blue-600 mb-6">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Página no encontrada</h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Volver al Inicio
          </Link>
          
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">¿Estás buscando alguna de estas páginas?</h2>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Registrarse
              </Link>
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver tus Menús
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;