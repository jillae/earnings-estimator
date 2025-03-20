
import { Machine } from './types';

export const treatmentMachines: Machine[] = [
  {
    id: "fx-635",
    name: "FX 635",
    fullName: "FX 635 Laser",
    shortName: "FX635",
    modelCode: "HPS",
    description: "Effektiv behandlingslösning för kliniker",
    priceEur: 37500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 3296,
    usesCredits: true,
    leasingMin: 8267,
    leasingMax: 9186,
    creditMin: 75,
    creditMax: 159,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 900,
    imageUrl: "https://erchonia.com/wp-content/uploads/2020/09/FX-635-web-optimized-scaled.jpg"
  },
  {
    id: "fx-405",
    name: "FX 405",
    fullName: "FX 405 Laser",
    shortName: "FX405",
    modelCode: "MLS-AC",
    description: "Avancerad behandlingslösning för kliniker",
    priceEur: 44500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 4176,
    usesCredits: true,
    leasingMin: 9784,
    leasingMax: 10871,
    creditMin: 95,
    creditMax: 199,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200,
    imageUrl: "https://erchonia.com/wp-content/uploads/2023/11/FX-405.jpg"
  }
];
