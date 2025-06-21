'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SuspiciousCall {
  caller: string;
  country: string;
  frequency: number;
  lat: number;
  lon: number;
  timestamp: string;
  duration: number;
}

interface CallsChartProps {
  calls: SuspiciousCall[];
}

export default function CallsChart({ calls }: CallsChartProps) {
  // Calculer les statistiques par pays
  const countryStats = calls.reduce((acc, call) => {
    if (!acc[call.country]) {
      acc[call.country] = 0;
    }
    acc[call.country] += call.frequency;
    return acc;
  }, {} as { [key: string]: number });

  const countries = Object.keys(countryStats);
  const frequencies = Object.values(countryStats);

  // Couleurs distinctes pour chaque pays
  const colors = [
    '#3b82f6', // Bleu
    '#ef4444', // Rouge
    '#10b981', // Vert
    '#f59e0b', // Orange
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
  ];

  const data = {
    labels: countries,
    datasets: [
      {
        label: 'Nombre total d\'appels suspects',
        data: frequencies,
        backgroundColor: colors.slice(0, countries.length),
        borderColor: colors.slice(0, countries.length).map(color => color + '80'),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} appels`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          font: {
            size: 11
          }
        },
        grid: {
          color: '#f3f4f6'
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Répartition par Pays
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Distribution des appels suspects par origine géographique
        </p>
      </div>
      <div className="p-6">
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}