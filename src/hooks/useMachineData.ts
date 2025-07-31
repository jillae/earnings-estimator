/**
 * HOOK FÖR MASKINDATA FRÅN DATABAS
 * 
 * Centraliserad hantering av maskindata från Supabase API
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { machineApiClient } from '@/utils/machineApiClient';

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
  creditMin?: number;
  creditMax?: number;
  leasingMin?: number;
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
}

const API_BASE_URL = `https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/machines-api`;

export const useMachineData = () => {
  const [machines, setMachines] = useState<DatabaseMachine[]>([]);
  const [calculatorMachines, setCalculatorMachines] = useState<CalculatorMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const convertToCalculatorFormat = (dbMachine: DatabaseMachine): CalculatorMachine => {
    return {
      id: dbMachine.id, // Använd det riktiga UUID:t från databasen istället för konstruerat ID
      name: dbMachine.name,
      description: dbMachine.description || `${dbMachine.name} ${dbMachine.category} maskin`,
      price: dbMachine.price_eur,
      priceEur: dbMachine.price_eur,
      usesCredits: dbMachine.uses_credits,
      creditMin: dbMachine.credit_min,
      creditMax: dbMachine.credit_max,
      leasingMin: dbMachine.leasing_min,
      leasingMax: dbMachine.leasing_max,
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
      imageUrl: `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop` // Placeholder till dess bilderna läggs till i DB
    };
  };

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data: DatabaseMachine[] = await machineApiClient.fetchMachines();
      
      // Filtrera endast aktiva maskiner för kalkylatorn
      const activeMachines = data.filter(machine => machine.is_active);
      
      setMachines(data);
      setCalculatorMachines(activeMachines.map(convertToCalculatorFormat));
      
    } catch (error) {
      console.error('Error fetching machines:', error);
      const errorMessage = `Kunde inte hämta maskindata: ${error instanceof Error ? error.message : 'Okänt fel'}`;
      setError(errorMessage);
      
      console.warn('API failed, no database machines available');
      setCalculatorMachines([]);
      
      toast({
        title: "Varning",
        description: "Kunde inte hämta maskindata från databasen",
        variant: "destructive",
      });
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
    refetch: fetchMachines
  };
};