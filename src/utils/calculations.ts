import { getExchangeRate } from './exchangeRate';
import { Machine } from '../data/machineData'; // Import the Machine type

export async function calculateLeasingCost(
  machine: Machine,
  leasingPeriod: number,
  includeInsurance: boolean
): Promise<number> {
  const machinePrice = machine.priceEur;
  const currency = 'EUR'; // Machine prices are in EUR from the machineData
  let exchangeRate = 1;

  if (currency !== 'SEK') {
    exchangeRate = await getExchangeRate(currency, 'SEK');
  }

  const machinePriceSek = machinePrice * exchangeRate;

  const tariff = machine.leasingTariffs && machine.leasingTariffs[leasingPeriod] 
    ? machine.leasingTariffs[leasingPeriod] 
    : 0.04;
    
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
