
import { useState, useEffect } from 'react';
import { 
  SMALL_CLINIC_TREATMENTS, 
  MEDIUM_CLINIC_TREATMENTS, 
  LARGE_CLINIC_TREATMENTS 
} from '@/data/machines';

export function useClinicSettings() {
  const [clinicSize, setClinicSize] = useState<number>(2);
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(MEDIUM_CLINIC_TREATMENTS);

  // Update treatments per day when clinic size changes
  useEffect(() => {
    switch (clinicSize) {
      case 1:
        setTreatmentsPerDay(SMALL_CLINIC_TREATMENTS);
        break;
      case 2:
        setTreatmentsPerDay(MEDIUM_CLINIC_TREATMENTS);
        break;
      case 3:
        setTreatmentsPerDay(LARGE_CLINIC_TREATMENTS);
        break;
    }
  }, [clinicSize]);

  return {
    clinicSize,
    setClinicSize,
    treatmentsPerDay,
    setTreatmentsPerDay
  };
}
