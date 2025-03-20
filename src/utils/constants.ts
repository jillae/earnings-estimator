
/**
 * Shared constants used across the application
 */

// === Grundläggande beräkningskonstanter ===
export const VAT_RATE = 0.25;
export const WORKING_DAYS_PER_MONTH = 22;
export const MONTHS_PER_YEAR = 12;
export const FLATRATE_THRESHOLD = 3;
export const FLATRATE_THRESHOLD_PERCENTAGE = 0.8;
export const DEFAULT_EXCHANGE_RATE = 11.49260;

// === Pris och frakt ===
export const SHIPPING_COST_EUR_CREDITS = 652;
export const SHIPPING_COST_EUR_NO_CREDITS = 230;
export const DEFAULT_CUSTOMER_PRICE = 2500;

// === Klinikstorlekar och behandlingar ===
export const SMALL_CLINIC_TREATMENTS = 2;
export const MEDIUM_CLINIC_TREATMENTS = 4;
export const LARGE_CLINIC_TREATMENTS = 6;

// === Försäkringspriser (årlig försäkringspremie som % av maskinvärdet) ===
export const INSURANCE_RATES = {
  RATE_10K_OR_LESS: 0.04,    // 4% för maskiner ≤ 10 000 SEK
  RATE_20K_OR_LESS: 0.03,    // 3% för maskiner ≤ 20 000 SEK
  RATE_50K_OR_LESS: 0.025,   // 2.5% för maskiner ≤ 50 000 SEK
  RATE_ABOVE_50K: 0.015      // 1.5% för maskiner > 50 000 SEK
};

// === Leasing tariff värden (%) ===
export interface TariffEntry {
  Löptid: number;   // Månader
  Faktor: number;   // Procent (redan multiplicerad med 100)
}

export const LEASING_TARIFFS: TariffEntry[] = [
  { Löptid: 24, Faktor: 4.566 },
  { Löptid: 36, Faktor: 3.189 },
  { Löptid: 48, Faktor: 2.504 },
  { Löptid: 60, Faktor: 2.095 }
];

// === Credit och Flatrate ===
// Multiplikatorer för att beräkna credit-priser baserat på maskinpris
export const CREDIT_PRICE_MULTIPLIERS = {
  PREMIUM: 0.00045,  // För premium-maskiner
  STANDARD: 0.00038  // För standard-maskiner
};

// Flatrate-belopp för olika maskintyper
export const FLATRATE_AMOUNTS = {
  EMERALD: 5996,
  ZERONA: 4356,
  FX_635: 3296,
  FX_405: 4176
};
