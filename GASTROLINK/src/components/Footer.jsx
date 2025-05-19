import { Link } from "react-router-dom";
import { Utensils } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-menuOrange" />
              <span className="ml-2 text-xl font-bold text-white font-heading">GastroLink</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Crea y gestiona cartas digitales para tu restaurante con códigos QR dinámicos que nunca caducan.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-white font-medium text-lg mb-4">Producto</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium text-lg mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-menuOrange text-sm transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} GastroLink. Todos los derechos reservados.</p>
            <div className="mt-4 md:mt-0">

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;