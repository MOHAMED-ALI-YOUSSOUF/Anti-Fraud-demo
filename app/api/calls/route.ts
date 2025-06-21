import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface CallRecord {
  caller: string;
  called: string;
  timestamp: string;
  duration: number;
  country: string;
  lat: number;
  lon: number;
}

interface SuspiciousCall {
  caller: string;
  country: string;
  frequency: number;
  lat: number;
  lon: number;
  timestamp: string;
  duration: number;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'cdr.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Fichier CDR introuvable' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const callRecords: CallRecord[] = JSON.parse(fileContent);

    // Calculer la fréquence des appels par numéro
    const callerFrequency: { [key: string]: CallRecord[] } = {};
    
    callRecords.forEach(record => {
      if (!callerFrequency[record.caller]) {
        callerFrequency[record.caller] = [];
      }
      callerFrequency[record.caller].push(record);
    });

    // Filtrer les appels suspects (fréquence > 10)
    const suspiciousCalls: SuspiciousCall[] = [];
    
    Object.entries(callerFrequency).forEach(([caller, calls]) => {
      if (calls.length > 10) {
        const latestCall = calls[calls.length - 1];
        suspiciousCalls.push({
          caller,
          country: latestCall.country,
          frequency: calls.length,
          lat: latestCall.lat,
          lon: latestCall.lon,
          timestamp: latestCall.timestamp,
          duration: latestCall.duration
        });
      }
    });

    // Trier par fréquence décroissante
    suspiciousCalls.sort((a, b) => b.frequency - a.frequency);

    return NextResponse.json(suspiciousCalls);
  } catch (error) {
    console.error('Erreur lors du traitement des données CDR:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}