import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMenuById, updateMenu } from '../services/MenuService';
import { generateQrCode } from '../services/QrService';

const MenuEditPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  
  const [menu, setMenu] = useState({
    name: '',
    description: '',
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Cargar datos del menú
  useEffect(() => {
    const loadMenu = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const menuData = await getMenuById(menuId);
        
        // Verificar que el menú pertenece al usuario actual
        if (menuData.userId !== auth.currentUser.uid) {
          setError('No tienes permiso para editar este menú');
          navigate('/');
          return;
        }
        
        setMenu(menuData);
        
        // Generar URL para ver el menú
        const menuUrl = `${window.location.origin}/menu/view/${menuId}`;
        const qrCode = await generateQrCode(menuUrl);
        setQrCodeUrl(qrCode);
      } catch (err) {
        console.error('Error al cargar el menú:', err);
        setError('Error al cargar el menú. Por favor, inténtalo de nuevo');
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [menuId, navigate, auth]);

  // Manejadores para las actualizaciones del formulario
  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setMenu(prevMenu => ({
      ...prevMenu,
      [name]: value
    }));
  };

  const handleCategoryChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCategories = [...menu.categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [name]: value
    };
    
    setMenu(prevMenu => ({
      ...prevMenu,
      categories: updatedCategories
    }));
  };

  const handleItemChange = (categoryIndex, itemIndex, e) => {
    const { name, value } = e.target;
    const updatedCategories = [...menu.categories];
    updatedCategories[categoryIndex].items[itemIndex] = {
      ...updatedCategories[categoryIndex].items[itemIndex],
      [name]: value
    };
    
    setMenu(prevMenu => ({
      ...prevMenu,
      categories: updatedCategories
    }));
  };

  // Añadir/eliminar categorías e items
  const addCategory = () => {
    setMenu(prevMenu => ({
      ...prevMenu,
      categories: [
        ...prevMenu.categories,
        {
          name: 'Nueva Categoría',
          items: []
        }
      ]
    }));
  };

  const removeCategory = (index) => {
    const updatedCategories = [...menu.categories];
    updatedCategories.splice(index, 1);
    
    setMenu(prevMenu => ({
      ...prevMenu,
      categories: updatedCategories
    }));
  };

  const addItem = (categoryIndex) => {
    const updatedCategories = [...menu.categories];
    updatedCategories[categoryIndex].items.push({
      name: '',
      description: '',
      price: ''
    });
    
    setMenu(prevMenu => ({
      ...prevMenu,
      categories: updatedCategories
    }));
  };

  const removeItem = (categoryIndex, itemIndex) => {
    const updatedCategories = [...menu.categories];
    updatedCategories[categoryIndex].items.splice(itemIndex, 1);
    
    setMenu(prevMenu => ({
      ...prevMenu,
      categories: updatedCategories
    }));
  };

  // Guardar menú
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateMenu(menuId, menu);
      setSuccess('Menú actualizado correctamente');
      
      // Actualizar QR con la nueva información
      const menuUrl = `${window.location.origin}/menu/view/${menuId}`;
      const qrCode = await generateQrCode(menuUrl);
      setQrCodeUrl(qrCode);
    } catch (err) {
      console.error('Error al guardar el menú:', err);
      setError('Error al guardar el menú. Por favor, inténtalo de nuevo');
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Editar Menú</h1>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/menu/view/${menuId}`)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                Ver Menú
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                Volver
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Nombre del Menú
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={menu.name}
                    onChange={handleMenuChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={menu.description}
                    onChange={handleMenuChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Código QR del Menú</h3>
                
                {qrCodeUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 mb-3" />
                    <div className="flex space-x-2">
                      <a 
                        href={qrCodeUrl} 
                        download={`menu-${menuId}.png`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded transition duration-300"
                      >
                        Descargar QR
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/menu/view/${menuId}`);
                          setSuccess('Enlace copiado al portapapeles');
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded transition duration-300"
                      >
                        Copiar URL
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center">
                    Guarda el menú para generar el código QR
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Categorías</h2>
                <button
                  type="button"
                  onClick={addCategory}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded transition duration-300"
                >
                  + Añadir Categoría
                </button>
              </div>
              
              {menu.categories.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No hay categorías en este menú</p>
                  <button
                    type="button"
                    onClick={addCategory}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Añadir Primera Categoría
                  </button>
                </div>
              ) : (
                menu.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Nombre de la Categoría
                        </label>
                        <div className="flex items-center">
                          <input
                            name="name"
                            type="text"
                            value={category.name}
                            onChange={(e) => handleCategoryChange(categoryIndex, e)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeCategory(categoryIndex)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md font-medium text-gray-700">Platos en esta categoría</h3>
                        <button
                          type="button"
                          onClick={() => addItem(categoryIndex)}
                          className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition duration-300"
                        >
                          + Añadir Plato
                        </button>
                      </div>
                      
                      {category.items && category.items.length > 0 ? (
                        category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="bg-white p-3 rounded mb-3 border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                                <div>
                                  <label className="block text-gray-700 text-xs font-medium mb-1">
                                    Nombre del Plato
                                  </label>
                                  <input
                                    name="name"
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-700 text-xs font-medium mb-1">
                                    Descripción
                                  </label>
                                  <input
                                    name="description"
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-700 text-xs font-medium mb-1">
                                    Precio
                                  </label>
                                  <input
                                    name="price"
                                    type="text"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(categoryIndex, itemIndex)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 border border-dashed border-gray-300 rounded bg-white">
                          <p className="text-gray-500 text-sm mb-2">No hay platos en esta categoría</p>
                          <button
                            type="button"
                            onClick={() => addItem(categoryIndex)}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition duration-300"
                          >
                            Añadir Plato
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={saving}
                className={`w-full max-w-md flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {saving ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MenuEditPage;