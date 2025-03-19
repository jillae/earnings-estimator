
import { getExchangeRate } from './exchangeRate';
import { Machine } from '../data/machineData'; // Importera Machine-typen

export async function calculateLeasingCost(
  machine: Machine,
  leasingPeriod: number,
  includeInsurance: boolean
): Promise<number> {
  const machinePrice = machine.priceEur;
  const currency = 'EUR'; // Maskinpriser är i EUR från machineData
  let exchangeRate = 1;

  // Correctly compare strings with strict equality instead of comparing string literal types
  if (currency !== 'SEK') {
    exchangeRate = await getExchangeRate(currency, 'SEK');
  }

  const machinePriceSek = machinePrice * exchangeRate;

  // Beräkna leasingkostnad
  let baseLeasingCost: number;
  
  if (machine.leasingMin !== undefined && machine.leasingMax !== undefined) {
    // Om leasingMin och leasingMax finns, använd leasingMin som default
    baseLeasingCost = machine.leasingMin;
  } else {
    // Använd standardtaxa om maskinen inte har specifika tariffsatser
    let tariff = 0.04; // Standardtaxa
    
    // Säkerställ att vi endast försöker komma åt leasingTariffs om det finns
    if (machine.leasingTariffs && machine.leasingTariffs[leasingPeriod] !== undefined) {
      tariff = machine.leasingTariffs[leasingPeriod];
    }
      
    baseLeasingCost = (machinePriceSek * tariff) / 12;
  }

  // Avrunda till närmaste 500
  baseLeasingCost = Math.round(baseLeasingCost / 500) * 500;

  let insuranceCost = 0;
  if (includeInsurance) {
    let insuranceRate = 0.015;
    if (machinePriceSek <= 10000) {
      insuranceRate = 0.04;
    } else if (machinePriceSek <= 20000) {
      insuranceRate = 0.03;
    } else if (machinePriceSek <= 50000) {
      insuranceRate = 0.025;
    }

    insuranceCost = machinePriceSek * insuranceRate / 12;
  }

  let leasingCost = baseLeasingCost + insuranceCost;

  return leasingCost;
}
