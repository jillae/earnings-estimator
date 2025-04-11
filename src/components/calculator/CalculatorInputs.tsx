
import React from 'react';
import ClinicSizeSelector from '../ClinicSizeSelector';
import TreatmentSettings from '../TreatmentSettings';
import MachineSelector from '../MachineSelector';
import OperatingCosts from '../OperatingCosts';
import { useCalculator } from '@/context/CalculatorContext';
import { machineData } from '@/data/machines';

const CalculatorInputs: React.FC = () => {
  const {
    clinicSize,
    setClinicSize,
    selectedMachineId,
    setSelectedMachineId,
    treatmentsPerDay,
    setTreatmentsPerDay,
    customerPrice,
    setCustomerPrice,
    netResults
  } = useCalculator();
  
  return (
    <div className="w-full">
      <ClinicSizeSelector 
        clinicSize={clinicSize} 
        netYearlyResult={netResults?.netPerYearExVat || 0}
        onChange={setClinicSize} 
      />
      
      <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '200ms' }}>
        <TreatmentSettings 
          treatmentsPerDay={treatmentsPerDay}
          customerPrice={customerPrice}
          onTreatmentsChange={setTreatmentsPerDay}
          onCustomerPriceChange={setCustomerPrice}
        />
      </div>

      <MachineSelector 
        machines={machineData}
        selectedMachineId={selectedMachineId}
        onChange={setSelectedMachineId}
      />

      <OperatingCosts />
    </div>
  );
};

export default CalculatorInputs;
