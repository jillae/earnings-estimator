import { useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';

export interface AlternativeOption {
  rank: number;
  name: string;
  monthlyCost: number;
  hasUnlimitedCredits: boolean;
  hasFreeCredits: boolean;
  slaLevel: 'Bas' | 'Silver' | 'Guld';
  hasAnnualService: boolean;
  hasLoanMachine: boolean;
  description: string;
}

export const useAlternativesComparison = () => {
  const { 
    selectedMachine, 
    leasingCost,
    operatingCost
  } = useCalculator();

  const alternatives = useMemo((): AlternativeOption[] => {
    if (!selectedMachine) {
      return [];
    }

    const baseLeasingCost = leasingCost;
    const baseSlaPercentage = 0; // Bas SLA
    const silverSlaPercentage = 0.25; // 25% av leasingkostnad
    const goldSlaPercentage = 0.50; // 50% av leasingkostnad
    
    // Flatrate kostnad (från operatingCost)
    const flatrateMonthlyCost = operatingCost.totalCost;

    const options: AlternativeOption[] = [
      {
        rank: 1,
        name: 'Standard + SLA Guld',
        monthlyCost: baseLeasingCost + (baseLeasingCost * goldSlaPercentage),
        hasUnlimitedCredits: true,
        hasFreeCredits: true,
        slaLevel: 'Guld',
        hasAnnualService: true,
        hasLoanMachine: true,
        description: 'Premium service med fullständig support'
      },
      {
        rank: 2,
        name: 'Standard + SLA Silver',
        monthlyCost: baseLeasingCost + (baseLeasingCost * silverSlaPercentage),
        hasUnlimitedCredits: true,
        hasFreeCredits: false,
        slaLevel: 'Silver',
        hasAnnualService: false,
        hasLoanMachine: true,
        description: 'Förbättrad service med lånemaskin'
      },
      {
        rank: 3,
        name: 'Allt-inkluderat',
        monthlyCost: baseLeasingCost, // Credits är inkluderade i priset - INGEN extra kostnad
        hasUnlimitedCredits: true,
        hasFreeCredits: true,
        slaLevel: 'Bas',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Fast månadsavgift med obegränsade behandlingar'
      },
      {
        rank: 4,
        name: 'Standard + Flatrate',
        monthlyCost: baseLeasingCost + flatrateMonthlyCost,
        hasUnlimitedCredits: true,
        hasFreeCredits: false,
        slaLevel: 'Bas',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Kombinerat paket med flatrate för credits'
      },
      {
        rank: 5,
        name: 'Standard + SLA Bas',
        monthlyCost: baseLeasingCost,
        hasUnlimitedCredits: false,
        hasFreeCredits: false,
        slaLevel: 'Bas',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Grundläggande leasingpaket'
      }
    ];

    // Sortera efter månadskostnad (fallande ordning för att behålla rangordning)
    return options.sort((a, b) => b.monthlyCost - a.monthlyCost);
  }, [selectedMachine, leasingCost, operatingCost.totalCost]);

  return {
    alternatives,
    selectedMachine
  };
};