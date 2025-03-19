
import { useState } from 'react';
import { machineData } from '@/data/machines';

export function useStateSelections() {
  // Machine and options selection state
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machineData[1].id); // Second machine instead of Emerald
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>("60"); // Always 60 months
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>("yes"); // Always insurance yes
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1);
  const [customerPrice, setCustomerPrice] = useState<number>(machineData[1].defaultCustomerPrice || 2500);
  
  // Get the currently selected machine
  const selectedMachine = machineData.find(machine => machine.id === selectedMachineId) || machineData[1];

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
