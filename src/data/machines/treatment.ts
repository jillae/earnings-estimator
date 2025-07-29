
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
    leasingMin: 7872,
    leasingMax: 13893, // Uppdaterat leasingMax från 10500 till 13893
    creditMin: 75,      // Kreditpris vid gamla leasingMax (mitten)
    creditMax: 159,     // Kreditpris vid leasingMin
    leasingTariffs: {
      "24": 0.045136,
      "36": 0.031346,
      "48": 0.024475,
      "60": 0.020372
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 900,
    imageUrl: "https://drive.google.com/uc?export=view&id=1bF2B_2j8jN32G5eM8jB8rY9r3-nU2N27"
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
    leasingMin: 9317,
    leasingMax: 16673, // Uppdaterat leasingMax från 12425 till 16673
    creditMin: 95,      // Kreditpris vid gamla leasingMax (mitten)
    creditMax: 199,     // Kreditpris vid leasingMin
    leasingTariffs: {
      "24": 0.045136,
      "36": 0.031346,
      "48": 0.024475,
      "60": 0.020372
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200,
    imageUrl: "https://drive.google.com/uc?export=view&id=1c7uF93v95qP3i2Q1e4k1K-j2i-P5p5L6"
  }
];
