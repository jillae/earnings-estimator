
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { useCalculator } from '@/context/CalculatorContext';

interface TreatmentSettingsProps {
  treatmentsPerDay: number;
  customerPrice: number;
  onTreatmentsChange: (value: number) => void;
  onCustomerPriceChange: (value: number) => void;
}

const TreatmentSettings: React.FC<TreatmentSettingsProps> = ({
  treatmentsPerDay,
  customerPrice,
  onTreatmentsChange,
  onCustomerPriceChange
}) => {
  const { logSignificantInteraction } = useCalculator();

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

  return (
    <section className="w-full space-y-4">
      {/* Rad 1: Behandlingar och Kundpris */}
      <div className="flex flex-row gap-4 md:gap-6">
        {/* Antal behandlingar */}
        <div className="flex-1 flex flex-col justify-between bg-emerald-50/20 border-emerald-200 rounded-2xl border px-5 py-6 shadow-subtle min-h-[164px] hover:bg-emerald-50/30 transition-colors">
        <label htmlFor="treatments-per-day" className="text-sm font-semibold text-emerald-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-sm mr-2"></span>
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
        <p className="text-xs text-emerald-600">Justera med sliden</p>
      </div>
      {/* Kundpris */}
      <div className="flex-1 flex flex-col justify-between bg-emerald-50/20 border-emerald-200 rounded-2xl border px-5 py-6 shadow-subtle min-h-[164px] hover:bg-emerald-50/30 transition-colors">
        <label htmlFor="customer-price" className="text-sm font-semibold text-emerald-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-sm mr-2"></span>
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
        <p className="text-xs text-emerald-600">Justera med sliden</p>
        </div>
      </div>
      
      {/* Rad 2: Nollpunkt mini-slider */}
      <div className="w-full max-w-md">
        <div className="bg-blue-50/20 border-blue-200 rounded-2xl border px-5 py-4 shadow-subtle hover:bg-blue-50/30 transition-colors">
          <label className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-sm mr-2"></span>
            Nollpunkt (arbetsdagar/månad)
          </label>
          <div className="space-y-3">
            <div className="text-base font-semibold text-slate-800">22 dagar</div>
            <Slider
              value={[22]}
              min={1}
              max={22}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>1 dag</span>
              <span>22 dagar</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Test-funktion för utvärdering</p>
        </div>
      </div>
    </section>
  );
};

export default TreatmentSettings;
