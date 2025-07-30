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

    const baseLeasingCost = leasingCost;
    
    // Använd de riktiga SLA-kostnaderna från slaCosts
    const slaBronsCost = slaCosts.Brons || 0;
    const slaSilverCost = slaCosts.Silver || 0;
    const slaGuldCost = slaCosts.Guld || 0;
    
    // Flatrate kostnad (från operatingCost)
    const flatrateMonthlyCost = selectedMachine.flatrateAmount || 0;

    const options: AlternativeOption[] = [
      {
        rank: 1,
        name: 'Standard + SLA Guld',
        monthlyCost: baseLeasingCost + slaGuldCost,
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
        monthlyCost: baseLeasingCost + slaSilverCost,
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
        slaLevel: 'Brons',
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
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Kombinerat paket med flatrate för credits'
      },
      {
        rank: 5,
        name: 'Standard + SLA Brons',
        monthlyCost: baseLeasingCost + slaBronsCost,
        hasUnlimitedCredits: false,
        hasFreeCredits: false,
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: 'Grundläggande leasingpaket'
      }
    ];

    // Sortera efter månadskostnad (fallande ordning för att behålla rangordning)
    return options.sort((a, b) => b.monthlyCost - a.monthlyCost);
  }, [selectedMachine, leasingCost, operatingCost.totalCost, slaCosts]);

  return {
    alternatives,
    selectedMachine
  };
};