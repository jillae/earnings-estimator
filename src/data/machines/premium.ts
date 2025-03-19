
import { Machine } from './types';

export const premiumMachines: Machine[] = [
  {
    id: "emerald",
    name: "Emerald",
    description: "Unik premiumlösning för fettreduktion",
    priceEur: 99500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00045,
    flatrateAmount: 5996,
    usesCredits: true,
    leasingMin: 21703,
    leasingMax: 24114,
    creditMin: 149,
    creditMax: 299,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095,
      "72": 0.01825
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3500
  },
  {
    id: "zerona",
    name: "Zerona",
    description: "Instegsmodell till Emerald - utan medicinskt krav",
    priceEur: 45900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 4356,
    usesCredits: true,
    leasingMin: 10087,
    leasingMax: 11208,
    creditMin: 99,
    creditMax: 199,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095,
      "72": 0.01825
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1800
  }
];
