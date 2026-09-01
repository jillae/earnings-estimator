/**
 * HOOK FÖR MASKINDATA FRÅN DATABAS
 * 
 * Centraliserad hantering av maskindata från Supabase API
 */

import { useState, useEffect } from 'react';
import { machineApiClient } from '@/utils/machineApiClient';
import { premiumMachines } from '@/data/machines/premium';
import { treatmentMachines } from '@/data/machines/treatment';
import { handheldMachines } from '@/data/machines/handheld';
import { specialMachines } from '@/data/machines/special';

export interface DatabaseMachine {
  id: string;
  name: string;
  price_eur: number;
  is_premium: boolean;
  uses_credits: boolean;
  credit_min: number;
  credit_max: number;
  flatrate_amount: number;
  default_customer_price: number;
  default_leasing_period: number;
  leasing_min: number;
  leasing_standard?: number;  // Optional tills databasen uppdateras
  leasing_max: number;
  credits_per_treatment: number;
  description: string | null;
  category: string;
  is_active: boolean;
  leasing_tariffs: Record<string, number>;
  created_at: string;
}

// Konvertera från databas-format till Machine-kompatibelt format
export interface CalculatorMachine {
  id: string;
  name: string;
  description?: string;
  price?: string | number;
  priceEur?: number;
  fullName?: string;
  shortName?: string;
  modelCode?: string;
  usesCredits: boolean;
  creditMin?: number;     // Bakåtkompatibilitet
  creditMax?: number;     // Position 0
  creditMid1?: number;    // Position 1
  creditMid2?: number;    // Position 2
  creditMid3?: number;    // Position 3
  leasingMin?: number;
  leasingStandard?: number;  // Standard nivå - nya strategiska modellen
  leasingMax?: number;
  flatrateAmount?: number;
  defaultCustomerPrice?: number;
  defaultLeasingPeriod?: string; // String för kompatibilitet
  imageUrl?: string;
  minLeaseMultiplier?: number;
  maxLeaseMultiplier?: number;
  defaultLeaseMultiplier?: number;
  creditPriceMultiplier?: number;
  creditsPerTreatment?: number;
  leasingTariffs?: {[key: string]: number};
  category?: string;
}

const API_BASE_URL = `https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/machines-api`;

/**
 * Inbyggd maskinkatalog som används när machines-api inte svarar.
 * Samma prisunderlag som databasen seedades från (src/data/machines),
 * så kalkylatorn räknar rätt även utan API-kontakt.
 */
const FALLBACK_MACHINES: CalculatorMachine[] = [
  ...premiumMachines.map(m => ({ ...m, category: 'premium' })),
  ...treatmentMachines.map(m => ({ ...m, category: 'treatment' })),
  ...handheldMachines.map(m => ({ ...m, category: 'handheld' })),
  ...specialMachines.map(m => ({ ...m, category: 'special' })),
];

export const useMachineData = () => {
  const [machines, setMachines] = useState<DatabaseMachine[]>([]);
  const [calculatorMachines, setCalculatorMachines] = useState<CalculatorMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const convertToCalculatorFormat = (dbMachine: DatabaseMachine): CalculatorMachine => {
    // Mappa maskinnamn från databas till rätt bildnycklar
    const getPlaceholderImageForMachine = (machineName: string) => {
      const nameToImageKey: {[key: string]: string} = {
        "Emerald": "emerald",
        "Zerona": "zerona", 
        "FX 635": "fx-635",
        "FX 405": "fx-405",
        "XLR8": "xlr8",
        "EVRL": "evrl",
        "GVL": "gvl",
        "Base Station": "base-station",
        "Lunula": "lunula"
      };
      
      const placeholders: {[key: string]: string} = {
        "emerald": "https://i.imgur.com/IRED95Z.png",
        "zerona": "https://i.imgur.com/2LGOVPB.png", 
        "fx-635": "https://i.imgur.com/TQK3vZ3.png",
        "fx-405": "https://i.imgur.com/pYqFUUT.png",
        "xlr8": "https://i.imgur.com/RZIgGZY.png",
        "evrl": "https://i.imgur.com/cuTXUCb.png",
        "gvl": "https://i.imgur.com/8G0fOsI.png",
        "base-station": "https://i.imgur.com/lnCem77.png",
        "lunula": "https://i.imgur.com/QHbeZpX.jpg"
      };
      
      const imageKey = nameToImageKey[machineName];
      return imageKey ? placeholders[imageKey] : "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200&q=80";
    };
    
    // Hitta strategisk data från statiska filer som fallback
    const getStrategicData = (machineName: string) => {
      const allStaticMachines = [...premiumMachines, ...treatmentMachines];
      return allStaticMachines.find(m => m.name === machineName);
    };
    
    const strategicData = getStrategicData(dbMachine.name);
    
    return {
      id: dbMachine.id, // Använd det riktiga UUID:t från databasen istället för konstruerat ID
      name: dbMachine.name,
      description: dbMachine.description || `${dbMachine.name} ${dbMachine.category} maskin`,
      price: dbMachine.price_eur,
      priceEur: dbMachine.price_eur,
      usesCredits: dbMachine.uses_credits,
      creditMin: dbMachine.credit_min,
      creditMax: dbMachine.credit_max || strategicData?.creditMax,
      creditMid1: strategicData?.creditMid1,  // Lägg till från statisk data
      creditMid2: strategicData?.creditMid2,  // Lägg till från statisk data  
      creditMid3: strategicData?.creditMid3,  // Lägg till från statisk data
      leasingMin: dbMachine.leasing_min || strategicData?.leasingMin,
      leasingStandard: dbMachine.leasing_standard || strategicData?.leasingStandard, // Använd statisk data som fallback
      leasingMax: dbMachine.leasing_max || strategicData?.leasingMax,
      flatrateAmount: dbMachine.flatrate_amount,
      defaultCustomerPrice: dbMachine.default_customer_price,
      defaultLeasingPeriod: dbMachine.default_leasing_period.toString(),
      creditsPerTreatment: dbMachine.credits_per_treatment,
      leasingTariffs: dbMachine.leasing_tariffs,
      // Standardvärden för kompatibilitet
      minLeaseMultiplier: 0.5,
      maxLeaseMultiplier: 1.5,
      defaultLeaseMultiplier: 1.0,
      creditPriceMultiplier: 1.0,
      imageUrl: getPlaceholderImageForMachine(dbMachine.name) // Använd maskinnamn för bildmappning
    };
  };

  // Önskad visningsordning baserat på maskinnamn
  const machineOrder = [
    "Emerald",
    "Zerona",
    "FX 635",
    "FX 405",
    "GVL",
    "XLR8",
    "EVRL",
    "Lunula",
    "Base Station"
  ];

  const sortByMachineOrder = (list: CalculatorMachine[]): CalculatorMachine[] =>
    [...list].sort((a, b) => {
      const indexA = machineOrder.indexOf(a.name);
      const indexB = machineOrder.indexOf(b.name);
      // Om maskin inte finns i listan, placera den i slutet
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data: DatabaseMachine[] = await machineApiClient.fetchMachines();

      // Filtrera endast aktiva maskiner för kalkylatorn
      const activeMachines = data.filter(machine => machine.is_active);

      // Konvertera och sortera enligt önskad ordning
      const sortedMachines = sortByMachineOrder(activeMachines.map(convertToCalculatorFormat));

      setMachines(data);
      setCalculatorMachines(sortedMachines);
      setIsUsingFallback(false);

    } catch (error) {
      // API:et är inte nåbart. Kalkylatorn ska ändå fungera: fall tillbaka på
      // den inbyggda maskinkatalogen i stället för att visa ett dött felläge.
      console.error('Error fetching machines:', error);
      console.warn('machines-api svarade inte – använder inbyggd maskinkatalog');

      setMachines([]);
      setCalculatorMachines(sortByMachineOrder(FALLBACK_MACHINES));
      setIsUsingFallback(true);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return {
    machines,           // Rådata från databas för admin-användning
    calculatorMachines, // Konverterade maskiner för kalkylatorn
    isLoading,
    error,
    isUsingFallback,    // true = API otillgängligt, inbyggd katalog används
    refetch: fetchMachines
  };
};