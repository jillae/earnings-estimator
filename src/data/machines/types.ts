
export interface Machine {
  id: string;
  name: string;
  description?: string;
  price?: string | number;
  priceEur?: number;
  fullName?: string;
  shortName?: string;
  modelCode?: string;
  usesCredits: boolean;
  creditMin?: number;
  creditMax?: number;
  leasingMin?: number;
  leasingStandard?: number;  // Ny egenskap för strategisk prissättning
  leasingMax?: number;
  flatrateAmount?: number;
  defaultCustomerPrice?: number;
  defaultLeasingPeriod?: string;
  imageUrl?: string;
  minLeaseMultiplier?: number;
  maxLeaseMultiplier?: number;
  defaultLeaseMultiplier?: number;
  creditPriceMultiplier?: number;
  creditsPerTreatment?: number;
  leasingTariffs?: {[key: string]: number};
}

export interface LeasingPeriod {
  id: string;
  name: string;
  rate: number;
  Löptid?: number; // Backward compatibility för övergång
  Faktor?: number; // Backward compatibility för övergång
}

export interface InsuranceOption {
  id: string;
  name: string;
  rate: number;
}

export interface InsuranceRates {
  [key: number]: number;
}
