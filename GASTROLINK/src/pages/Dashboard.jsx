import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Plus, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const [menus, setMenus] = useState([
    {
      id: "menu-1",
      name: "Carta Primavera 2023",
      restaurant: "Restaurante El Rincón",
      lastUpdated: "2023-05-15",
      qrViews: 243,
    },
  ]);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí se implementaría el logout con Firebase
    // Por ahora, simplemente redirigimos a la página de inicio
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                <QrCode className="h-8 w-8 text-menuOrange" />
                <span className="ml-2 text-xl font-bold text-gray-800 font-heading">MenuQR</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-menuOrange px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-500">Gestiona tus cartas digitales y códigos QR</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/dashboard/create-menu">
              <Button className="bg-menuOrange hover:bg-menuOrange-dark">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Carta
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Cartas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{menus.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Visitas Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {menus.reduce((total, menu) => total + menu.qrViews, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Plan Actual</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-xl font-bold">Básico</div>
              <Link to="/pricing">
                <Button variant="outline" size="sm">
                  Mejorar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Tus Cartas Digitales</h2>

        {menus.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <QrCode className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tienes cartas digitales
            </h3>
            <p className="mt-2 text-gray-500">Crea tu primera carta digital para generar un código QR.</p>
            <Button className="mt-4 bg-menuOrange hover:bg-menuOrange-dark">
              <Plus className="mr-2 h-4 w-4" />
              Crear Carta Digital
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <Card key={menu.id} className="card-hover">
                <CardHeader>
                  <CardTitle>{menu.name}</CardTitle>
                  <p className="text-sm text-gray-500">{menu.restaurant}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Última actualización:</span>
                    <span>{formatDate(menu.lastUpdated)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Visitas del QR:</span>
                    <span>{menu.qrViews}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t">
                  <Link to={`/dashboard/edit-menu/${menu.id}`}>
                    <Button variant="outline">Editar</Button>
                  </Link>
                  <Link to={`/dashboard/view-qr/${menu.id}`}>
                    <Button className="bg-menuOrange hover:bg-menuOrange-dark">
                      Ver QR
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;