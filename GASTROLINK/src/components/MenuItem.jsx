
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuItemProps {
  name: string;
  description?: string;
  price: number;
  image?: string;
  tags?: string[];
  allergens?: string[];
}

const MenuItem = ({ name, description = "", price, image, tags = [], allergens = [] }: MenuItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <Card
      className={`overflow-hidden menu-transition card-hover ${
        isExpanded ? "bg-white" : "bg-white"
      }`}
      onClick={toggleExpand}
    >
      <div className="flex flex-col sm:flex-row">
        {image && (
          <div className="w-full sm:w-1/3 h-32 sm:h-auto">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={`p-4 ${image ? "sm:w-2/3" : "w-full"}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{name}</h3>
            <span className="font-bold text-menuOrange">{formatPrice(price)}</span>
          </div>

          {description && (
            <p className={`text-sm text-gray-500 mt-1 ${isExpanded ? "" : "line-clamp-2"}`}>
              {description}
            </p>
          )}

          {(tags.length > 0 || allergens.length > 0) && isExpanded && (
            <div className="mt-3">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-menuGreen-light text-menuGreen-dark">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {allergens.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {allergens.map((allergen) => (
                    <Badge key={allergen} variant="outline" className="bg-gray-100 text-gray-700">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
