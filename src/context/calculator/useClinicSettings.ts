
import { useState, useEffect } from 'react';
import { 
  SMALL_CLINIC_TREATMENTS, 
  MEDIUM_CLINIC_TREATMENTS, 
  LARGE_CLINIC_TREATMENTS 
} from '@/data/machines';

// Maximum allowed treatments per day
const MAX_TREATMENTS_PER_DAY = 12;

export function useClinicSettings() {
  const [clinicSize, setClinicSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(MEDIUM_CLINIC_TREATMENTS);

  // Update treatments per day when clinic size changes
  useEffect(() => {
    switch (clinicSize) {
      case 'small':
        setTreatmentsPerDay(SMALL_CLINIC_TREATMENTS);
        break;
      case 'medium':
        setTreatmentsPerDay(MEDIUM_CLINIC_TREATMENTS);
        break;
      case 'large':
        setTreatmentsPerDay(LARGE_CLINIC_TREATMENTS);
        break;
    }
  }, [clinicSize]);

  // Create a wrapped setter function that enforces the minimum and maximum limits
  const setTreatmentsPerDayWithLimit = (value: number) => {
    // Ensure value is within limits (1 to MAX_TREATMENTS_PER_DAY)
    const limitedValue = Math.max(1, Math.min(MAX_TREATMENTS_PER_DAY, value));
    setTreatmentsPerDay(limitedValue);
  };

  return {
    clinicSize,
    setClinicSize,
    treatmentsPerDay,
    setTreatmentsPerDay: setTreatmentsPerDayWithLimit,
    maxTreatmentsPerDay: MAX_TREATMENTS_PER_DAY
  };
}
