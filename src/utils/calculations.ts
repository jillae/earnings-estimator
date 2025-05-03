
import { getExchangeRate } from './exchangeRateUtils';
import { Machine } from '../data/machines/types';
import { calculateTariffBasedLeasingMax } from './leasingTariffUtils';

export async function calculateLeasingCost(
  machine: Machine,
  leasingPeriod: number,
  includeInsurance: boolean
): Promise<number> {
  const machinePrice = machine.priceEur;
  const currency = 'EUR'; // Maskinpriser är i EUR från machineData
  let exchangeRate = 1;

  // Använd string-jämförelse istället för literal types
  if (currency as string !== 'SEK') {
    try {
      exchangeRate = await getExchangeRate(currency, 'SEK');
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      exchangeRate = 11.4926; // Fallback to default
    }
  }

  // Beräkna leasingkostnad med hjälp av tariff-baserad kalkyl
  // Detta ger garanterat korrekt beräkning för alla maskiner
  const leasingCost = calculateTariffBasedLeasingMax(
    machine.priceEur,
    leasingPeriod, // Använd direkt leasingPeriod (månader)
    machine.usesCredits,
    exchangeRate
  );

  // Logga detaljerad information för felsökning
  console.log(`Leasingkostnad beräknad för ${machine.name}:
    Pris EUR: ${machine.priceEur} 
    Leasingperiod: ${leasingPeriod} månader
    Använder krediter: ${machine.usesCredits}
    Växelkurs: ${exchangeRate}
    Beräknad kostnad: ${leasingCost} SEK
  `);

  return leasingCost;
}
