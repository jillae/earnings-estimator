
import { Machine } from './types';

export const premiumMachines: Machine[] = [
  {
    id: "emerald",
    name: "Emerald",
    fullName: "Emerald Laser System",
    shortName: "Emerald",
    modelCode: "SHL",
    description: "Unik premiumlösning för fettreduktion",
    priceEur: 99500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00045,
    flatrateAmount: 5996,
    usesCredits: true,
    leasingMin: 21716,
    leasingMax: 24116,
    creditMin: 149,
    creditMax: 299,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3500,
    imageUrl: "https://drive.google.com/uc?export=view&id=1jY8a_0g3gK7uM5b8l5G9vA8o9L0uI8T4"
  },
  {
    id: "zerona",
    name: "Zerona",
    fullName: "Z6 Laser System",
    shortName: "Z6",
    modelCode: "SHR",
    description: "Instegsmodell till Emerald - utan medicinskt krav",
    priceEur: 45900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 4356,
    usesCredits: true,
    leasingMin: 10086,
    leasingMax: 11206,
    creditMin: 99,
    creditMax: 199,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1800,
    imageUrl: "https://drive.google.com/uc?export=view&id=1iZ1n_9xWzF4eF7b5d8G1F2x6K5d9wL9y"
  }
];
