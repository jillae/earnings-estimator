
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
    leasingMin: 7872,
    leasingMax: 13893, // Strategisk kostnad - strategimodell-pris
    creditMin: 75,      // Kreditpris vid gamla leasingMax (mitten)
    creditMax: 159,     // Kreditpris vid leasingMin
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 900,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&h=200&q=80"
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
    leasingMin: 9317,
    leasingMax: 16673, // Strategisk kostnad - strategimodell-pris
    creditMin: 95,      // Kreditpris vid gamla leasingMax (mitten)
    creditMax: 199,     // Kreditpris vid leasingMin
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200,
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=300&h=200&q=80"
  }
];
