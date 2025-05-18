import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Save, Eye, MoveUp, MoveDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { db } from "@/firebase/config";
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";
import { useFirebase } from "@/context/FirebaseContext";

const defaultMenu = {
  name: "",
  restaurant: "",
  logo: "",
  categories: [
    {
      id: "cat-" + Date.now(),
      name: "Nueva Categoría",
      items: [],
    },
  ],
};

const MenuEditor = () => {
  const { menuId } = useParams();
  const isNewMenu = menuId === "new";
  const [menu, setMenu] = useState(defaultMenu);
  const [loading, setLoading] = useState(!isNewMenu);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();
  const { currentUser } = useFirebase();

  useEffect(() => {
    if (isNewMenu) {
      setMenu({ ...defaultMenu });
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "menus", menuId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMenu({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("No se encontró la carta.");
        }
        setLoading(false);
      } catch (err) {
        setError("No se pudieron cargar los datos del menú.");
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId, isNewMenu]);

  const handleChange = (e) => {
    setMenu({
      ...menu,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (categoryId, field, value) => {
    setMenu({
      ...menu,
      categories: menu.categories.map(category => 
        category.id === categoryId ? { ...category, [field]: value } : category
      )
    });
  };

  const addCategory = () => {
    setMenu({
      ...menu,
      categories: [
        ...menu.categories,
        {
          id: "cat-" + Date.now(),
          name: "Nueva Categoría",
          items: []
        }
      ]
    });
  };

  const deleteCategory = (categoryId) => {
    setMenu({
      ...menu,
      categories: menu.categories.filter(category => category.id !== categoryId)
    });
  };

  const moveCategory = (categoryId, direction) => {
    const currentIndex = menu.categories.findIndex(cat => cat.id === categoryId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === menu.categories.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newCategories = [...menu.categories];
    const [movedCategory] = newCategories.splice(currentIndex, 1);
    newCategories.splice(newIndex, 0, movedCategory);

    setMenu({
      ...menu,
      categories: newCategories
    });
  };

  const addItem = (categoryId) => {
    setMenu({
      ...menu,
      categories: menu.categories.map(category => 
        category.id === categoryId 
        ? { 
            ...category, 
            items: [
              ...category.items, 
              {
                id: "item-" + Date.now(),
                name: "Nuevo plato",
                description: "",
                price: 0,
                tags: [],
                allergens: []
              }
            ] 
          } 
        : category
      )
    });
  };

  const updateItem = (categoryId, itemId, field, value) => {
    setMenu({
      ...menu,
      categories: menu.categories.map(category => 
        category.id === categoryId 
        ? { 
            ...category, 
            items: category.items.map(item => 
              item.id === itemId 
              ? { ...item, [field]: value } 
              : item
            )
          } 
        : category
      )
    });
  };

  const deleteItem = (categoryId, itemId) => {
    setMenu({
      ...menu,
      categories: menu.categories.map(category => 
        category.id === categoryId 
        ? { 
            ...category, 
            items: category.items.filter(item => item.id !== itemId)
          } 
        : category
      )
    });
  };

  const moveItem = (categoryId, itemId, direction) => {
    const category = menu.categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const currentIndex = category.items.findIndex(item => item.id === itemId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === category.items.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newItems = [...category.items];
    const [movedItem] = newItems.splice(currentIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    setMenu({
      ...menu,
      categories: menu.categories.map(cat => 
        cat.id === categoryId 
        ? { ...cat, items: newItems } 
        : cat
      )
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menu.name || !menu.restaurant) {
      toast.error("Por favor, completa los campos obligatorios.");
      setActiveTab("general");
      return;
    }

    if (menu.categories.some(cat => !cat.name)) {
      toast.error("Todas las categorías deben tener un nombre.");
      setActiveTab("categories");
      return;
    }

    if (menu.categories.some(cat => 
      cat.items.some(item => !item.name || item.price < 0)
    )) {
      toast.error("Todos los platos deben tener un nombre y un precio válido.");
      setActiveTab("categories");
      return;
    }

    try {
      setSaving(true);
      let docRef;
      if (isNewMenu) {
        docRef = await addDoc(collection(db, "menus"), {
          ...menu,
          userId: currentUser?.uid || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success("Menú creado correctamente");
        setSaving(false);
        navigate(`/dashboard/edit-menu/${docRef.id}`);
      } else {
        await setDoc(doc(db, "menus", menuId), {
          ...menu,
          updatedAt: new Date(),
        });
        toast.success("Menú actualizado correctamente");
        setSaving(false);
        navigate("/dashboard");
      }
    } catch (err) {
      setSaving(false);
      toast.error("Error al guardar el menú.");
    }
  };

  const handlePreview = () => {
    if (isNewMenu) {
      toast.error("Guarda la carta antes de previsualizar.");
      return;
    }
    navigate(`/menu/${menuId}`);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-menuOrange hover:text-menuOrange-dark">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="ml-4 text-xl font-bold text-gray-900">
                {isNewMenu ? "Crear Nueva Carta" : `Editar: ${menu.name}`}
              </h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handlePreview} disabled={saving || isNewMenu}>
                <Eye className="mr-2 h-4 w-4" />
                Vista Previa
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-menuOrange hover:bg-menuOrange-dark"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="categories">Categorías y Platos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="restaurant">Nombre del Restaurante *</Label>
                      <Input 
                        id="restaurant"
                        name="restaurant"
                        value={menu.restaurant}
                        onChange={handleChange}
                        placeholder="Ej. Restaurante El Rincón"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Nombre de la Carta *</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={menu.name}
                        onChange={handleChange}
                        placeholder="Ej. Carta Primavera 2023"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="logo">URL del Logo (opcional)</Label>
                      <Input 
                        id="logo"
                        name="logo"
                        value={menu.logo || ""}
                        onChange={handleChange}
                        placeholder="https://turestaurante.com/logo.png"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL de la imagen de tu logo. Recomendamos un tamaño de 300x300px.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories">
              <div className="space-y-8">
                {menu.categories.map((category, catIndex) => (
                  <Card key={category.id} className="overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Label htmlFor={`category-${category.id}`}>Nombre de la Categoría</Label>
                          <Input 
                            id={`category-${category.id}`}
                            value={category.name}
                            onChange={(e) => handleCategoryChange(category.id, "name", e.target.value)}
                            placeholder="Ej. Entrantes, Platos Principales, Postres..."
                            className="mt-1"
                            required
                          />
                        </div>
                        <div className="flex ml-4 space-x-2">
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost"
                            onClick={() => moveCategory(category.id, "up")}
                            disabled={catIndex === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost"
                            onClick={() => moveCategory(category.id, "down")}
                            disabled={catIndex === menu.categories.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteCategory(category.id)}
                            disabled={menu.categories.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      {category.items.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Esta categoría no tiene platos todavía.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {category.items.map((item, itemIndex) => (
                            <div 
                              key={item.id} 
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-medium">Plato #{itemIndex + 1}</h4>
                                <div className="flex space-x-2">
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => moveItem(category.id, item.id, "up")}
                                    disabled={itemIndex === 0}
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => moveItem(category.id, item.id, "down")}
                                    disabled={itemIndex === category.items.length - 1}
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteItem(category.id, item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid gap-4">
                                <div>
                                  <Label htmlFor={`item-name-${item.id}`}>Nombre del Plato</Label>
                                  <Input 
                                    id={`item-name-${item.id}`}
                                    value={item.name}
                                    onChange={(e) => updateItem(category.id, item.id, "name", e.target.value)}
                                    placeholder="Ej. Ensalada César"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`item-description-${item.id}`}>Descripción (opcional)</Label>
                                  <Textarea 
                                    id={`item-description-${item.id}`}
                                    value={item.description}
                                    onChange={(e) => updateItem(category.id, item.id, "description", e.target.value)}
                                    placeholder="Ej. Lechuga romana, pollo, crutones, queso parmesano y salsa César"
                                    rows={2}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`item-price-${item.id}`}>Precio</Label>
                                  <Input 
                                    id={`item-price-${item.id}`}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.price}
                                    onChange={(e) => updateItem(category.id, item.id, "price", parseFloat(e.target.value))}
                                    placeholder="0.00"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`item-image-${item.id}`}>URL de la Imagen (opcional)</Label>
                                  <Input 
                                    id={`item-image-${item.id}`}
                                    value={item.image || ""}
                                    onChange={(e) => updateItem(category.id, item.id, "image", e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`item-tags-${item.id}`}>Etiquetas (opcional)</Label>
                                  <Input 
                                    id={`item-tags-${item.id}`}
                                    value={item.tags.join(", ")}
                                    onChange={(e) => updateItem(category.id, item.id, "tags", e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))}
                                    placeholder="Popular, Picante, Vegetariano (separados por comas)"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`item-allergens-${item.id}`}>Alérgenos (opcional)</Label>
                                  <Input 
                                    id={`item-allergens-${item.id}`}
                                    value={item.allergens.join(", ")}
                                    onChange={(e) => updateItem(category.id, item.id, "allergens", e.target.value.split(",").map(allergen => allergen.trim()).filter(Boolean))}
                                    placeholder="Gluten, Lácteos, Frutos secos (separados por comas)"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => addItem(category.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Añadir Plato
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCategory}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Nueva Categoría
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-menuOrange hover:bg-menuOrange-dark"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Carta"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default MenuEditor;