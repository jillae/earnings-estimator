
import { Machine } from './types';

export const handheldMachines: Machine[] = [
  {
    id: "xlr8",
    name: "XLR8",
    fullName: "XLaser Laser",
    shortName: "XLR8",
    modelCode: "HLS",
    description: "Instegsmodell av handhållen behandlingsutrustning",
    priceEur: 9900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 500,
    imageUrl: "https://i.imgur.com/RZIgGZY.png"
  },
  {
    id: "evrl",
    name: "EVRL",
    fullName: "Erchonia Violet & Red Laser",
    shortName: "EVRL",
    modelCode: "EVRL",
    description: "Specialanpassad utrustning för särskilda behandlingar",
    priceEur: 17900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 800,
    imageUrl: "https://i.imgur.com/cuTXUCb.png"
  },
  {
    id: "gvl",
    name: "GVL",
    fullName: "GVL",
    shortName: "GVL",
    modelCode: "GVL",
    description: "Senaste modellen av handhållen behandlingsutrustning",
    priceEur: 19900, // Verifierat korrekt EUR-pris
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false, // Bekräftat att GVL INTE använder krediter
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200,
    imageUrl: "https://i.imgur.com/8G0fOsI.png"
  }
];
