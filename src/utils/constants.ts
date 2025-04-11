
// Viktiga konstanter för kalkylatorn
export const VAT_RATE = 0.25;
export const WORKING_DAYS_PER_MONTH = 22;
export const MONTHS_PER_YEAR = 12;

// Konstanter för klinikstorlekar
export const SMALL_CLINIC_TREATMENTS = 2;
export const MEDIUM_CLINIC_TREATMENTS = 4;
export const LARGE_CLINIC_TREATMENTS = 6;

// Typer för flatrate-alternativ
export type FlatrateOption = 'perCredit' | 'flatrate';

// Flatrate konstanter
export const FLATRATE_THRESHOLD = 4; // Antal behandlingar per dag där flatrate aktiveras
export const FLATRATE_THRESHOLD_PERCENTAGE = 0.8; // 80% av vägen från min till max

// Transport och leveranskostnader
export const SHIPPING_COST_EUR_CREDITS = 250; // EUR
export const SHIPPING_COST_EUR_NO_CREDITS = 350; // EUR

// Valutakurs och priser
export const DEFAULT_EXCHANGE_RATE = 11.49260; // SEK per EUR
export const DEFAULT_CUSTOMER_PRICE = 1800; // SEK

// Försäkringssatser
export const INSURANCE_RATES = {
  RATE_10K_OR_LESS: 0.04, // 4% för maskiner ≤ 10 000 SEK
  RATE_20K_OR_LESS: 0.03, // 3% för maskiner ≤ 20 000 SEK
  RATE_50K_OR_LESS: 0.025, // 2.5% för maskiner ≤ 50 000 SEK
  RATE_ABOVE_50K: 0.015  // 1.5% för maskiner > 50 000 SEK
};

// Leasing tariff-värden
export const LEASING_TARIFFS = [
  { Löptid: 24, Faktor: 4.566 },
  { Löptid: 36, Faktor: 3.189 },
  { Löptid: 48, Faktor: 2.504 },
  { Löptid: 60, Faktor: 2.095 }
];

// Flatrate-belopp för olika maskintyper (SEK)
export const FLATRATE_AMOUNTS = {
  EMERALD: 15000,
  ZERONA: 12000,
  FX_635: 10000,
  FX_405: 8000
};
