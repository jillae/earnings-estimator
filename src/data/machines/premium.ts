
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
    creditMin: 149,         // Marknadsrelevant creditpris (standard nivå - position 1.0)
    creditMax: 299,         // Högsta creditpris (minimum leasing - position 0.0)
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
    creditMin: 149,         // Samma marknadsrelevanta creditpris som Emerald
    creditMax: 199,         // Lägre än Emerald pga lägre maskinpris
    creditsPerTreatment: 1,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1800,
    imageUrl: "https://i.imgur.com/2LGOVPB.png"
  }
];
