
export interface Machine {
  id: string;
  name: string;
  description: string;
  priceEur: number;
  priceSek?: number;
  minLeaseMultiplier: number;
  maxLeaseMultiplier: number;
  defaultLeaseMultiplier: number;
  creditPriceMultiplier: number;
  flatrateAmount: number;
  usesCredits: boolean;
  leasingMin?: number;
  leasingMax?: number;
  creditMin?: number;
  creditMax?: number;
  leasingTariffs?: {[key: string]: number};
  defaultLeasingPeriod?: string;
  defaultCustomerPrice?: number;
}

export const machineData: Machine[] = [
  {
    id: "emerald",
    name: "Emerald",
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
      "24": 4.566,
      "36": 3.189,
      "48": 2.504,
      "60": 2.095,
      "72": 1.825
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 3500
  },
  {
    id: "fx-635",
    name: "FX 635",
    description: "Effektiv behandlingslösning för kliniker",
    priceEur: 37500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 3296,
    usesCredits: true,
    leasingMin: 8267,
    leasingMax: 9186,
    creditMin: 75,
    creditMax: 159,
    leasingTariffs: {
      "24": 4.566,
      "36": 3.189,
      "48": 2.504,
      "60": 2.095,
      "72": 1.825
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 900
  },
  {
    id: "fx-405",
    name: "FX 405",
    description: "Avancerad behandlingslösning för kliniker",
    priceEur: 44500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 4176,
    usesCredits: true,
    leasingMin: 9784,
    leasingMax: 10871,
    creditMin: 95,
    creditMax: 199,
    leasingTariffs: {
      "24": 4.566,
      "36": 3.189,
      "48": 2.504,
      "60": 2.095,
      "72": 1.825
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200
  },
  {
    id: "zerona",
    name: "Zerona",
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
      "24": 4.566,
      "36": 3.189,
      "48": 2.504,
      "60": 2.095,
      "72": 1.825
    },
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1800
  },
  {
    id: "xlr8",
    name: "XLR8",
    description: "Instegsmodell av handhållen behandlingsutrustning",
    priceEur: 9900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 500
  },
  {
    id: "evrl",
    name: "EVRL",
    description: "Specialanpassad utrustning för särskilda behandlingar",
    priceEur: 17900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 800
  },
  {
    id: "gvl",
    name: "GVL",
    description: "Senaste modellen av handhållen behandlingsutrustning",
    priceEur: 19900,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0,
    flatrateAmount: 0,
    usesCredits: false,
    defaultLeasingPeriod: "60",
    defaultCustomerPrice: 1200
  },
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

export const leasingPeriods = [
  { id: "24", name: "24 månader", rate: 0.032 },
  { id: "36", name: "36 månader", rate: 0.028 },
  { id: "48", name: "48 månader", rate: 0.025 },
  { id: "60", name: "60 månader", rate: 0.021 },
  { id: "72", name: "72 månader", rate: 0.018 }
];

export const insuranceOptions = [
  { id: "no", name: "Nej", rate: 0 },
  { id: "yes", name: "Ja", rate: 0.025 }
];

export const insuranceRates = {
  10000: 0.04,
  20000: 0.03,
  50000: 0.025,
  Infinity: 0.015
};

export const VAT_RATE = 0.25;
export const WORKING_DAYS_PER_MONTH = 22;
export const MONTHS_PER_YEAR = 12;
export const FLATRATE_THRESHOLD = 3;
export const SHIPPING_COST_EUR = 652;

export const DEFAULT_EXCHANGE_RATE = 11.49260;

export const SMALL_CLINIC_TREATMENTS = 2;
export const MEDIUM_CLINIC_TREATMENTS = 4;
export const LARGE_CLINIC_TREATMENTS = 6;

export const DEFAULT_CUSTOMER_PRICE = 1990;
