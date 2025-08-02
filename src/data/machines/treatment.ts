
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
    leasingMin: 8784,       // Strategisk minimum (38% av Emerald)
    leasingStandard: 9806,  // Standard nivå (38% av Emerald)
    leasingMax: 12886,      // Strategisk maximum (38% av Emerald)
    creditMax: 159,         // Position 0 - Högsta creditpris
    creditMid1: 119,        // Position 1 - Mellan
    creditMid2: 79,         // Position 2 - Standard (mitten)
    creditMid3: 39,         // Position 3 - Mellan
    // Position 4 är alltid 0
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 900,
    imageUrl: "https://i.imgur.com/TQK3vZ3.png"
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
    leasingMin: 10426,      // Strategisk minimum (45% av Emerald)
    leasingStandard: 11613, // Standard nivå (45% av Emerald)
    leasingMax: 15238,      // Strategisk maximum (45% av Emerald)
    creditMax: 199,         // Position 0 - Högsta creditpris
    creditMid1: 149,        // Position 1 - Mellan
    creditMid2: 99,         // Position 2 - Standard (mitten)
    creditMid3: 49,         // Position 3 - Mellan
    // Position 4 är alltid 0
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200,
    imageUrl: "https://i.imgur.com/pYqFUUT.png"
  }
];
