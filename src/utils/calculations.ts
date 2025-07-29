
import { getExchangeRate } from './exchangeRateUtils';
import { Machine } from '../data/machines/types';
import { calculateTariffBasedLeasingMax } from './leasingTariffUtils';
import { calculateInsuranceCost } from './insuranceUtils';

export async function calculateLeasingCost(
  machine: Machine,
  leasingRate: number,
  includeInsurance: boolean,
  leasingPeriodMonths: number = 60
): Promise<number> {
  // Validering - Säkerställ att vi har en giltig maskin
  if (!machine || !machine.priceEur) {
    console.error('Försök att beräkna leasingkostnad för ogiltig maskin', machine);
    return 0;
  }

  console.log(`BERÄKNAR LEASINGKOSTNAD för ${machine.name} (${machine.id}):
    pris EUR: ${machine.priceEur}
    leasingRate: ${leasingRate}
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
      LeasingRate: ${leasingRate}
      includeInsurance: ${includeInsurance}
    `);
  }

  // Beräkna leasingkostnad med hjälp av tariff-baserad kalkyl
  // Detta ger garanterat korrekt beräkning för alla maskiner
  const leasingCost = calculateTariffBasedLeasingMax(
    machine.priceEur,
    leasingPeriodMonths, // Använd den valda leasingperioden
    machine.usesCredits,
    exchangeRate
  );

  // Lägg till försäkring om det är aktiverat
  let finalLeasingCost = leasingCost;
  if (includeInsurance) {
    const machinePriceSEK = machine.priceEur * exchangeRate;
    const insuranceCost = calculateInsuranceCost(machinePriceSEK);
    finalLeasingCost += insuranceCost;
    console.log(`Försäkringskostnad tillagd: ${insuranceCost} SEK/månad`);
  }

  // Logga detaljerad information för felsökning
  console.log(`Leasingkostnad beräknad för ${machine.name}:
    Pris EUR: ${machine.priceEur} 
    Leasingperiod: ${leasingPeriodMonths} månader
    LeasingRate: ${leasingRate}
    Använder krediter: ${machine.usesCredits}
    Växelkurs: ${exchangeRate}
    Beräknad basekostnad: ${leasingCost} SEK
    Inkludera försäkring: ${includeInsurance}
    Slutkostnad: ${finalLeasingCost} SEK
  `);

  return finalLeasingCost;
}
