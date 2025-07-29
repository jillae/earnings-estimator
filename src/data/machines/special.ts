
import { Machine } from './types';

export const specialMachines: Machine[] = [
  {
    id: "base-station",
    name: "Base Station",
    fullName: "Base Station",
    shortName: "BST",
    modelCode: "BST",
    description: "Set om 3st. handhållna för högpresterande kliniker",
    priceEur: 30900,
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
    defaultCustomerPrice: 3600,
    imageUrl: "https://drive.google.com/uc?export=view&id=1gQ7R_j4zYl4R8z7P0b6b2vU6R4T6yP8n"
  },
  {
    id: "lunula",
    name: "Lunula",
    fullName: "Lunula Laser",
    shortName: "Lunula",
    modelCode: "FFS",
    description: "Specialiserad behandlingsutrustning för medicinsk fotvård",
    priceEur: 25900,
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
    defaultCustomerPrice: 4000,
    imageUrl: "https://drive.google.com/uc?export=view&id=1hW4c_i3aJ5rQ8E2xL9b9V1P9z5x7b7j9"
  }
];
