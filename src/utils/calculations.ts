
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

  if (currency !== 'SEK') {
    exchangeRate = await getExchangeRate(currency, 'SEK');
  }

  const machinePriceSek = machinePrice * exchangeRate;

  // Använd standardtaxa om maskinen inte har specifika tariffsatser
  let tariff = 0.04; // Standardtaxa
  
  // Säkerställ att vi endast försöker komma åt leasingTariffs om det finns
  if (machine.leasingTariffs && machine.leasingTariffs[leasingPeriod] !== undefined) {
    tariff = machine.leasingTariffs[leasingPeriod];
  }
    
  let leasingCost = (machinePriceSek * tariff) / 12;

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

  leasingCost += insuranceCost;

  return leasingCost;
}
