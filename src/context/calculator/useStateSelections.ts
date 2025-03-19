
import { useState } from 'react';
import { machineData } from '@/data/machines';

export function useStateSelections() {
  // Machine and options selection state
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machineData[0].id);
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>("48");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>("yes");
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1);
  const [customerPrice, setCustomerPrice] = useState<number>(machineData[0].defaultCustomerPrice || 1990);
  
  // Get the currently selected machine
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId) || machineData[0];

  return {
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    customerPrice,
    setCustomerPrice
  };
}
