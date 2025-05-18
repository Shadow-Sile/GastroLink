import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Básico",
      price: "0€",
      description: "Ideal para pequeños negocios que quieren empezar.",
      features: [
        "1 carta digital",
        "Código QR básico",
        "Hasta 20 productos",
        "Diseño responsivo",
        "Actualizaciones ilimitadas",
      ],
      cta: "Empezar Gratis",
      mostPopular: false,
    },
    {
      name: "Pro",
      price: "19,99€",
      period: "/mes",
      description: "Para restaurantes que quieren ofrecer una experiencia superior.",
      features: [
        "Hasta 3 cartas digitales",
        "Códigos QR personalizados",
        "Productos ilimitados",
        "Categorías ilimitadas",
        "Estadísticas básicas",
        "Personalización de diseño",
        "Soporte prioritario",
      ],
      cta: "Probar Gratis 14 Días",
      mostPopular: true,
    },
    {
      name: "Premium",
      price: "39,99€",
      period: "/mes",
      description: "Para cadenas de restaurantes y negocios con múltiples locales.",
      features: [
        "Cartas digitales ilimitadas",
        "Códigos QR personalizados con logo",
        "Productos ilimitados",
        "Estadísticas avanzadas",
        "Personalización completa",
        "Integración con redes sociales",
        "Soporte VIP",
        "Función de pedidos online",
      ],
      cta: "Contactar Ventas",
      mostPopular: false,
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-menuOrange tracking-wide uppercase">Precios</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Planes para todo tipo de negocios
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu restaurante
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border ${
                plan.mostPopular ? 'border-menuOrange shadow-xl' : 'border-gray-200'
              } bg-white p-8 card-hover`}
            >
              {plan.mostPopular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-menuOrange py-1 px-3 text-xs font-medium text-white text-center">
                  Más Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-xl font-medium text-gray-500">{plan.period}</span>
                  )}
                </div>
                <p className="mt-5 text-gray-500">{plan.description}</p>
              </div>

              <ul className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex">
                    <Check className="h-5 w-5 text-menuGreen flex-shrink-0" />
                    <span className="ml-3 text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register" className="mt-8">
                <Button
                  className={`w-full ${
                    plan.mostPopular
                      ? 'bg-menuOrange hover:bg-menuOrange-dark text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;