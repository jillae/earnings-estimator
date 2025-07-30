import React from 'react';
import { Slider } from "@/components/ui/slider";
import { SMALL_CLINIC_TREATMENTS, MEDIUM_CLINIC_TREATMENTS, LARGE_CLINIC_TREATMENTS } from '@/utils/constants';
import { formatCurrency } from '@/utils/calculatorUtils';

interface ClinicSizeSelectorProps {
  clinicSize: 'small' | 'medium' | 'large';
  netYearlyResult: number;
  onChange: (value: 'small' | 'medium' | 'large') => void;
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange?: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
}

const ClinicSizeSelector: React.FC<ClinicSizeSelectorProps> = ({ 
  clinicSize, 
  netYearlyResult,
  onChange,
  hoveredInput,
  onHoveredInputChange
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
    <div 
      className="glass-card animate-slide-in bg-blue-50/20 border-blue-200 hover:bg-blue-50/30 hover:shadow-lg transition-all duration-200 cursor-pointer" 
      style={{ animationDelay: '100ms' }}
      onMouseEnter={() => onHoveredInputChange?.('clinic')}
      onMouseLeave={() => onHoveredInputChange?.(null)}
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <span className="w-2 h-2 bg-blue-400 rounded-sm mr-2"></span>
        Klinikstorlek
      </h3>
      
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
  );
};

export default ClinicSizeSelector;
