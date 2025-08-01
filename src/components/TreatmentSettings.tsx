
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { useCalculator } from '@/context/CalculatorContext';
import RealTimeProfitGraph from './calculator/RealTimeProfitGraph';

interface TreatmentSettingsProps {
  treatmentsPerDay: number;
  customerPrice: number;
  onTreatmentsChange: (value: number) => void;
  onCustomerPriceChange: (value: number) => void;
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange?: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
}

const TreatmentSettings: React.FC<TreatmentSettingsProps> = ({
  treatmentsPerDay,
  customerPrice,
  onTreatmentsChange,
  onCustomerPriceChange,
  hoveredInput,
  onHoveredInputChange
}) => {
  const { logSignificantInteraction, workDaysPerMonth, setWorkDaysPerMonth } = useCalculator();
  const handleHover = (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => {
    onHoveredInputChange?.(input);
  };

  // Hantera behandlingsantal via slider
  const handleTreatmentsSliderChange = (values: number[]) => {
    logSignificantInteraction('treatments_changed');
    onTreatmentsChange(values[0]);
  };

  // Hantera kundpris via slider
  const handleCustomerPriceSliderChange = (values: number[]) => {
    logSignificantInteraction('customer_price_changed');
    onCustomerPriceChange(values[0]);
  };

  // Hantera nollpunkt via slider
  const handleWorkDaysSliderChange = (values: number[]) => {
    logSignificantInteraction('work_days_changed');
    setWorkDaysPerMonth(values[0]);
  };

  return (
    <section className="w-full space-y-4">
      {/* Rad 1: Behandlingar och Kundpris */}
      <div className="flex flex-row gap-4 md:gap-6">
        {/* Antal behandlingar */}
        <div 
          className="flex-1 flex flex-col justify-between bg-slate-50/50 border-slate-200 rounded-2xl border px-5 py-6 shadow-subtle min-h-[164px] hover:bg-slate-100/50 transition-colors cursor-pointer"
          onMouseEnter={() => handleHover('treatments')}
          onMouseLeave={() => handleHover(null)}
        >
        <label htmlFor="treatments-per-day" className="text-sm font-semibold text-slate-700 mb-3">
          Antal behandlingar per dag
        </label>
        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-800">{treatmentsPerDay} st</div>
          <Slider
            value={[treatmentsPerDay]}
            min={1}
            max={12}
            step={1}
            onValueChange={handleTreatmentsSliderChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1 st</span>
            <span>12 st</span>
          </div>
        </div>
        <p className="text-xs text-slate-600">Justera med sliden</p>
      </div>
      {/* Kundpris */}
      <div 
        className="flex-1 flex flex-col justify-between bg-slate-50/50 border-slate-200 rounded-2xl border px-5 py-6 shadow-subtle min-h-[164px] hover:bg-slate-100/50 transition-colors cursor-pointer"
        onMouseEnter={() => handleHover('price')}
        onMouseLeave={() => handleHover(null)}
      >
        <label htmlFor="customer-price" className="text-sm font-semibold text-slate-700 mb-3">
          Kundpris per behandling (kr, inkl moms)
        </label>
        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-800">{Math.round(customerPrice).toLocaleString()} kr</div>
          <Slider
            value={[customerPrice]}
            min={500}
            max={8000}
            step={100}
            onValueChange={handleCustomerPriceSliderChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>500 kr</span>
            <span>8 000 kr</span>
          </div>
        </div>
        <p className="text-xs text-slate-600">Justera med sliden</p>
        </div>
      </div>
      
      {/* Real-time profit graf */}
      <RealTimeProfitGraph />
    </section>
  );
};

export default TreatmentSettings;
