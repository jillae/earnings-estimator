
import { Machine } from './types';

export const specialMachines: Machine[] = [
  {
    id: "base-station",
    name: "Base Station",
    description: "Set om 3st. handhållna för högpresterande kliniker",
    priceEur: 30900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3600
  },
  {
    id: "lunula",
    name: "Lunula",
    description: "Specialiserad behandlingsutrustning för medicinsk fotvård.",
    priceEur: 25900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 4000
  }
];
