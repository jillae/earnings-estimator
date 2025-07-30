import { useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';

export interface AlternativeOption {
  rank: number;
  name: string;
  monthlyCost: number;
  hasUnlimitedCredits: boolean;
  hasFreeCredits: boolean;
  slaLevel: 'Brons' | 'Silver' | 'Guld';
  hasAnnualService: boolean;
  hasLoanMachine: boolean;
  description: string;
}

export const useAlternativesComparison = () => {
  const { 
    selectedMachine, 
    leasingCost,
    operatingCost,
    slaCosts,
    leasingMax60mRef
  } = useCalculator();

  const alternatives = useMemo((): AlternativeOption[] => {
    if (!selectedMachine || !slaCosts) {
      return [];
    }

    const baseLeasingCost = leasingCost; // 25 835 kr
    
    // Använd de riktiga SLA-kostnaderna från slaCosts
    const slaBronsCost = slaCosts.Brons || 0; // 0 kr
    const slaSilverCost = slaCosts.Silver || 0; // 6 459 kr (25% av leasingMax60mRef)
    const slaGuldCost = slaCosts.Guld || 0; // 12 916 kr (50% av leasingMax60mRef)
    
    // Flatrate kostnad - fast värde 5 996 kr
    const flatrateMonthlyCost = 5996;
    
    // Allt-inkluderat pris - fast värde baserat på dina data
    const alltInkluderatCost = 33863;

    const options: AlternativeOption[] = [
      {
        rank: 1,
        name: 'Standard + SLA Guld',
        monthlyCost: baseLeasingCost + slaGuldCost, // 25 835 + 12 916 = 38 751
        hasUnlimitedCredits: true,
        hasFreeCredits: true, // Flatrate 100% rabatt
        slaLevel: 'Guld',
        hasAnnualService: true,
        hasLoanMachine: true,
        description: `${baseLeasingCost.toLocaleString()} (leasing) + ${slaGuldCost.toLocaleString()} (SLA Guld)`
      },
      {
        rank: 2,
        name: 'Standard + SLA Silver',
        monthlyCost: baseLeasingCost + slaSilverCost + (flatrateMonthlyCost * 0.5), // 25 835 + 6 459 + 2 998 = 35 292
        hasUnlimitedCredits: true,
        hasFreeCredits: false, // Flatrate 50% rabatt
        slaLevel: 'Silver',
        hasAnnualService: false,
        hasLoanMachine: true,
        description: `${baseLeasingCost.toLocaleString()} (leasing) + ${slaSilverCost.toLocaleString()} (SLA Silver) + ${(flatrateMonthlyCost * 0.5).toLocaleString()} (Flatrate)`
      },
      {
        rank: 3,
        name: 'Allt-inkluderat',
        monthlyCost: alltInkluderatCost, // 33 863 kr
        hasUnlimitedCredits: true,
        hasFreeCredits: true,
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Fast pris för maskin + obegränsade credits'
      },
      {
        rank: 4,
        name: 'Standard + Flatrate',
        monthlyCost: baseLeasingCost + flatrateMonthlyCost, // 25 835 + 5 996 = 30 205
        hasUnlimitedCredits: true,
        hasFreeCredits: false,
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: `${baseLeasingCost.toLocaleString()} (leasing) + ${flatrateMonthlyCost.toLocaleString()} (Flatrate)`
      },
      {
        rank: 5,
        name: 'Standard + SLA Brons',
        monthlyCost: baseLeasingCost + slaBronsCost, // 25 835 + 0 = 25 835
        hasUnlimitedCredits: false,
        hasFreeCredits: false,
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Endast leasing'
      }
    ];

    // Sortera efter månadskostnad (fallande ordning för att behålla rangordning)
    return options.sort((a, b) => b.monthlyCost - a.monthlyCost);
  }, [selectedMachine, leasingCost, slaCosts]);

  return {
    alternatives,
    selectedMachine
  };
};