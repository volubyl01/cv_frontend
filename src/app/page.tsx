"use client"; 
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Waveform from "@/components/Waveform";

export default function HomePage() {
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const payload = JSON.parse(atob(token.split(".")[1]));
				setIsAdmin(payload.role === "admin");
			} catch (error) {
				console.error("Erreur lors du décodage du token:", error);
			}
		}
	}, []);

	return (
		<main className="min-h-screen">
			{/* Hero Section */}

			<section
				className="relative  text-white  min-h-[600px] w-full overflow-y-clip"
				id="sectionAccueil"
			>
				<div className="absolute inset-0 w-full h-full">
					<Image
						src="/images/synthetiseur-analogique-moog-subsequent-37.webp"
						alt="Background"
						fill
						sizes="100vw"
						className="object-cover  opacity-50"
						priority
					/>
				</div>

				{/* Overlay gradient pour améliorer la lisibilité */}
				<div className="absolute inset-0 bg-gradient-to-b from-blue-500/50 to-pink-500/50" />

				{/* Contenu existant avec z-index pour le placer au-dessus du fond */}
				<div className="container mx-auto px-4 py-16 relative z-20">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="md:w-1/2 mb-4 md:mb-0 mr-5">
							<h1 className="text-4xl md:text-6xl font-bold mb-4 text-red-500">
								Bienvenue sur Concrete Vibes
							</h1>
							<p className="text-xl mb-2">
								Découvrez notre collection de synthétiseurs et partagez votre
								passion
							</p>
							<p className="text-sm italic">
								Site de démonstration
							</p>
							<p className="text-xl font-bold text-blue-800">
								{/* Accès : <br></br> email: tech10@free.fr <br></br>password: 012345678{" "} */}
							</p>
							<p className="text-sm italic">
								
							</p>
							<div className="font-bold text-xl text-white ml-4 mt-2 text-right">
								<span className="">Consulter les dépôts GitHub</span>
								<br />
								<div className="mt-2  text-white">
									<span className="inline-block hover:scale-110 transition-transform">
									👉
									</span>
									<span>
										<Link
											href="https://github.com/volubyl01/cv_frontend.git"
											className=""
										>
											Concrete Vibes
										</Link>
										<br />
										<span className="inline-block hover:scale-110 transition-transform">
										👉
										</span>
										<Link
											href="https://github.com/volubyl01/cv_backend.git"
											className=""
										>
											Concrete Vibes Api
										</Link>
									</span>
								</div>
							</div>
							<div className="py-11 text-right">
								<Link
									href="/synthetisers"
									className=" bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
								>
									Voir les Synthétiseurs
								</Link>
							</div>
						</div>

						{/* image gif */}
						<div className="md:w-1/2">
							{/* <div className="relative w-full h-[400px] z-30">
								<Image
									src="/images/sound.gif"
									alt="Sound"
									unoptimized
									fill
									className="object-cover rounded-lg hue-rotate-90 saturate-150"
									 priority
								/>
							</div> */}
							<div className="items-center mx-auto">
								<Waveform initialColor="#FF5733" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-blue-900 backdrop-blur-sm">
				<div className="container mx-auto px-4 text-white ">
					<h2 className="text-3xl font-bold text-center mb-12">
						Nos Ramifications
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<FeatureCard
							title="Collection Unique"
							description="Le site SYNTHETISER.NET où vous pouvez découvrir une sélection soignée d'instruments électroniques"
							icon="🎹"
							url="https://synthetiser.net"
						/>
						<FeatureCard
							title="Communauté Active (en cours)"
							description="Partagez votre expérience avec d'autres passionnés"
							icon="👥"
							url=""
						/>
						<FeatureCard
							title="Ressources (en cours)"
							description="Accédez à des tutoriels et des guides"
							icon="📚"
							url=""
							
						/>
					</div>
				</div>
			</section>

			{/* CTA Section - Conditionnel basé sur isAdmin */}
			{!isAdmin && (
				<section className=" bg-gradient-to-b from-blue-500/50 to-pink-500/50">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-3xl font-bold mb-8">
							Prêt à rejoindre la communauté ?
						</h2>
						<div className="flex justify-center gap-4">
							<Link
								href="/register"
								className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
							>
								Inscription
							</Link>
							<Link
								href="/login"
								className="bg-red-600 text-white px-8 py-3 rounded-full font-bold border border-blue-600 hover:bg-blue-50 transition-colors"
							>
								Se connecter
							</Link>
						</div>
					</div>
				</section>
			)}

			{/* Section Admin */}
			{isAdmin && (
				<section className="bg-gray-100 py-16">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-3xl font-bold mb-8">Panel Administrateur</h2>
						<Link
							href="/admin/dashboard"
							className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
						>
							Accéder au Dashboard
						</Link>
					</div>
				</section>
			)}
		</main>
	);
}
// Composant FeatureCard
interface FeatureCardProps {
	title: string;
	description: string;
	icon: string;
	url: string;
}

function FeatureCard({ title, description, icon, url }: FeatureCardProps) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-lg text-center">
			<div className="text-4xl mb-4">{icon}</div>
			<h3 className="text-xl font-bold mb-2 text-gray-700">{title}</h3>
			<p className="text-gray-700">{description}</p>
			<p className="text-gray-700">{url}</p>
		</div>
	);
}
