
import { useState, useEffect, useMemo } from 'react';
import { Machine } from '@/data/machines/types';
import { FlatrateOption, PaymentOption, SlaLevel } from '@/utils/constants';
import { DriftpaketType } from '@/types/calculator';
import { SliderStep } from '@/utils/sliderSteps';
import { InfoText } from '@/data/infoTexts';
import { machineData } from '@/data/machines';

export function useStateSelections() {
  const [clinicSize, setClinicSize] = useState<'small' | 'medium' | 'large'>('medium');
  // Sätt Emerald som standard vid sidladdning
  const [selectedMachineId, setSelectedMachineId] = useState<string>('emerald');
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('leasing');
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>('60'); // Default till 60 månader
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('yes');
  const [selectedSlaLevel, setSlaLevel] = useState<SlaLevel>('Brons');
  const [selectedDriftpaket, setSelectedDriftpaket] = useState<DriftpaketType>('Bas');
  
  // Ersätt kontinuerliga leaseAdjustmentFactor med diskreta steg
  const [currentSliderStep, setCurrentSliderStep] = useState<SliderStep>(1); // Standard är 1 (mitten)
  
  const [allowBelowFlatrate, setAllowBelowFlatrate] = useState<boolean>(true);
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(4);
  const [customerPrice, setCustomerPrice] = useState<number>(2500);
  const [useFlatrateOption, setUseFlatrateOption] = useState<FlatrateOption>('perCredit');
  
  // Nytt state för leasingmodell-val
  const [selectedLeasingModel, setSelectedLeasingModel] = useState<'grundleasing' | 'strategisk'>('grundleasing');
  
  // Nytt state för info-rutan
  const [currentInfoText, setCurrentInfoText] = useState<InfoText | null>(null);

  // Återställ slider till standard när man byter till grundleasing
  useEffect(() => {
    if (selectedLeasingModel === 'grundleasing' && currentSliderStep !== 1) {
      console.log('Återställer slider till standard (1) vid byte till grundleasing');
      setCurrentSliderStep(1);
    }
  }, [selectedLeasingModel]);

  // Härled den valda maskinen från maskin-ID  
  const selectedMachine = useMemo(() => {
    const machine = machineData.find(machine => machine.id === selectedMachineId);
    return machine || machineData.find(m => m.id === 'emerald'); // Fallback till Emerald
  }, [selectedMachineId]);

  // När maskinvalet ändras, återställ vissa värden till standardvärden för den maskinen
  useEffect(() => {
    if (selectedMachine) {
      console.log(`Maskin valdes: ${selectedMachine.name}, återställer standardvärden`);
      
      // Sätt standard-leasingperiod från maskinen om den är definierad
      if (selectedMachine.defaultLeasingPeriod) {
        setSelectedLeasingPeriodId(String(selectedMachine.defaultLeasingPeriod));
      } else {
        setSelectedLeasingPeriodId('60');
      }
      
      // Sätt standard-kundpris från maskinen om det är definierat
      if (selectedMachine.defaultCustomerPrice) {
        setCustomerPrice(selectedMachine.defaultCustomerPrice);
      }
      
      // Återställ ALLTID till standard värden för en ny maskin
      setCurrentSliderStep(1); // Standard steg (mitten)
      setSlaLevel('Brons');
      setSelectedDriftpaket('Bas');
      setPaymentOption('leasing');
      setUseFlatrateOption('perCredit');
      setAllowBelowFlatrate(true);
      setSelectedLeasingModel('grundleasing');
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

  // Logga nuvarande tillstånd för att underlätta debugging
  useEffect(() => {
    console.log(`
      Current state:
      - Selected Machine: ${selectedMachine?.name || 'None'} (ID: ${selectedMachineId})
      - Leasing Period: ${selectedLeasingPeriodId} months
      - SLA Level: ${selectedSlaLevel}
      - Payment Option: ${paymentOption}
    `);
  }, [selectedMachine, selectedLeasingPeriodId, selectedSlaLevel, paymentOption]);

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
    selectedLeasingModel,
    setSelectedLeasingModel,
    currentInfoText,
    setCurrentInfoText
  };
}
