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
    const silverSlaPercentage = 0.25; // 25% av grundkostnad
    const goldSlaPercentage = 0.50; // 50% av grundkostnad
    
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
        description: `Grundkostnad + ${(goldSlaPercentage * 100)}% av grundkostnad`
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
        description: `Grundkostnad + ${(silverSlaPercentage * 100)}% av grundkostnad`
      },
      {
        rank: 3,
        name: 'Allt-inkluderat',
        monthlyCost: baseLeasingCost + flatrateMonthlyCost,
        hasUnlimitedCredits: true,
        hasFreeCredits: true,
        slaLevel: 'Bas',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Fast pris för maskin + obegränsade credits'
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
        description: 'Grundkostnad + Flatrate-amount'
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
        description: 'Endast leasing'
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