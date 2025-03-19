
/**
 * Shared constants used across the application
 */
export const VAT_RATE = 0.25;
export const WORKING_DAYS_PER_MONTH = 22;
export const MONTHS_PER_YEAR = 12;
export const FLATRATE_THRESHOLD = 3;

// Constants for shipping and tariffs
export const SHIPPING_COST_EUR = 677;

export interface TariffEntry {
  Löptid: number;
  Faktor: number;
}

export const LEASING_TARIFFS: TariffEntry[] = [
  { Löptid: 24, Faktor: 4.566 },
  { Löptid: 36, Faktor: 3.189 },
  { Löptid: 48, Faktor: 2.504 },
  { Löptid: 60, Faktor: 2.095 },
  { Löptid: 72, Faktor: 1.825 }
];

export const CONSTANT_MULTIPLIER = 11.49;
