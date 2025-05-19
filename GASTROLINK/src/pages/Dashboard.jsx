import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowRight, Utensils } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, orderBy, addDoc } from "firebase/firestore";
import { useFirebase } from "@/context/FirebaseContext";

const Dashboard = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, logout } = useFirebase();

  useEffect(() => {
    if (!currentUser) return;
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "menus"),
          where("userId", "==", currentUser.uid),
          orderBy("updatedAt", "desc")
        );
        let querySnapshot = await getDocs(q);
        let loadedMenus = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().updatedAt?.toDate?.() || new Date(),
          qrViews: doc.data().qrViews || 0,
        }));

        if (loadedMenus.length === 0) {
          const defaultMenu = {
            name: "Carta Primavera 2023",
            restaurant: "Restaurante El Rincón",
            logo: "",
            categories: [
              {
                id: "cat-1",
                name: "Entrantes",
                items: [
                  {
                    id: "item-1",
                    name: "Croquetas caseras",
                    description: "Cremosas croquetas de jamón ibérico hechas a mano (6 uds)",
                    price: 8.50,
                    tags: ["Popular", "Casero"],
                    allergens: ["Gluten", "Lácteos"],
                    ingredients: "Jamón ibérico, leche, harina, huevo, pan rallado"
                  },
                  {
                    id: "item-2",
                    name: "Ensalada César",
                    description: "Lechuga romana, pollo, crutones, queso parmesano y salsa César",
                    price: 9.95,
                    tags: ["Saludable"],
                    allergens: ["Gluten", "Huevo", "Lácteos"],
                    ingredients: "Lechuga, pollo, pan, queso parmesano, huevo, anchoas"
                  },
                ]
              },
              {
                id: "cat-2",
                name: "Platos Principales",
                items: [
                  {
                    id: "item-3",
                    name: "Paella de marisco",
                    description: "Arroz con calamares, gambas, mejillones y azafrán (mínimo 2 personas)",
                    price: 18.00,
                    tags: ["Especialidad", "Popular"],
                    allergens: ["Marisco", "Moluscos"],
                    ingredients: "Arroz, calamares, gambas, mejillones, azafrán, pimiento"
                  },
                  {
                    id: "item-4",
                    name: "Solomillo a la pimienta",
                    description: "Solomillo de ternera con salsa de pimienta y guarnición de patatas",
                    price: 16.50,
                    tags: ["Sin gluten"],
                    allergens: [],
                    ingredients: "Solomillo de ternera, pimienta, nata, patatas"
                  }
                ]
              },
              {
                id: "cat-3",
                name: "Postres",
                items: [
                  {
                    id: "item-5",
                    name: "Tarta de queso casera",
                    description: "Tarta de queso cremosa con base de galleta y mermelada de frutos rojos",
                    price: 5.00,
                    tags: ["Popular", "Casero"],
                    allergens: ["Lácteos", "Gluten", "Huevo"],
                    ingredients: "Queso crema, nata, huevo, galleta, mantequilla, frutos rojos"
                  },
                  {
                    id: "item-6",
                    name: "Helado artesanal",
                    description: "Bola de helado a elegir: vainilla, chocolate o fresa",
                    price: 3.50,
                    tags: ["Sin gluten"],
                    allergens: ["Lácteos"],
                    ingredients: "Leche, azúcar, huevo, vainilla/chocolate/fresa"
                  }
                ]
              }
            ],
            userId: currentUser.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
            qrViews: 0,
          };
          await addDoc(collection(db, "menus"), defaultMenu);
          const querySnapshot2 = await getDocs(q);
          loadedMenus = querySnapshot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            lastUpdated: doc.data().updatedAt?.toDate?.() || new Date(),
            qrViews: doc.data().qrViews || 0,
          }));
        }

        setMenus(loadedMenus);
      } catch (err) {
        setMenus([]);
      }
      setLoading(false);
    };
    fetchMenus();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("es-ES", {
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
                <Utensils className="h-8 w-8 text-menuOrange" />
                <span className="ml-2 text-xl font-bold text-gray-800 font-heading">GastroLink</span>
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
                {menus.reduce((total, menu) => total + (menu.qrViews || 0), 0)}
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

        {loading ? (
          <div className="text-center text-gray-500">Cargando cartas...</div>
        ) : menus.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ArrowRight className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tienes cartas digitales
            </h3>
            <p className="mt-2 text-gray-500">Crea tu primera carta digital para generar un código QR.</p>
            <Link to="/dashboard/create-menu">
              <Button className="mt-4 bg-menuOrange hover:bg-menuOrange-dark">
                <Plus className="mr-2 h-4 w-4" />
                Crear Carta Digital
              </Button>
            </Link>
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