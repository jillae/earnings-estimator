
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
    leasingMin: 23303,      // Strategisk minimum - högsta creditkostnad (299 kr/credit)
    leasingStandard: 25806, // Standard nivå - marknadsrelevant creditkostnad (149 kr/credit) 
    leasingMax: 33863,      // Strategisk maximum - noll creditkostnad (0 kr/credit)
    creditMax: 299,         // Position 0 - Högsta creditpris
    creditMid1: 224,        // Position 1 - Mellan
    creditMid2: 149,        // Position 2 - Standard (mitten)
    creditMid3: 75,         // Position 3 - Mellan
    // Position 4 är alltid 0
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3500,
    imageUrl: "https://i.imgur.com/IRED95Z.png"
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
    leasingMin: 10736,      // Strategisk minimum (46% av Emerald)
    leasingStandard: 11892, // Standard nivå (46% av Emerald)
    leasingMax: 15600,      // Strategisk maximum (46% av Emerald)
    creditMax: 199,         // Position 0 - Högsta creditpris
    creditMid1: 149,        // Position 1 - Mellan
    creditMid2: 99,         // Position 2 - Standard (mitten)
    creditMid3: 50,         // Position 3 - Mellan
    // Position 4 är alltid 0
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1800,
    imageUrl: "https://i.imgur.com/2LGOVPB.png"
  }
];
