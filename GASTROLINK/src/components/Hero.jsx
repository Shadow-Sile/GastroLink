import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Carta Digital con</span>
            <span className="block text-menuOrange mt-1">Código QR</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto">
            Crea, gestiona y actualiza fácilmente cartas digitales para tu restaurante. Genera códigos QR que nunca caducan.
          </p>
          <div className="mt-8 sm:flex justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-menuOrange hover:bg-menuOrange-dark text-white">
                Empezar Gratis
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <img
            className="w-full max-w-3xl rounded-xl shadow-xl"
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
            alt="Ejemplo de carta digital en un dispositivo móvil"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;