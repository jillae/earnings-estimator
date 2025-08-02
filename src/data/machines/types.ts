
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
  creditMin?: number;     // Bakåtkompatibilitet
  creditMax?: number;     // Position 0 - Högsta creditpris
  creditMid1?: number;    // Position 1 - Mellan
  creditMid2?: number;    // Position 2 - Standard (mitten)
  creditMid3?: number;    // Position 3 - Mellan
  // Position 4 är alltid 0
  leasingMin?: number;
  leasingStandard?: number;  // Standard nivå - nya strategiska modellen
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
