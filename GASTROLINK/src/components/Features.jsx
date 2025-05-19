import { Utensils, Smartphone, Edit, RefreshCw } from "lucide-react";

const features = [
	{
		name: "Códigos QR Dinámicos",
		description:
			"Genera códigos QR que nunca caducan y siempre dirigen a tu carta digital actualizada.",
		icon: Utensils,
	},
	{
		name: "Diseño Responsivo",
		description:
			"Tu carta digital se ve perfecta en cualquier dispositivo, desde móviles hasta tablets y ordenadores.",
		icon: Smartphone,
	},
	{
		name: "Edición en Tiempo Real",
		description:
			"Actualiza tus platos, precios o categorías y los cambios se reflejan al instante.",
		icon: Edit,
	},
	{
		name: "Actualizaciones Ilimitadas",
		description:
			"Cambia tu menú tantas veces como necesites sin costes adicionales.",
		icon: RefreshCw,
	},
];

const Features = () => {
	return (
		<div id="features" className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-base text-menuOrange font-semibold tracking-wide uppercase">
						Características
					</h2>
					<p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
						La mejor forma de digitalizar tu carta
					</p>
					<p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
						Todo lo que necesitas para crear y gestionar cartas digitales para tu
						restaurante.
					</p>
				</div>

				<div className="mt-16">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
						{features.map((feature) => (
							<div key={feature.name} className="pt-6">
								<div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full card-hover">
									<div className="-mt-6">
										<div>
											<span className="inline-flex items-center justify-center p-3 bg-menuOrange rounded-md shadow-lg">
												<feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
											</span>
										</div>
										<h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
											{feature.name}
										</h3>
										<p className="mt-5 text-base text-gray-500">
											{feature.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Features;