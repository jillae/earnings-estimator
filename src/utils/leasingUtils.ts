
/**
 * Leasing utilities - Re-exports from specialized utility files
 * Detta är en omfaktorerad version av den ursprungliga leasingUtils.ts
 * funktionaliteten är uppdelad i mer specifika filer.
 */

// Re-export everything from our specialized utility files
export { getLeasingFactor, calculateTariffBasedLeasingMax } from './leasingTariffUtils';
export { calculateLeasingRange } from './leasingRangeUtils';
export { calculateLeasingCost } from './leasingCostUtils';
export type { LeasingRange } from './leasingRangeUtils';
