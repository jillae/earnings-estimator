
import React from 'react';
import { Slider } from "@/components/ui/slider";

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
  // Hantera behandlingsantal via slider
  const handleTreatmentsSliderChange = (values: number[]) => {
    onTreatmentsChange(values[0]);
  };

  // Hantera kundpris via slider
  const handleCustomerPriceSliderChange = (values: number[]) => {
    onCustomerPriceChange(values[0]);
  };

  return (
    <section className="w-full flex flex-row gap-4 md:gap-6">
      {/* Antal behandlingar */}
      <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-blue-100 px-5 py-6 shadow-subtle min-h-[164px]">
        <label htmlFor="treatments-per-day" className="text-sm font-semibold text-slate-600 mb-3">
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
        <p className="text-xs text-gray-400">Justera med sliden</p>
      </div>
      {/* Kundpris */}
      <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-blue-100 px-5 py-6 shadow-subtle min-h-[164px]">
        <label htmlFor="customer-price" className="text-sm font-semibold text-slate-600 mb-3">
          Kundpris per behandling (kr, inkl moms)
        </label>
        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-800">{customerPrice.toLocaleString()} kr</div>
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
        <p className="text-xs text-gray-400">Justera med sliden</p>
      </div>
    </section>
  );
};

export default TreatmentSettings;
