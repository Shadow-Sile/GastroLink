import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MenuCategory from "@/components/MenuCategory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const ViewMenu = () => {
  const { menuId } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "menus", menuId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMenu({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("El menú que buscas no existe o ha sido eliminado.");
        }
        setLoading(false);
      } catch (err) {
        setError("No se pudo cargar el menú. Por favor, intenta de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-menuOrange mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Menú no encontrado</h2>
          <p className="text-gray-600 mb-6">El menú que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver atrás
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-md py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start flex-wrap">
            {menu.logo && (
              <img 
                src={menu.logo} 
                alt={menu.restaurant}
                className="h-16 w-16 object-contain rounded-full shadow-sm mr-4"
              />
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{menu.restaurant}</h1>
              <p className="text-menuOrange text-lg font-medium">{menu.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="space-y-1 mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800">Nuestro Menú</h2>
          <p className="text-gray-500">Selecciona una categoría para ver sus platos</p>
        </div>

        {menu.categories.map((category) => (
          <MenuCategory key={category.id} name={category.name} items={category.items} />
        ))}
      </main>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-sm text-gray-500">
        <p>Los precios incluyen IVA • Carta actualizada el {new Date().toLocaleDateString('es-ES')}</p>
        <p className="mt-2">Si tienes alergias o intolerancias alimentarias, consulta a nuestro personal.</p>
      </div>
    </div>
  );
};

export default ViewMenu;