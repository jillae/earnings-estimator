
/**
 * Shared constants used across the application
 */
export const VAT_RATE = 0.25;
export const WORKING_DAYS_PER_MONTH = 22;
export const MONTHS_PER_YEAR = 12;
export const FLATRATE_THRESHOLD = 3;

// Constants for shipping and tariffs
export const SHIPPING_COST_EUR_CREDITS = 652;
export const SHIPPING_COST_EUR_NO_CREDITS = 230;

// Constants for clinic size treatments
export const SMALL_CLINIC_TREATMENTS = 2;
export const MEDIUM_CLINIC_TREATMENTS = 4;
export const LARGE_CLINIC_TREATMENTS = 6;

export const DEFAULT_CUSTOMER_PRICE = 1990;
export const DEFAULT_EXCHANGE_RATE = 11.49260;

// Tariff entries with original percentage values (not divided by 100)
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

// Removed CONSTANT_MULTIPLIER as it's no longer needed with the direct SEK * tariff% formula
