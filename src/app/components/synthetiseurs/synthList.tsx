import { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Synth, ApiResponse } from '../../../../types';
import Image from 'next/image';
import axios from 'axios';

const SynthList: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [synths, setSynths] = useState<Synth[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const fetchSynths = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Veuillez vous connecter");
        await router.push("/login");
        return;
      }

      const response = await axios.get<ApiResponse>('http://localhost:4000/api/synthetizers', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      if (!data.roles?.length) {
        setError("Vous n'avez pas les autorisations nécessaires");
        return;
      }

      setUserRoles(data.roles);
      setSynths(Array.isArray(data.data) ? data.data : []);
      setError(null);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setError("Session expirée");
          await router.push("/login");
        } else if (error.response?.status === 403) {
          setError("Accès interdit");
        } else {
          setError(error.response?.data?.message || 'Une erreur inattendue est survenue');
        }
      } else {
        setError('Une erreur inattendue est survenue');
      }
      console.error('Erreur lors de la récupération des synthétiseurs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSynths();
  }, [fetchSynths]);

  const handleRetry = (): void => {
    setError(null);
    setIsLoading(true);
    void fetchSynths();
  };

  if (isLoading) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{error}</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          type="button"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {userRoles.includes('admin') && (
        <div className="col-span-full mb-4">
          <h1 className="text-2xl">Panel Administrateur</h1>
        </div>
      )}
      {synths.length > 0 ? (
        synths.map((synth) => (
          <div
            key={synth.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            {synth.image_url && (
              <div className="relative w-full h-[300px] mb-4">
                <Image
                  src={synth.image_url}
                  alt={`${synth.marque} ${synth.modele}`}
                  fill
                  className="object-cover rounded-md"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>
            )}

            <h2 className="text-xl font-bold mb-2">
              {synth.marque} {synth.modele}
            </h2>

            {synth.specifications && (
              <p className="text-gray-600 mb-2">{synth.specifications}</p>
            )}

            <div className="flex justify-between items-center mt-4">
              {synth.note && (
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{synth.note}</span>
                  {synth.nb_avis && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({synth.nb_avis} avis)
                    </span>
                  )}
                </div>
              )}

              {synth.auctionPrice && (
                <div className="text-lg font-semibold m-6 border-red-500 p-2 border-2">
                  {synth.auctionPrice}€
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center">
          Aucun synthétiseur trouvé
        </div>
      )}
    </div>
  );
}

export default SynthList;