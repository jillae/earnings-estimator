
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
    leasingMin: 20666,
    leasingMax: 33863, // Strategisk kostnad - strategimodell-pris
    creditMin: 149,     // Kreditpris vid gamla leasingMax (mitten)
    creditMax: 299,     // Kreditpris vid leasingMin
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3500,
    imageUrl: "https://i.imgur.com/KzJ8vYm.jpg"
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
    leasingMin: 9605,
    leasingMax: 17043, // Strategisk kostnad - strategimodell-pris
    creditMin: 99,      // Kreditpris vid gamla leasingMax (mitten)
    creditMax: 199,     // Kreditpris vid leasingMin
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1800,
    imageUrl: "https://i.imgur.com/vwP7Qxj.jpg"
  }
];
