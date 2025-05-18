import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            ¿Listo para digitalizar tu carta?
          </h2>
          <div className="mt-8 flex justify-center">
            <Link to="/register">
              <Button className="bg-menuOrange hover:bg-menuOrange-dark text-white">
                Registrarse Gratis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;