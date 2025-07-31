import { useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { getStrategicLeasingCost } from '@/data/strategicLeasingConstants';

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
    if (!selectedMachine) {
      return [];
    }

    // Grundkostnad = leasingCost
    const grundkostnad = leasingCost;
    
    // FlatrateAmount från maskinen
    const flatrateAmount = selectedMachine.flatrateAmount || 5996; // Default till 5996 för Emerald

    /**
     * EXAKTA BERÄKNINGSFORMLER enligt slutgiltig specifikation:
     */

    const options: AlternativeOption[] = [
      {
        rank: 1,
        name: 'Standard + Flatrate',
        // Formel: Grundkostnad + FlatrateAmount (standard)
        monthlyCost: Math.round(grundkostnad + flatrateAmount),
        hasUnlimitedCredits: true,
        hasFreeCredits: false,
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: `${Math.round(grundkostnad).toLocaleString()} kr (leasing) + ${flatrateAmount.toLocaleString()} kr (Flatrate)`
      },
      {
        rank: 2,
        name: 'Standard + SLA Guld',
        // Formel: Grundkostnad + (0.50 * Grundkostnad)
        monthlyCost: Math.round(grundkostnad + (0.50 * grundkostnad)),
        hasUnlimitedCredits: true,
        hasFreeCredits: true, // Flatrate Credits inbakade i 50%-kostnaden
        slaLevel: 'Guld',
        hasAnnualService: true,
        hasLoanMachine: true,
        description: `${Math.round(grundkostnad).toLocaleString()} kr (leasing) + ${Math.round(0.50 * grundkostnad).toLocaleString()} kr (SLA Guld)`
      },
      {
        rank: 3,
        name: 'Standard + SLA Silver',
        // Formel: Grundkostnad + (0.25 * Grundkostnad) + (0.50 * FlatrateAmount)
        monthlyCost: Math.round(grundkostnad + (0.25 * grundkostnad) + (0.50 * flatrateAmount)),
        hasUnlimitedCredits: true,
        hasFreeCredits: false, // 50% rabatt på Flatrate Credits
        slaLevel: 'Silver',
        hasAnnualService: false,
        hasLoanMachine: true,
        description: `${Math.round(grundkostnad).toLocaleString()} kr (leasing) + ${Math.round(0.25 * grundkostnad).toLocaleString()} kr (SLA Silver) + ${Math.round(0.50 * flatrateAmount).toLocaleString()} kr (Flatrate)`
      },
      {
        rank: 4,
        name: 'Strategipaket',
        // Använd den ursprungliga strategiska leasingkostnaden från STRATEGIC_LEASING_COSTS
        monthlyCost: getStrategicLeasingCost(selectedMachine) || Math.round(grundkostnad),
        hasUnlimitedCredits: true,
        hasFreeCredits: true, // Credits inkluderade
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: `${(getStrategicLeasingCost(selectedMachine) || Math.round(grundkostnad)).toLocaleString()} kr (leasing med inkluderade credits)`
      },
      {
        rank: 5,
        name: 'Standard + SLA Brons',
        // Formel: Grundkostnad
        monthlyCost: Math.round(grundkostnad),
        hasUnlimitedCredits: false,
        hasFreeCredits: false,
        slaLevel: 'Brons',
        hasAnnualService: false,
        hasLoanMachine: false,
        description: `${Math.round(grundkostnad).toLocaleString()} kr (endast leasing)`
      }
    ];

    // Sortera efter månadskostnad (fallande ordning för att behålla rangordning)
    return options.sort((a, b) => b.monthlyCost - a.monthlyCost);
  }, [selectedMachine, leasingCost]);

  return {
    alternatives,
    selectedMachine
  };
};