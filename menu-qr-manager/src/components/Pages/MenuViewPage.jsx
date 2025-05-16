import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMenuById } from '../services/MenuService';
import { generateQrCode } from '../services/QrService';

const MenuViewPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  
  // Cargar datos del menú
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menuData = await getMenuById(menuId);
        
        if (!menuData) {
          setError('El menú solicitado no existe');
          return;
        }
        
        setMenu(menuData);
        
        // Generar URL para ver el menú
        const menuUrl = `${window.location.origin}/menu/view/${menuId}`;
        const qrCode = await generateQrCode(menuUrl);
        setQrCodeUrl(qrCode);
        
        // Verificar si el usuario actual es el propietario del menú
        if (auth.currentUser && menuData.userId === auth.currentUser.uid) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error('Error al cargar el menú:', err);
        setError('Error al cargar el menú. Por favor, inténtalo de nuevo');
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [menuId, auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error || 'No se pudo encontrar el menú solicitado'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              Volver al Inicio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Encabezado del menú con botones de acción */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-blue-600 py-6 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{menu.name}</h1>
              
              {isOwner && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/menu/edit/${menuId}`)}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Editar Menú
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Volver
                  </button>
                </div>
              )}
            </div>
            
            {menu.description && (
              <p className="text-blue-100 mt-2">{menu.description}</p>
            )}
          </div>
          
          {isOwner && (
            <div className="bg-blue-50 p-4 border-t border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 mr-4">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Código QR del Menú</h3>
                      <p className="text-sm text-gray-600">Los clientes pueden escanear para ver este menú</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex mt-3 md:mt-0">
                  <a 
                    href={qrCodeUrl} 
                    download={`menu-${menuId}.png`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded mr-2 transition duration-300"
                  >
                    Descargar QR
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/menu/view/${menuId}`);
                      alert('Enlace copiado al portapapeles');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded transition duration-300"
                  >
                    Copiar URL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Contenido del menú */}
        <div className="mb-8">
          {menu.categories && menu.categories.length > 0 ? (
            menu.categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <div className="border-b-2 border-blue-500 mb-4 pb-2">
                  <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                </div>
                
                {category.items && category.items.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-300"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <span className="text-lg font-bold text-blue-600">{item.price}</span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay platos en esta categoría</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">Este menú está vacío</p>
              {isOwner && (
                <button
                  onClick={() => navigate(`/menu/edit/${menuId}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Añadir Categorías y Platos
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Banner promocional */}
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-blue-500">
          <p className="text-sm text-gray-600">
            Este menú digital fue creado con <span className="font-semibold">GastroLink</span>
          </p>
          {!auth.currentUser && (
            <p className="text-sm mt-1">
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Crea tu propio menú digital con códigos QR
              </Link>
            </p>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MenuViewPage;