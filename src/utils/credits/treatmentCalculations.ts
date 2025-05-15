
import { WORKING_DAYS_PER_MONTH } from '../constants';

/**
 * Beräknar antal behandlingar per månad baserat på antal behandlingar per dag
 * @param treatmentsPerDay Antal behandlingar per dag
 * @returns Antal behandlingar per månad
 */
export function calculateTreatmentsPerMonth(treatmentsPerDay: number): number {
  if (treatmentsPerDay === 0 || isNaN(treatmentsPerDay)) return 0;
  
  const result = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  
  // Lägg till extra loggning för felsökning
  console.log(`Treatments calculation:
    treatmentsPerDay: ${treatmentsPerDay}
    WORKING_DAYS_PER_MONTH: ${WORKING_DAYS_PER_MONTH}
    Total treatments per month: ${result}
  `);
  
  return result;
}

/**
 * Beräknar totala antalet krediter per månad
 * @param treatmentsPerDay Antal behandlingar per dag
 * @param creditsPerTreatment Antal krediter per behandling
 * @returns Totala antalet krediter per månad
 */
export function calculateCreditsPerMonth(
  treatmentsPerDay: number, 
  creditsPerTreatment: number
): number {
  const treatmentsPerMonth = calculateTreatmentsPerMonth(treatmentsPerDay);
  return treatmentsPerMonth * creditsPerTreatment;
}
