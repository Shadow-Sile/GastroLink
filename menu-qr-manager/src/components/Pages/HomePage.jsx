import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllMenus } from '../services/MenuService';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // Cargar los menús del usuario
        loadUserMenus(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const loadUserMenus = async (userId) => {
    try {
      const userMenus = await getAllMenus(userId);
      setMenus(userMenus);
    } catch (error) {
      console.error("Error al cargar los menús:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {!user ? (
          // Contenido para usuarios no autenticados
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h1 className="text-4xl font-bold text-blue-600 mb-4">Bienvenido a GastroLink</h1>
              <p className="text-xl text-gray-700 mb-6">
                La plataforma definitiva para gestionar tus menús digitales con códigos QR
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link 
                  to="/login" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Registrarse
                </Link>
              </div>
            </div>
            
            {/* Características */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-500 text-4xl mb-4">
                  <i className="fas fa-qrcode"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Códigos QR Dinámicos</h3>
                <p className="text-gray-600">Genera códigos QR que puedes actualizar sin necesidad de reimprimir</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-500 text-4xl mb-4">
                  <i className="fas fa-edit"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Editor de Menús Intuitivo</h3>
                <p className="text-gray-600">Crea y actualiza tus menús con nuestra interfaz fácil de usar</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-500 text-4xl mb-4">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Optimizado para Móviles</h3>
                <p className="text-gray-600">Tus clientes pueden ver tus menús perfectamente en cualquier dispositivo</p>
              </div>
            </div>
          </div>
        ) : (
          // Contenido para usuarios autenticados
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Mis Menús</h1>
              <Link 
                to="/menu/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Crear Nuevo Menú
              </Link>
            </div>
            
            {menus.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Aún no has creado ningún menú</h2>
                <p className="text-gray-600 mb-6">
                  Crea tu primer menú para comenzar a disfrutar de las ventajas de GastroLink
                </p>
                <Link 
                  to="/menu/create" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Crear Mi Primer Menú
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus.map((menu) => (
                  <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-2">{menu.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Última actualización: {new Date(menu.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between">
                        <Link 
                          to={`/menu/edit/${menu.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Editar
                        </Link>
                        <Link 
                          to={`/menu/view/${menu.id}`}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Ver / QR
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;