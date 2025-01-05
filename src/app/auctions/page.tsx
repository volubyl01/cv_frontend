"use client";

import { API_URL } from "@/config/constants";
import { useState, useCallback, useEffect } from "react";
import { AuctionsList } from "@/features/auctions/components/list/AuctionsList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import api from "@/lib/axios/index";

export default function AuctionsPage() {
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


     const fetchAuctions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
    
            const auctionResponse = await api.get(`${API_URL}/api/auctions`);
            console.log('Response:', auctionResponse); // Pour voir la structure complète
            if (!auctionResponse.data.data) {
                throw new Error("Format de données invalide");
            }
            setAuctions(auctionResponse.data.data);
        } catch (error) {
            console.error(error);
            setError("Une erreur est survenue lors du chargement des données");
            // Ne pas rediriger automatiquement ici
        } finally {
            setIsLoading(false);
        }
    }, [])

    

    const onUpdateSuccess = useCallback(() => {
        fetchAuctions();
    }, [fetchAuctions]);

    useEffect(() => {
        fetchAuctions();
    }, [fetchAuctions]);


    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <main className="min-h-screen">
            <div className="w-full px-4 py-6">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Liste des Synthétiseurs
                </h1>
                
                <AuctionsList
                    auctions={auctions}
                    onUpdateSuccess={onUpdateSuccess}
                />
            </div>
        </main>
    );
}