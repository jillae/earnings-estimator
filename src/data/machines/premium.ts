
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
    leasingMin: 21703,
    leasingMax: 24114,
    creditMin: 149,
    creditMax: 299,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3500,
    imageUrl: "https://erchonia.com/wp-content/uploads/2020/03/Erchonia-Emerald_Web.jpg"
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
    leasingMin: 10087,
    leasingMax: 11208,
    creditMin: 99,
    creditMax: 199,
    leasingTariffs: {
      "24": 0.04566,
      "36": 0.03189,
      "48": 0.02504,
      "60": 0.02095
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1800,
    imageUrl: "https://erchonia.com/wp-content/uploads/2020/02/erchonia-zerona-z6-laser.png"
  }
];
