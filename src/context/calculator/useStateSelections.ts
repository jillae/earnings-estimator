
import { useState, useEffect } from 'react';
import { machineData } from '@/data/machines';

export function useStateSelections() {
  const [clinicSize, setClinicSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('select-machine');
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>('60');
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('yes');
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1); // Start at max (1) instead of min (0)
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(4);
  const [customerPrice, setCustomerPrice] = useState<number>(2500);

  // When machine selection changes, reset certain values to defaults for that machine
  useEffect(() => {
    const selectedMachine = machineData.find(machine => machine.id === selectedMachineId);
    
    if (selectedMachine) {
      // Set default leasing period from machine if defined
      if (selectedMachine.defaultLeasingPeriod) {
        setSelectedLeasingPeriodId(selectedMachine.defaultLeasingPeriod);
      }
      
      // Set default customer price from machine if defined
      if (selectedMachine.defaultCustomerPrice) {
        setCustomerPrice(selectedMachine.defaultCustomerPrice);
      }
      
      // Always set leaseAdjustmentFactor to 1 (max) when selecting a new machine
      setLeaseAdjustmentFactor(1);
    }
  }, [selectedMachineId]);

  return {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice
  };
}
