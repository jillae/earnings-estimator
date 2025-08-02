import { useState, useEffect, useMemo } from 'react';
import { PaymentOption, SlaLevel, FlatrateOption } from '@/utils/constants';
import { leasingPeriods, insuranceOptions } from '@/data/machines';
import { SliderStep } from '@/utils/sliderSteps';
import { InfoText } from '@/data/infoTexts';
import { useMachineData } from '@/hooks/useMachineData';

export function useStateSelections() {
  const [clinicSize, setClinicSize] = useState<'small' | 'medium' | 'large'>('medium');
  // DEBUGGING: Explicit tom start för selectedMachineId
  const [selectedMachineId, setSelectedMachineId] = useState<string>(() => {
    console.log('useStateSelections: Initialiserar selectedMachineId till tom sträng');
    return '';
  });
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('leasing');
  const [selectedLeasingPeriodId, setSelectedLeasingPeriodId] = useState<string>('60'); // Default till 60 månader
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('yes');
  const [selectedSlaLevel, setSlaLevel] = useState<SlaLevel>('Brons');
  const [selectedDriftpaket, setSelectedDriftpaket] = useState<'Bas' | 'Silver' | 'Guld'>('Bas');
  
  // Ersätt kontinuerliga leaseAdjustmentFactor med diskreta steg
  const [currentSliderStep, setCurrentSliderStep] = useState<SliderStep>(1); // Standard är 1 (mitten)
  
  const [allowBelowFlatrate, setAllowBelowFlatrate] = useState<boolean>(true);
  const [treatmentsPerDay, setTreatmentsPerDay] = useState<number>(4);
  const [customerPrice, setCustomerPrice] = useState<number>(2500);
  const [useFlatrateOption, setUseFlatrateOption] = useState<FlatrateOption>('perCredit'); // Default till perCredit istället för flatrate
  
  // Nytt state för leasingmodell-val
  const [selectedLeasingModel, setSelectedLeasingModel] = useState<'hybridmodell' | 'strategimodell'>('hybridmodell');
  
  // Nollpunkt state
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState<number>(22);
  
  // Nytt state för info-rutan
  const [currentInfoText, setCurrentInfoText] = useState<InfoText | null>(null);

  // Hämta maskindata från databas
  const { calculatorMachines, isLoading } = useMachineData();

  // Återställ slider till standard när man byter till hybridmodell
  useEffect(() => {
    if (selectedLeasingModel === 'hybridmodell' && currentSliderStep !== 1) {
      console.log('Återställer slider till standard (1) vid byte till hybridmodell');
      setCurrentSliderStep(1);
    }
  }, [selectedLeasingModel]);

  // Sätt första maskinen som default när data laddas
  useEffect(() => {
    if (!isLoading && calculatorMachines.length > 0 && !selectedMachineId) {
      const firstMachine = calculatorMachines[0];
      console.log(`Sätter första maskinen som standard: ${firstMachine.name} (${firstMachine.id})`);
      setSelectedMachineId(firstMachine.id);
    }
  }, [calculatorMachines, isLoading, selectedMachineId]);

  // Härled den valda maskinen från maskin-ID  
  const selectedMachine = useMemo(() => {
    if (!selectedMachineId || calculatorMachines.length === 0) return null; // Ingen maskin vald eller data inte laddad
    const machine = calculatorMachines.find(machine => machine.id === selectedMachineId);
    return machine || null; // Ingen fallback
  }, [selectedMachineId, calculatorMachines]);

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
      setUseFlatrateOption('perCredit'); // Återställ till perCredit som standard
      setAllowBelowFlatrate(true);
      setSelectedLeasingModel('hybridmodell');
      setWorkDaysPerMonth(22); // Återställ nollpunkt till standard
      setTreatmentsPerDay(4); // Återställ behandlingar till standard
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

  // Vid första behandling-interaktion, sätt klinikstorlek enligt behandlingar
  useEffect(() => {
    if (treatmentsPerDay === 2) {
      setClinicSize('small');
    } else if (treatmentsPerDay === 4) {
      setClinicSize('medium');
    } else if (treatmentsPerDay >= 6) {
      setClinicSize('large');
    }
  }, [treatmentsPerDay]);

  // Auto-switch to strategimodell vid mycket höga slider-värden
  useEffect(() => {
    if (currentSliderStep >= 5 && selectedLeasingModel !== 'strategimodell') {
      console.log('Växlar automatiskt till strategimodell på höga slider-värden');
      setSelectedLeasingModel('strategimodell');
    }
  }, [currentSliderStep, selectedLeasingModel]);

  // Ta bort automatisk switch tillbaka - låt användaren välja manuellt
  // Auto-switch tillbaka till hybridmodell endast vid extremt låga slider-värden
  useEffect(() => {
    if (currentSliderStep === 0 && selectedLeasingModel === 'strategimodell') {
      // Endast växla tillbaka på position 0 (minimum)
      console.log('Går tillbaka till hybridmodell endast vid minsta slider-värdet');
      setSelectedLeasingModel('hybridmodell');
    }
  }, [currentSliderStep, selectedLeasingModel]);

  // Log för att spåra state-förändringar
  useEffect(() => {
    console.log('useStateSelections: selectedMachineId ändrat till:', selectedMachineId);
  }, [selectedMachineId]);

  return {
    // States
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
    workDaysPerMonth,
    setWorkDaysPerMonth,
    currentInfoText,
    setCurrentInfoText,
    
    // For legacy compatibility
    leasingPeriods,
    insuranceOptions
  };
}