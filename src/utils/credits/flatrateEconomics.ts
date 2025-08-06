/**
 * KRITISK MODUL: Flatrate Ekonomiska Beräkningar
 * 
 * Denna modul hanterar den affärskritiska logiken för att avgöra
 * när Flatrate är ekonomiskt fördelaktigt jämfört med styckpris.
 * 
 * HUVUDREGEL: Flatrate blir lönsamt vid fler än 2 behandlingar per dag
 */

import { Machine } from '@/data/machines/types';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

export interface FlatrateEconomics {
  isEconomicallyViable: boolean;          // > 2 behandlingar per dag
  breakEvenPoint: number;                 // Exakt brytpunkt för lönsamhet
  monthlySavings: number;                 // Besparing per månad (kan vara negativ)
  costPerCredit: number;                  // Aktuell kostnad per credit
  flatrateCostPerMonth: number;           // Flatrate-kostnad per månad
  creditCostPerMonth: number;             // Styckpris-kostnad per månad
  recommendedChoice: 'flatrate' | 'perCredit'; // Rekommendation baserat på ekonomi
}

/**
 * HUVUDFUNKTION: Beräknar om Flatrate är ekonomiskt fördelaktigt
 * 
 * @param treatmentsPerDay - Antal behandlingar per dag
 * @param machine - Maskindata med flatrate-pris och credits per behandling
 * @param creditPrice - Aktuell kostnad per credit
 * @param selectedSlaLevel - SLA-nivå som påverkar flatrate-kostnad
 * @returns Komplett ekonomisk analys
 */
export function calculateFlatrateEconomics(
  treatmentsPerDay: number,
  machine: Machine,
  creditPrice: number,
  selectedSlaLevel: 'Brons' | 'Silver' | 'Guld' = 'Brons'
): FlatrateEconomics {
  
  console.log(`💰 FLATRATE ECONOMICS ANALYS:
    Behandlingar per dag: ${treatmentsPerDay}
    Maskin: ${machine.name}
    Credit-pris: ${creditPrice} kr
    SLA-nivå: ${selectedSlaLevel}
  `);

  // Grunddata
  const creditsPerTreatment = machine.creditsPerTreatment || 1;
  const rawFlatrateCost = machine.flatrateAmount || 0;
  
  // Beräkna flatrate-kostnad med SLA-rabatter
  let flatrateCostPerMonth = rawFlatrateCost;
  if (selectedSlaLevel === 'Silver') {
    flatrateCostPerMonth = rawFlatrateCost * 0.5; // 50% rabatt
  } else if (selectedSlaLevel === 'Guld') {
    flatrateCostPerMonth = 0; // 100% rabatt (gratis)
  }
  
  // Beräkna styckpris-kostnad per månad
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const creditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditCostPerMonth = creditsPerMonth * creditPrice;
  
  // Besparing (positivt = flatrate sparar pengar)
  const monthlySavings = creditCostPerMonth - flatrateCostPerMonth;
  
  // KRITISK REGEL: Flatrate är ekonomiskt fördelaktigt vid > 2 behandlingar per dag
  const isEconomicallyViable = treatmentsPerDay > 2;
  
  // Beräkna exakt brytpunkt för lönsamhet
  const breakEvenCreditsPerMonth = flatrateCostPerMonth / creditPrice;
  const breakEvenTreatmentsPerMonth = breakEvenCreditsPerMonth / creditsPerTreatment;
  const breakEvenPoint = breakEvenTreatmentsPerMonth / WORKING_DAYS_PER_MONTH;
  
  // Rekommendation baserat på ekonomi
  const recommendedChoice: 'flatrate' | 'perCredit' = monthlySavings > 0 ? 'flatrate' : 'perCredit';
  
  const result: FlatrateEconomics = {
    isEconomicallyViable,
    breakEvenPoint,
    monthlySavings,
    costPerCredit: creditPrice,
    flatrateCostPerMonth,
    creditCostPerMonth,
    recommendedChoice
  };
  
  console.log(`💰 EKONOMISK ANALYS RESULTAT:
    Ekonomiskt fördelaktigt (>2/dag): ${isEconomicallyViable}
    Brytpunkt: ${breakEvenPoint.toFixed(1)} behandlingar/dag
    Månadsbesparingar: ${monthlySavings.toFixed(0)} kr
    Rekommendation: ${recommendedChoice}
    Flatrate-kostnad: ${flatrateCostPerMonth} kr/mån
    Styckpris-kostnad: ${creditCostPerMonth} kr/mån
  `);
  
  return result;
}

/**
 * HJÄLPFUNKTION: Genererar rekommendationstext baserat på ekonomisk analys
 */
export function getFlatrateRecommendationText(economics: FlatrateEconomics): {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
} {
  const { isEconomicallyViable, monthlySavings, breakEvenPoint } = economics;
  
  if (isEconomicallyViable && monthlySavings > 0) {
    return {
      title: "Flatrate rekommenderas",
      description: `Flatrate sparar ${Math.abs(monthlySavings).toFixed(0)} kr/mån vid din valda volym. Ekonomiskt fördelaktigt vid fler än 2 behandlingar per dag.`,
      type: 'positive'
    };
  } else if (!isEconomicallyViable) {
    return {
      title: "Styckpris rekommenderas", 
      description: `Vid ${economics.breakEvenPoint < 2 ? 'låg' : 'din'} behandlingsvolym är styckpris mer kostnadseffektivt. Flatrate blir lönsamt vid ${breakEvenPoint.toFixed(1)}+ behandlingar per dag.`,
      type: 'negative'
    };
  } else {
    return {
      title: "Jämn kostnad",
      description: `Kostnaderna är ungefär lika. Välj flatrate för förutsägbar budgetering eller styckpris för flexibilitet.`,
      type: 'neutral'
    };
  }
}