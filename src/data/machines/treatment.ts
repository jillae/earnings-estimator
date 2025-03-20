
import { Machine } from './types';

export const treatmentMachines: Machine[] = [
  {
    id: "fx-635",
    name: "FX 635",
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
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop"
  },
  {
    id: "fx-405",
    name: "FX 405",
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
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop"
  }
];
