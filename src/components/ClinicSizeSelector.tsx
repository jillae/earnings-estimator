import React from 'react';
import { Slider } from "@/components/ui/slider";
import { SMALL_CLINIC_TREATMENTS, MEDIUM_CLINIC_TREATMENTS, LARGE_CLINIC_TREATMENTS } from '@/utils/constants';
import { formatCurrency } from '@/utils/calculatorUtils';

interface ClinicSizeSelectorProps {
  clinicSize: 'small' | 'medium' | 'large';
  netYearlyResult: number;
  onChange: (value: 'small' | 'medium' | 'large') => void;
}

const ClinicSizeSelector: React.FC<ClinicSizeSelectorProps> = ({ 
  clinicSize, 
  netYearlyResult,
  onChange 
}) => {
  const handleSliderChange = (values: number[]) => {
    // Konvertera numeriskt värde till string-enum
    if (values[0] === 1) onChange('small');
    else if (values[0] === 2) onChange('medium');
    else onChange('large');
  };
  
  // Konvertera string-enum till numeriskt värde för slidern
  const getSliderValue = (): number => {
    if (clinicSize === 'small') return 1;
    if (clinicSize === 'medium') return 2;
    return 3;
  };
  
  const getSizeLabel = () => {
    if (clinicSize === 'small') return "Liten klinik";
    if (clinicSize === 'medium') return "Mellanstor klinik";
    return "Stor klinik";
  };
  
  const getTreatmentsText = () => {
    if (clinicSize === 'small') return `${SMALL_CLINIC_TREATMENTS} behandlingar/dag`;
    if (clinicSize === 'medium') return `${MEDIUM_CLINIC_TREATMENTS} behandlingar/dag`;
    return `${LARGE_CLINIC_TREATMENTS} behandlingar/dag`;
  };

  return (
    <div className="relative">
      <div className="absolute -top-3 left-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
        STEG 2
      </div>
      <div className="glass-card animate-fade-in pt-2">
      <h3 className="text-lg font-semibold mb-4">Klinikstorlek</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-500">Liten</span>
          <span className="text-sm text-slate-500">Mellan</span>
          <span className="text-sm text-slate-500">Stor</span>
        </div>
        
        <Slider
          value={[getSliderValue()]}
          min={1}
          max={3}
          step={1}
          onValueChange={handleSliderChange}
          className="my-4"
        />
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-sm font-medium text-slate-700">{getSizeLabel()}</span>
          <div className="text-xs text-slate-500">{getTreatmentsText()}</div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-slate-500">Nettoresultat per år (ex moms)</div>
          <div className="text-lg font-semibold text-emerald-600">
            {formatCurrency(netYearlyResult)}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ClinicSizeSelector;
