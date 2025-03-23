
import { useState, useEffect, useMemo } from 'react';
import { machineData } from '@/data/machines';
import { Machine } from '@/data/machines/types';
import { FlatrateOption } from '@/utils/constants';

export function useStateSelections() {
  const [clinicSize, setClinicSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('select-machine');
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>('60');
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('yes');
  const [leaseAdjustmentFactor, setLeaseAdjustmentFactor] = useState<number>(1); // Börja med max (1) istället för min (0)
  const [allowBelowFlatrate, setAllowBelowFlatrate] = useState<boolean>(false); // Ändrad till false för att blockera flatrate under 80%
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(4);
  const [customerPrice, setCustomerPrice] = useState<number>(2500);
  const [useFlatrateOption, setUseFlatrateOption] = useState<FlatrateOption>('perCredit'); // Använd FlatrateOption typ från constants

  // Härled den valda maskinen från maskin-ID
  const selectedMachine = useMemo(() => {
    const machine = machineData.find(machine => machine.id === selectedMachineId);
    return machine || { 
      id: 'null-machine',
      name: 'No Machine',
      usesCredits: false,
      flatrateAmount: 0,
      defaultCustomerPrice: 0,
      defaultLeasingPeriod: '60',
      minLeaseMultiplier: 0,
      maxLeaseMultiplier: 0,
      defaultLeaseMultiplier: 0,
      creditPriceMultiplier: 0,
      description: '',
      priceEur: 0
    } as Machine;
  }, [selectedMachineId]);

  // När maskinvalet ändras, återställ vissa värden till standardvärden för den maskinen
  useEffect(() => {
    if (selectedMachine && selectedMachine.id !== 'null-machine') {
      // Sätt standard-leasingperiod från maskinen om den är definierad
      if (selectedMachine.defaultLeasingPeriod) {
        setSelectedLeasingPeriodId(selectedMachine.defaultLeasingPeriod);
      }
      
      // Sätt standard-kundpris från maskinen om det är definierat
      if (selectedMachine.defaultCustomerPrice) {
        setCustomerPrice(selectedMachine.defaultCustomerPrice);
      }
      
      // Sätt alltid leaseAdjustmentFactor till 1 (max) när en ny maskin väljs
      setLeaseAdjustmentFactor(1);
      
      // Återställ allowBelowFlatrate till false när en ny maskin väljs (blockera flatrate under 80%)
      setAllowBelowFlatrate(false);
      
      // Återställ flatrate-valet till perCredit
      setUseFlatrateOption('perCredit');
    }
  }, [selectedMachine]);

  // En anpassad setUseFlatrateOption som kontrollerar 80%-tröskeln
  const setUseFlatrateOptionSecure = (option: FlatrateOption) => {
    // Om användaren försöker aktivera flatrate, se till att vi är över 80% och har minst 3 behandlingar per dag
    if (option === 'flatrate' && (allowBelowFlatrate || treatmentsPerDay < 3)) {
      console.log('Försöker aktivera flatrate men inte tillåtet - ignorerar begäran');
      return; // Ignorera begäran om att aktivera flatrate när det inte är tillåtet
    }
    
    // Annars, tillåt ändringen
    setUseFlatrateOption(option);
  };

  return {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    leaseAdjustmentFactor,
    setLeaseAdjustmentFactor,
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    useFlatrateOption,
    setUseFlatrateOption: setUseFlatrateOptionSecure
  };
}
