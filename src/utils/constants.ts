
import { LeasingPeriod } from '../data/machines/types';

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

// Typer för betalningsalternativ
export type PaymentOption = 'leasing' | 'cash';

// Typer för SLA-nivåer
export type SlaLevel = 'Brons' | 'Silver' | 'Guld';

// SLA procentsatser (i förhållande till leasingStandardRef)
export const SLA_PERCENT_SILVER = 0.25;  // 25% av leasingStandardRef
export const SLA_PERCENT_GULD = 0.50;     // 50% av leasingStandardRef

// Flatrate konstanter
export const FLATRATE_THRESHOLD = 4; // Antal behandlingar per dag där flatrate aktiveras
export const FLATRATE_THRESHOLD_PERCENTAGE = 0.8; // 80% av vägen från min till max

// Transport och leveranskostnader
export const SHIPPING_COST_EUR_CREDITS = 652; // EUR
export const SHIPPING_COST_EUR_NO_CREDITS = 230; // EUR

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

// Leasing tariff-värden 2024 (Värdena är i decimalform, inte procent)
export const LEASING_TARIFFS_2024: LeasingPeriod[] = [
  { id: "24", name: "24 månader", rate: 0.045136, Löptid: 24, Faktor: 0.045136 },
  { id: "36", name: "36 månader", rate: 0.031346, Löptid: 36, Faktor: 0.031346 },
  { id: "48", name: "48 månader", rate: 0.024475, Löptid: 48, Faktor: 0.024475 },
  { id: "60", name: "60 månader", rate: 0.020372, Löptid: 60, Faktor: 0.020372 }
];

// Leasing tariff-värden 2025 (Värdena är i decimalform, inte procent)
export const LEASING_TARIFFS_2025: LeasingPeriod[] = [
  { id: "24", name: "24 månader", rate: 0.046386, Löptid: 24, Faktor: 0.046386 },
  { id: "36", name: "36 månader", rate: 0.032515, Löptid: 36, Faktor: 0.032515 },
  { id: "48", name: "48 månader", rate: 0.025413, Löptid: 48, Faktor: 0.025413 },
  { id: "60", name: "60 månader", rate: 0.021158, Löptid: 60, Faktor: 0.021158 }
];

// Aktuellt tariffvärde - använder 2025-värden som standard nu
export const LEASING_TARIFFS = LEASING_TARIFFS_2025;

// Flatrate-belopp för olika maskintyper (SEK)
export const FLATRATE_AMOUNTS = {
  EMERALD: 15000,
  ZERONA: 12000,
  FX_635: 10000,
  FX_405: 8000
};
