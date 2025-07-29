/**
 * HOOK FÖR MASKINDATA FRÅN DATABAS
 * 
 * Centraliserad hantering av maskindata från Supabase API
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

// Konvertera från databas-format till kalkylatorkompatibelformat (kompatibel med Machine interface)
export interface CalculatorMachine {
  id: string;
  name: string;
  priceEUR?: number;
  isPremium?: boolean;
  usesCredits: boolean;
  creditMin?: number;
  creditMax?: number;
  flatrateAmount?: number;
  defaultCustomerPrice?: number;
  defaultLeasingPeriod?: string; // String för kompatibilitet med Machine
  leasingMin?: number;
  leasingMax?: number;
  creditsPerTreatment?: number;
  description?: string;
  category?: string;
  leasingTariffs?: Record<string, number>;
  // Lägg till egenskaper som krävs av Machine interface
  priceEur?: number;
  price?: string | number;
  minLeaseMultiplier?: number;
  maxLeaseMultiplier?: number;
  defaultLeaseMultiplier?: number;
  creditPriceMultiplier?: number;
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
      id: dbMachine.name.toLowerCase(), // Använd name som id för bakåtkompatibilitet
      name: dbMachine.name,
      priceEUR: dbMachine.price_eur,
      priceEur: dbMachine.price_eur,
      price: dbMachine.price_eur,
      isPremium: dbMachine.is_premium,
      usesCredits: dbMachine.uses_credits,
      creditMin: dbMachine.credit_min,
      creditMax: dbMachine.credit_max,
      flatrateAmount: dbMachine.flatrate_amount,
      defaultCustomerPrice: dbMachine.default_customer_price,
      defaultLeasingPeriod: dbMachine.default_leasing_period.toString(),
      leasingMin: dbMachine.leasing_min,
      leasingMax: dbMachine.leasing_max,
      creditsPerTreatment: dbMachine.credits_per_treatment,
      description: dbMachine.description || undefined,
      category: dbMachine.category,
      leasingTariffs: dbMachine.leasing_tariffs,
      // Standardvärden för Machine-kompatibilitet
      minLeaseMultiplier: 0.5,
      maxLeaseMultiplier: 1.5,
      defaultLeaseMultiplier: 1.0,
      creditPriceMultiplier: 1.0
    };
  };

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2Jodnpta211aW1mcWxpc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODU0NzEsImV4cCI6MjA1ODY2MTQ3MX0.IoF29f8q4G1hOMmU7bP6QqV_rCWPtXcJi9d6Wx0WHEo`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2Jodnpta211aW1mcWxpc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODU0NzEsImV4cCI6MjA1ODY2MTQ3MX0.IoF29f8q4G1hOMmU7bP6QqV_rCWPtXcJi9d6Wx0WHEo',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: DatabaseMachine[] = await response.json();
      
      // Filtrera endast aktiva maskiner för kalkylatorn
      const activeMachines = data.filter(machine => machine.is_active);
      
      setMachines(data);
      setCalculatorMachines(activeMachines.map(convertToCalculatorFormat));
      
    } catch (error) {
      console.error('Error fetching machines:', error);
      const errorMessage = `Kunde inte hämta maskindata: ${error instanceof Error ? error.message : 'Okänt fel'}`;
      setError(errorMessage);
      
      // Fallback till hårdkodade maskiner om API failar (men bara under utveckling)
      console.warn('Falling back to hardcoded machine data');
      setCalculatorMachines([]);
      
      toast({
        title: "Varning",
        description: "Använder reservdata för maskiner. Kontakta administratör.",
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