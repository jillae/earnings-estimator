// Verktyg för att generera realistiska finansiella projektioner
// med naturliga fluktuationer, säsongsvariation och marknadsrealism

export interface RealisticDataPoint {
  month: number;
  value: number;
  seasonalFactor: number;
  marketFactor: number;
  confidence?: number;
}

export interface GrowthScenario {
  name: string;
  baseGrowthRate: number;
  volatility: number;
  color: string;
}

/**
 * Genererar säsongsvariation för svenska kliniker
 * Lägre aktivitet sommarmånader (juni-augusti), högre vinter
 */
export const getSeasonalFactor = (month: number): number => {
  const monthIndex = (month - 1) % 12; // 0-11
  
  // Säsongsfaktorer baserat på svenska marknaden
  const seasonalFactors = [
    0.95, // Jan - låg efter nyår
    1.05, // Feb - återhämtning 
    1.10, // Mar - vårkänsla
    1.05, // Apr - stabil
    1.00, // Maj - normal
    0.85, // Jun - sommardipp
    0.75, // Jul - semestertid
    0.80, // Aug - fortfarande semester
    1.05, // Sep - tillbaka efter semester
    1.15, // Okt - höstaktivitet
    1.10, // Nov - innan jul
    0.90  // Dec - julmanad
  ];
  
  return seasonalFactors[monthIndex];
};

/**
 * Genererar marknadsfluktuationer baserat på startup-mönster
 * Långsammare start som gradvis förbättras
 */
export const getMarketFactor = (month: number, volatility: number = 0.1): number => {
  // Startup-kurva: långsam start som förbättras över tid
  const maturityFactor = Math.min(1, 0.6 + (month * 0.03));
  
  // Slumpmässig fluktuation
  const randomFactor = 1 + (Math.random() - 0.5) * volatility;
  
  // Konkurrenspåverkan (minskar över tid när man etablerar sig)
  const competitionFactor = 1 - (0.15 * Math.exp(-month / 12));
  
  return maturityFactor * randomFactor * competitionFactor;
};

/**
 * Genererar realistisk tillväxtdata med fluktuationer
 */
export const generateRealisticGrowthData = (
  baseValue: number,
  growthRate: number,
  months: number,
  volatility: number = 0.15
): RealisticDataPoint[] => {
  const data: RealisticDataPoint[] = [];
  let currentValue = baseValue;
  
  for (let month = 0; month <= months; month++) {
    const seasonalFactor = getSeasonalFactor(month);
    const marketFactor = getMarketFactor(month, volatility);
    
    // Grundläggande tillväxt
    if (month > 0) {
      const monthlyGrowthRate = growthRate / 12 / 100;
      currentValue *= (1 + monthlyGrowthRate);
    }
    
    // Applicera faktorer
    const adjustedValue = currentValue * seasonalFactor * marketFactor;
    
    // Konfidensintervall baserat på månadens mognad
    const confidence = Math.min(0.95, 0.4 + (month * 0.02));
    
    data.push({
      month,
      value: Math.round(adjustedValue),
      seasonalFactor,
      marketFactor,
      confidence
    });
  }
  
  return data;
};

/**
 * Genererar scenariodata med realistiska variationer
 */
export const generateScenarioData = (
  baseRevenue: number,
  scenarios: GrowthScenario[],
  months: number = 60
) => {
  return scenarios.map(scenario => {
    const data = generateRealisticGrowthData(
      baseRevenue,
      scenario.baseGrowthRate,
      months,
      scenario.volatility
    );
    
    return {
      ...scenario,
      data,
      finalValue: data[data.length - 1].value,
      averageValue: data.reduce((sum, point) => sum + point.value, 0) / data.length
    };
  });
};

/**
 * Skapa realistisk break-even kurva med startsvårigheter
 */
export const generateBreakEvenCurve = (
  monthlyRevenue: number,
  monthlyCosts: number,
  months: number = 36
): RealisticDataPoint[] => {
  const data: RealisticDataPoint[] = [];
  let cumulativeProfit = 0;
  
  for (let month = 0; month <= months; month++) {
    const seasonalFactor = getSeasonalFactor(month);
    const marketFactor = getMarketFactor(month, 0.2); // Högre volatilitet för break-even
    
    if (month > 0) {
      const adjustedRevenue = monthlyRevenue * seasonalFactor * marketFactor;
      const adjustedCosts = monthlyCosts * (0.95 + (Math.random() * 0.1)); // Kostnader varierar mindre
      cumulativeProfit += (adjustedRevenue - adjustedCosts);
    }
    
    data.push({
      month,
      value: Math.round(cumulativeProfit),
      seasonalFactor,
      marketFactor,
      confidence: Math.min(0.9, 0.5 + (month * 0.015))
    });
  }
  
  return data;
};

/**
 * Fördefinierade scenarion för svenska kliniker
 */
export const DEFAULT_SCENARIOS: GrowthScenario[] = [
  {
    name: 'Pessimistisk',
    baseGrowthRate: 1,
    volatility: 0.25,
    color: '#ef4444'
  },
  {
    name: 'Realistisk',
    baseGrowthRate: 3,
    volatility: 0.15,
    color: '#3b82f6'
  },
  {
    name: 'Optimistisk',
    baseGrowthRate: 6,
    volatility: 0.20,
    color: '#22c55e'
  }
];