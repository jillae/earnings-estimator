
import { useState } from 'react';
import { machineData } from '@/data/machines';

export function useStateSelections() {
  // Machine and options selection state - set "select-machine" as default
  const [selectedMachineId, setSelectedMachineId] = useState<string>("select-machine");
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>("60"); // Always 60 months
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>("yes"); // Always insurance yes
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1);
  const [customerPrice, setCustomerPrice] = useState<number>(machineData[0].defaultCustomerPrice || 2500);
  
  // Get the currently selected machine
  const selectedMachine = selectedMachineId === "select-machine" 
    ? machineData[0] // Fallback to first machine for calculations if "select-machine" is selected
    : machineData.find(machine => machine.id === selectedMachineId) || machineData[0];

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
