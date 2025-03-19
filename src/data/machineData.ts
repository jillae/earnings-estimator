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
}

export const machineData: Machine[] = [
  {
    id: "emerald-s",
    name: "Emerald S",
    description: "Baspaketet för mindre kliniker",
    priceEur: 24500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00035,
    flatrateAmount: 3250,
    usesCredits: true,
    leasingMin: 5000,
    leasingMax: 7500
  },
  {
    id: "emerald-m",
    name: "Emerald M",
    description: "Mellanstorlekspaketet för växande kliniker",
    priceEur: 34500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00035,
    flatrateAmount: 4295,
    usesCredits: true,
    leasingMin: 7000,
    leasingMax: 10000
  },
  {
    id: "emerald-l",
    name: "Emerald L",
    description: "Den kompletta lösningen för större kliniker",
    priceEur: 49500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00035,
    flatrateAmount: 5750,
    usesCredits: true,
    leasingMin: 9500,
    leasingMax: 13500
  },
  {
    id: "emerald-pro",
    name: "Emerald Pro",
    description: "Professionell serie för avancerade behandlingar",
    priceEur: 64500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.0004,
    flatrateAmount: 7500,
    usesCredits: true,
    leasingMin: 12000,
    leasingMax: 17000
  },
  {
    id: "ruby-s",
    name: "Ruby S",
    description: "Kraftfull maskin för mindre kliniker",
    priceEur: 29500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 3950,
    usesCredits: true,
    leasingMin: 6000,
    leasingMax: 8500
  },
  {
    id: "ruby-m",
    name: "Ruby M",
    description: "Mångsidig maskin för växande verksamheter",
    priceEur: 39500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 4950,
    usesCredits: true,
    leasingMin: 8000,
    leasingMax: 11500
  },
  {
    id: "ruby-l",
    name: "Ruby L",
    description: "Premium-lösning för större kliniker",
    priceEur: 54500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00038,
    flatrateAmount: 6250,
    usesCredits: true,
    leasingMin: 10500,
    leasingMax: 14500
  },
  {
    id: "sapphire-serie",
    name: "Sapphire Serie",
    description: "Medicinsk serie för sjukhus och specialistkliniker",
    priceEur: 79500,
    minLeaseMultiplier: 0.018,
    maxLeaseMultiplier: 0.032,
    defaultLeaseMultiplier: 0.025,
    creditPriceMultiplier: 0.00045,
    flatrateAmount: 8500,
    usesCredits: true,
    leasingMin: 14000,
    leasingMax: 19500
  }
];

export const leasingPeriods = [
  { id: "36", name: "36 månader", rate: 0.028 },
  { id: "48", name: "48 månader", rate: 0.025 },
  { id: "60", name: "60 månader", rate: 0.021 }
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
