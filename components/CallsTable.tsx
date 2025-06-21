'use client';

import { useState } from 'react';

interface SuspiciousCall {
  caller: string;
  country: string;
  frequency: number;
  lat: number;
  lon: number;
  timestamp: string;
  duration: number;
}

interface CallsTableProps {
  calls: SuspiciousCall[];
}

export default function CallsTable({ calls }: CallsTableProps) {
  const [blockedNumbers, setBlockedNumbers] = useState<string[]>([]);
  const [selectedCall, setSelectedCall] = useState<SuspiciousCall | null>(null);
  const [blockCandidate, setBlockCandidate] = useState<string | null>(null);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBlock = (caller: string) => {
    setBlockCandidate(caller);
  };

  const confirmBlock = () => {
    if (blockCandidate) {
      setBlockedNumbers([...blockedNumbers, blockCandidate]);
      setBlockCandidate(null);
    }
  };

  const cancelBlock = () => {
    setBlockCandidate(null);
  };

  const handleDetails = (call: SuspiciousCall) => {
    setSelectedCall(call);
  };

  const closeDetails = () => {
    setSelectedCall(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Appels Suspects Détectés
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {calls.length} numéro(s) avec plus de 10 appels
        </p>
      </div>
      
      <div className="table-container overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro Appelant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pays
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fréquence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernier Appel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau de Risque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calls.map((call, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {call.caller}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {call.country}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    call.frequency > 50 
                      ? 'bg-red-100 text-red-800' 
                      : call.frequency > 25 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {call.frequency} appels
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(call.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(call.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    call.frequency > 50 
                      ? 'bg-red-100 text-red-800' 
                      : call.frequency > 25 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {call.frequency > 50 ? 'CRITIQUE' : call.frequency > 25 ? 'ÉLEVÉ' : 'MODÉRÉ'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBlock(call.caller)}
                      disabled={blockedNumbers.includes(call.caller)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        blockedNumbers.includes(call.caller)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {blockedNumbers.includes(call.caller) ? 'Bloqué' : 'Bloquer'}
                    </button>
                    <button
                      onClick={() => handleDetails(call)}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Détails
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup pour les détails */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Détails de l'Appel Suspect
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Numéro :</strong> {selectedCall.caller}
              </p>
              <p className="text-sm">
                <strong>Pays :</strong> {selectedCall.country}
              </p>
              <p className="text-sm">
                <strong>Fréquence :</strong> {selectedCall.frequency} appels
              </p>
              <p className="text-sm">
                <strong>Dernier Appel :</strong> {formatDate(selectedCall.timestamp)}
              </p>
              <p className="text-sm">
                <strong>Durée :</strong> {formatDuration(selectedCall.duration)}
              </p>
              <p className="text-sm">
                <strong>Coordonnées :</strong> {selectedCall.lat}, {selectedCall.lon}
              </p>
              <p className="text-sm">
                <strong>Niveau de Risque :</strong>{' '}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedCall.frequency > 50
                    ? 'bg-red-100 text-red-800'
                    : selectedCall.frequency > 25
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedCall.frequency > 50 ? 'CRITIQUE' : selectedCall.frequency > 25 ? 'ÉLEVÉ' : 'MODÉRÉ'}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDetails}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour confirmer le blocage */}
      {blockCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmer le Blocage
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Voulez-vous vraiment bloquer le numéro <strong>{blockCandidate}</strong> ? Cette action empêchera ce numéro d'effectuer d'autres appels.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelBlock}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmBlock}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}