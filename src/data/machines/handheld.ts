
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
    leasingTariffs: {
      "24": 0.045136,
      "36": 0.031346,
      "48": 0.024475,
      "60": 0.020372
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 500,
    imageUrl: "https://drive.google.com/uc?export=view&id=1dG9Y0t10aQ_T6f2I7i6Z6D5A2HjX3L6p"
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
    leasingTariffs: {
      "24": 0.045136,
      "36": 0.031346,
      "48": 0.024475,
      "60": 0.020372
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 800,
    imageUrl: "https://drive.google.com/uc?export=view&id=1eO2pQ9o9tJ4vX8eN5i3W4K-w5S9i1V2j"
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
    leasingTariffs: {
      "24": 0.045136,
      "36": 0.031346,
      "48": 0.024475,
      "60": 0.020372
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200,
    imageUrl: "https://drive.google.com/uc?export=view&id=1fJ5A_7g1tL5nJ4tW0H9tT7pM9h5I2Q2X"
  }
];
