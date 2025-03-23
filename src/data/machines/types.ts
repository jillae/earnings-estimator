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
  imageUrl?: string;
  fullName?: string;
  shortName?: string;
  modelCode?: string;
  creditsPerTreatment?: number;
}

export interface LeasingPeriod {
  id: string;
  name: string;
  rate: number;
}

export interface InsuranceOption {
  id: string;
  name: string;
  rate: number;
}

export interface InsuranceRates {
  [threshold: number]: number;
}
