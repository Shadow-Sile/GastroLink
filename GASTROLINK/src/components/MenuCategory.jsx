import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// MenuCategory recibe props: name (string), items (array de objetos con id, name, description, price, tags, allergens)
const MenuCategory = ({ name, items }) => {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <Button
          className="text-gray-500 hover:text-menuOrange"
          variant="ghost"
          size="sm"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      {open && (
        <div className="grid gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                {item.description && <p className="text-gray-500 mt-1">{item.description}</p>}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="bg-menuOrange/10 text-menuOrange text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.allergens.map((allergen, idx) => (
                      <span key={idx} className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-xl font-bold text-menuOrange">
                {item.price ? `${item.price.toFixed(2)} €` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MenuCategory;
