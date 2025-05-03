
import { getExchangeRate } from './exchangeRateUtils';
import { Machine } from '../data/machines/types';
import { calculateTariffBasedLeasingMax } from './leasingTariffUtils';

export async function calculateLeasingCost(
  machine: Machine,
  leasingPeriod: number,
  includeInsurance: boolean
): Promise<number> {
  // Validering - Säkerställ att vi har en giltig maskin
  if (!machine || !machine.priceEur) {
    console.error('Försök att beräkna leasingkostnad för ogiltig maskin', machine);
    return 0;
  }

  console.log(`BERÄKNAR LEASINGKOSTNAD för ${machine.name} (${machine.id}):
    pris EUR: ${machine.priceEur}
    leasingPeriod: ${leasingPeriod} månader
    includeInsurance: ${includeInsurance}
    usesCredits: ${machine.usesCredits}
  `);
  
  const machinePrice = machine.priceEur;
  const currency = 'EUR'; // Maskinpriser är i EUR från machineData
  let exchangeRate = 1;

  // Använd string-jämförelse istället för literal types
  if (currency as string !== 'SEK') {
    try {
      exchangeRate = await getExchangeRate(currency, 'SEK');
      console.log(`Använder växelkurs: ${exchangeRate} för ${currency} -> SEK`);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      exchangeRate = 11.4926; // Fallback to default
      console.log(`Använder fallback växelkurs: ${exchangeRate}`);
    }
  }

  // FELSÖKNING: Logga värden för handheld machines tydligt
  if (machine.id === 'gvl' || machine.id === 'evrl' || machine.id === 'xlr8') {
    console.log(`SPECIALLOGGNING för handhållen maskin ${machine.name}:
      EUR pris: ${machine.priceEur}
      Exchange rate: ${exchangeRate}
      Månadspris i SEK (utan tariff): ${machine.priceEur * exchangeRate}
      Leasingperiod: ${leasingPeriod}
    `);
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
