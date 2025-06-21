'use client';

import { useState, useEffect } from 'react';
import CallsTable from '../components/CallsTable';
import dynamic from 'next/dynamic';
const CallsMap = dynamic(() => import('../components/CallsMap'), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>,
});

import CallsChart from '../components/CallsChart';

interface SuspiciousCall {
  caller: string;
  country: string;
  frequency: number;
  lat: number;
  lon: number;
  timestamp: string;
  duration: number;
}

export default function Home() {
  const [calls, setCalls] = useState<SuspiciousCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuspiciousCalls();
  }, []);

  const fetchSuspiciousCalls = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/calls');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      
      const data = await response.json();
      setCalls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier s'il y a des numéros avec plus de 50 appels
  const criticalCalls = calls.filter(call => call.frequency > 50);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Erreur</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchSuspiciousCalls}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Système Anti-Fraude Téléphonique
              </h1>
              <p className="text-gray-600 mt-2">
                Djibouti Telecom - Détection intelligente des appels suspects
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Dernière mise à jour</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date().toLocaleString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alertes critiques */}
      {criticalCalls.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {criticalCalls.map((call, index) => (
            <div key={index} className="alert-banner bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
              <div className="flex items-center">
                <span className="text-xl mr-2">🚨</span>
                <strong>Alerte Critique:</strong>
                <span className="ml-2">
                  Numéro {call.caller} détecté avec {call.frequency} appels depuis {call.country}!
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Appels Suspects</p>
                <p className="text-2xl font-bold text-gray-900">{calls.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertes Critiques</p>
                <p className="text-2xl font-bold text-gray-900">{criticalCalls.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pays Concernés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(calls.map(call => call.country)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calls.reduce((sum, call) => sum + call.frequency, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tableau des appels */}
          <div className="lg:col-span-2">
            <CallsTable calls={calls} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carte */}
          <div>
            <CallsMap calls={calls} />
          </div>
          
          {/* Graphique */}
          <div>
            <CallsChart calls={calls} />
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 Djibouti Telecom - Système Anti-Fraude Téléphonique</p>
            <p className="text-sm mt-2">
              Développé pour la protection des communications nationales
            </p>
            <p>
              <a
                href="https://mohamed-ali-youssouf.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >  par
                Mohamed Ali Youssouf
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}