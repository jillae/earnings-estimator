// src/data/machines/types.ts (eller motsvarande)
export interface Machine {
  id: string;
  name: string;
  description?: string; // Behåll om du använder
  price?: string | number; // Behåll om du använder för tariffberäkning
  usesCredits: boolean;
  leasingMin?: number; // Minsta leasingkostnad
  leasingOriginal?: number; // Viktigt: Det ursprungliga maxvärdet för leasing
  creditMin?: number; // Minsta kreditpris (vid leasingOriginal)
  creditMax?: number; // Högsta kreditpris (vid leasingMin)
  flatrateAmount?: number; // Fast flatrate-kostnad
  // Eventuellt defaultCustomerPrice, defaultLeasingPeriod etc.
  defaultCustomerPrice?: number;
  defaultLeasingPeriod?: string; // t.ex. "60"
  creditPriceMultiplier?: number; // Om denna fortfarande används någonstans (bör fasas ut)
}
