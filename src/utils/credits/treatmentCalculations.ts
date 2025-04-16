
import { WORKING_DAYS_PER_MONTH } from '../constants';

export function calculateTreatmentsPerMonth(treatmentsPerDay: number): number {
  if (isNaN(treatmentsPerDay) || treatmentsPerDay === null || treatmentsPerDay === undefined) {
    return 0;
  }
  return treatmentsPerDay * WORKING_DAYS_PER_MONTH;
}
