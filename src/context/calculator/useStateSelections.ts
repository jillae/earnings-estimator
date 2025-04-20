import { useState, useEffect, useMemo } from 'react';
import { machineData } from '@/data/machines';
import { Machine } from '@/data/machines/types';
import { FlatrateOption, PaymentOption, SlaLevel } from '@/utils/constants';
import { DriftpaketType } from '@/types/calculator';
import { SliderStep } from '@/utils/sliderSteps';
import { InfoText } from '@/data/infoTexts';

export function useStateSelections() {
  const [clinicSize, setClinicSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('select-machine');
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('leasing');
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>('60');
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('yes');
  const [selectedSlaLevel, setSlaLevel] = useState<SlaLevel>('Brons');
  const [selectedDriftpaket, setSelectedDriftpaket] = useState<DriftpaketType>('Bas');
  
  // Ersätt kontinuerliga leaseAdjustmentFactor med diskreta steg
  const [currentSliderStep, setCurrentSliderStep] = useState<SliderStep>(1); // Standard är 1 (mitten)
  
  const [allowBelowFlatrate, setAllowBelowFlatrate] = useState<boolean>(true);
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(4);
  const [customerPrice, setCustomerPrice] = useState<number>(2500);
  const [useFlatrateOption, setUseFlatrateOption] = useState<FlatrateOption>('perCredit');
  
  // Nytt state för info-rutan
  const [currentInfoText, setCurrentInfoText] = useState<InfoText | null>(null);

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
      console.log(`Maskin valdes: ${selectedMachine.name}, återställer standardvärden`);
      
      // Sätt standard-leasingperiod från maskinen om den är definierad
      if (selectedMachine.defaultLeasingPeriod) {
        setSelectedLeasingPeriodId(selectedMachine.defaultLeasingPeriod);
      }
      
      // Sätt standard-kundpris från maskinen om det är definierat
      if (selectedMachine.defaultCustomerPrice) {
        setCustomerPrice(selectedMachine.defaultCustomerPrice);
      }
      
      // Återställ ALLTID till standard värden för en ny maskin
      setCurrentSliderStep(1); // Standard steg (mitten)
      
      // Återställ alltid SLA till Brons
      setSlaLevel('Brons');
      
      // Återställ alltid driftpaket till Bas
      setSelectedDriftpaket('Bas');
      
      // Återställ betalningsalternativ till leasing
      setPaymentOption('leasing');
      
      // Återställ flatrate-valet till perCredit
      setUseFlatrateOption('perCredit');
      
      // Återställ allowBelowFlatrate till true
      setAllowBelowFlatrate(true);
    }
  }, [selectedMachine]);

  // När klinikstorlek ändras, uppdatera behandlingar per dag
  useEffect(() => {
    if (clinicSize === 'small') {
      setTreatmentsPerDay(2);
    } else if (clinicSize === 'medium') {
      setTreatmentsPerDay(4);
    } else if (clinicSize === 'large') {
      setTreatmentsPerDay(6);
    }
  }, [clinicSize]);

  // När driftpaket ändras, uppdatera även SLA nivå
  useEffect(() => {
    if (selectedDriftpaket === 'Bas') {
      setSlaLevel('Brons');
    } else if (selectedDriftpaket === 'Silver') {
      setSlaLevel('Silver');
    } else if (selectedDriftpaket === 'Guld') {
      setSlaLevel('Guld');
    }
  }, [selectedDriftpaket]);

  return {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    selectedMachine,
    paymentOption,
    setPaymentOption,
    selectedLeasingPeriodId,
    setSelectedLeasingPeriodId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    selectedSlaLevel,
    setSlaLevel,
    selectedDriftpaket,
    setSelectedDriftpaket,
    currentSliderStep,
    setCurrentSliderStep,
    allowBelowFlatrate,
    setAllowBelowFlatrate,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    useFlatrateOption,
    setUseFlatrateOption,
    currentInfoText,
    setCurrentInfoText
  };
}
