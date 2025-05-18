
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, QrCode } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <QrCode className="h-8 w-8 text-menuOrange" />
              <span className="ml-2 text-xl font-bold text-gray-800 font-heading">GastroLink</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-gray-700 hover:text-menuOrange px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Inicio
            </Link>
            <a href="#features" className="text-gray-700 hover:text-menuOrange px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Características
            </a>
            <Link to="/login">
              <Button variant="outline" className="ml-4">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-menuOrange hover:bg-menuOrange-dark text-white">Registrarse</Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-menuOrange hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 animate-fade-in">
          <div className="space-y-1">
            <Link 
              to="/"
              className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Inicio
            </Link>
            <a 
              href="#features"
              className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Características
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Iniciar Sesión</Button>
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                <Button className="w-full bg-menuOrange hover:bg-menuOrange-dark text-white">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
