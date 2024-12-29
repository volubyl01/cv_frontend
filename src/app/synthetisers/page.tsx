"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ListSynthetisers from "@/features/synthetisers/components/list/ListSynthetisers";
import api from "@/lib/axios/index";

export default function SynthetisersPage() {
  const router = useRouter();
  const [synths, setSynths] = useState([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return false;
    }
    try {
      const response = await api.get("/auth/me");
      return response.status === 200;
    } catch {
      router.push("/login");
      return false;
    }
  }, [router]);

  const fetchSynths = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const [roleResponse, synthResponse] = await Promise.all([
        api.get("/auth/me"),
        api.get("/api/synthetisers"),
      ]);
      const userRole = roleResponse.data.role;
      console.log("Role reçu de l'API:", userRole); // Log du rôle
      const roles = userRole === "admin" ? ["admin"] : [userRole];
      console.log("Roles à définir:", roles); // Log des rôles avant setState
      setUserRoles(roles);
      setSynths(synthResponse.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const initPage = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        fetchSynths();
      }
    };
    initPage();
  }, [checkAuth, fetchSynths]); // Dépendances vides pour n'exécuter qu'au montage

  return (
    <main className="min-h-screen">
      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Liste des Synthétiseurs
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-pulse text-gray-600">Chargement...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <ListSynthetisers synths={synths} userRoles={userRoles} />
        )}
      </div>
    </main>
  );
}
