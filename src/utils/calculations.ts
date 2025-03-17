import { getExchangeRate } from './exchangeRate'; // Import the function

export async function calculateLeasingCost(
  machine: Machine,
  leasingPeriod: number,
  includeInsurance: boolean
): Promise<number> {
  const machinePrice = machine.price;
  const currency = machine.currency;
  let exchangeRate = 1;

  if (currency !== 'SEK') {
    exchangeRate = await getExchangeRate(currency, 'SEK');
  }

  const machinePriceSek = machinePrice * exchangeRate;

  const tariff = machine.leasingTariffs[leasingPeriod] || 0.04;
  let leasingCost = (machinePriceSek * tariff) / 12;

  // ... rest of the leasing cost calculation logic
  // ... including insurance and adjustments

  return leasingCost;
}
