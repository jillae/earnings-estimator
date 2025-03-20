
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
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3600,
    imageUrl: "/lovable-uploads/a2cbbb39-639e-4041-bac6-ca7ef5c1c329.png#xywh=498,0,83,341"
  },
  {
    id: "lunula",
    name: "Lunula",
    fullName: "Lunula Laser",
    shortName: "Lunula",
    modelCode: "FFS",
    description: "Specialiserad behandlingsutrustning för medicinsk fotvård.",
    priceEur: 25900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 4000,
    imageUrl: "/lovable-uploads/a2cbbb39-639e-4041-bac6-ca7ef5c1c329.png#xywh=581,0,83,341"
  }
];
