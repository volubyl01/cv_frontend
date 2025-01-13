"use client";
import { memo } from "react";
import { Post } from "@/features/synthetisers/types/synth";
import { AddPost } from "../posts/AddPost";
import Link from "next/link";
import { API_URL } from "@/config/constants";

interface CardPostProps {
	posts?: Post[];
	showPosts: boolean;
	onToggle: () => void;
	synthetiserId: number;
}

export const CardPost = memo(
	({ posts = [], showPosts, onToggle, synthetiserId }: CardPostProps) => {
		// Log détaillé de chaque post
		posts.forEach((post) => {
			console.log("Post:", {
				id: post.id,
				titre: post.titre,
				synthetiserId: post.synthetiserId,
				typeSynthetiserId: typeof post.synthetiserId,
				targetSynthetiserId: synthetiserId,
			});
		});

		const filteredPosts = posts.filter((post) => {
			const postSynthId = Number(post.synthetiserId);
			const targetSynthId = Number(synthetiserId);

			console.log("Comparaison:", {
				postId: post.id,
				postSynthId,
				targetSynthId,
				equal: postSynthId === targetSynthId,
			});

			return postSynthId === targetSynthId;
		});
		console.log("Résultat du filtrage:", {
			postsFiltrés: filteredPosts.length,
			premierPostFiltré: filteredPosts[0],
		});

		const handlePostAdded = async () => {
			try {
				const response = await fetch(
					`${API_URL}/api/posts?synthetiserId=${synthetiserId}`
				);
				if (!response.ok) {
					throw new Error("Erreur lors de la récupération des posts");
				}
				window.location.reload();
			} catch (error) {
				console.error("Erreur lors de la mise à jour des posts:", error);
			}
		};

		return (
			<div className="mt-4 space-y-4 divide-y divide-gray-200">
				<div className="flex justify-between items-center p-2 bg-gray-100 rounded">
					<span className="text-gray-700 font-medium">
						Posts ({filteredPosts.length})
					</span>
					<button
						onClick={onToggle}
						className="px-3 py-1 text-sm text-black  hover:bg-pink-200 rounded-full transition-colors"
					>
						{showPosts ? "Masquer les posts ▼" : "Voir les posts ▶"}
					</button>
				</div>

				{showPosts && (
					<>
						{filteredPosts.length > 0 ? (
							filteredPosts.map((post) => {
								console.log("Données du post:", {
									postId: post.id,
									userId: post.userId,
                  author: post.author
								});

								return (
									<div key={post.id} className="pt-4">
										<div className="flex items-center gap-2 mb-2">
											{/* Avatar de l'utilisateur */}
											<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
												<span className="text-xs text-gray-600">
													{post.author?.username?.[0]?.toUpperCase() || "U"}
												</span>
											</div>
											{/* Nom d'utilisateur et date */}
											<div>
												<span className="font-medium text-sm text-gray-900">
													{post.author?.username || "Utilisateur inconnu"}
												</span>
												<span className="text-xs text-gray-500 ml-2">
													{post.createdAt
														? new Date(post.createdAt).toLocaleDateString()
														: "Date inconnue"}
												</span>
											</div>
										</div>

										{post.titre && (
											<h3 className="font-semibold text-gray-900">
												{post.titre}
											</h3>
										)}
										{post.commentaire && (
											<p className="mt-1 text-gray-600 text-sm">
												{post.commentaire}
											</p>
										)}
										{post.url_contenu && (
											<Link
												href={post.url_contenu}
												className="mt-2 inline-flex items-center text-sm text-blue-500 hover:text-blue-700"
												target="_blank"
												rel="noopener noreferrer"
											>
												Voir le contenu
											</Link>
										)}
										<span className="block mt-2 text-sm text-gray-500">
											Statut: {post.statut}
										</span>
									</div>
								);
							})
						) : (
							<p>Aucun post pour le moment</p>
						)}
						<AddPost
							synthetiserId={synthetiserId}
							onPostAdded={handlePostAdded}
						/>
					</>
				)}
        
			</div>
		);
	}
);

CardPost.displayName = "CardPost";

export default CardPost;
