import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import QRCodeDisplay from "@/components/QRCode";

const ViewQR = () => {
  const { menuId } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("standard");

  useEffect(() => {
    // Simular carga de datos desde Firebase
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // En una implementación real, aquí obtendrías los datos de Firebase
        // Por ahora, usamos datos de ejemplo
        setMenu({
          id: menuId || "sample-menu-123",
          name: "Carta Primavera 2023",
          restaurant: "Restaurante El Rincón"
        });
        setLoading(false);
      } catch (err) {
        setError("No se pudieron cargar los datos del menú.");
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  const getQrValue = () => {
    // En una aplicación real, esta sería la URL al menú digital
    return `https://menuqr.app/m/${menuId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-menuOrange mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Menú no encontrado"}</p>
          <Link to="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-menuOrange hover:text-menuOrange-dark">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="ml-4 text-xl font-bold text-gray-900">
                Código QR para {menu.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-6">
            Este código QR dirige a tus clientes directamente a tu carta digital. Puedes imprimirlo, 
            pegarlo en tus mesas o incluirlo en tus materiales promocionales.
          </p>

          <Tabs defaultValue="standard" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="standard">QR Estándar</TabsTrigger>
              <TabsTrigger value="custom">QR Personalizado</TabsTrigger>
            </TabsList>
            <TabsContent value="standard" className="mt-6">
              <div className="flex flex-col items-center">
                <QRCodeDisplay 
                  value={getQrValue()} 
                  title={`${menu.restaurant} - ${menu.name}`}
                />
                <div className="mt-6 text-center max-w-md">
                  <p className="text-sm text-gray-500">
                    Este QR enlaza directamente a tu carta digital. Puedes actualizarla en cualquier momento
                    y los cambios se reflejarán automáticamente, sin necesidad de generar un nuevo código.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="custom" className="mt-6">
              <div className="flex flex-col items-center">
                <Card className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-4">QR Personalizado</h3>
                  <p className="text-gray-600 mb-4">
                    Personaliza tu código QR con colores, logos y diseños para reforzar tu marca.
                    Disponible en los planes Pro y Premium.
                  </p>
                  <Link to="/pricing">
                    <Button className="bg-menuOrange hover:bg-menuOrange-dark">
                      Mejorar Plan
                    </Button>
                  </Link>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Instrucciones para uso</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Descarga el código QR usando el botón correspondiente.</li>
              <li>Imprímelo en la resolución adecuada para mantener su calidad.</li>
              <li>Colócalo en lugares visibles de tu establecimiento.</li>
              <li>Asegúrate de que esté bien iluminado para facilitar su escaneo.</li>
              <li>Actualiza tu carta desde el dashboard cuando necesites, sin tener que cambiar el QR.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewQR;