
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
  // Hantera behandlingsantal
  const handleTreatmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 12) {
      onTreatmentsChange(value);
    }
  };

  const incrementTreatments = () => {
    if (treatmentsPerDay < 12) onTreatmentsChange(treatmentsPerDay + 1);
  };
  const decrementTreatments = () => {
    if (treatmentsPerDay > 1) onTreatmentsChange(treatmentsPerDay - 1);
  };

  // Hantera kundpris
  const handleCustomerPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      const roundedValue = Math.round(value / 100) * 100;
      onCustomerPriceChange(roundedValue);
    }
  };
  const incrementPrice = () => onCustomerPriceChange(customerPrice + 100);
  const decrementPrice = () => {
    if (customerPrice >= 100) onCustomerPriceChange(customerPrice - 100);
  };
  const handleCustomerPriceBlur = () => {
    const roundedValue = Math.round(customerPrice / 100) * 100;
    onCustomerPriceChange(roundedValue);
  };

  return (
    <section className="w-full flex flex-row gap-4 md:gap-6">
      {/* Antal behandlingar */}
      <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-blue-100 px-5 py-6 shadow-subtle min-h-[164px]">
        <label htmlFor="treatments-per-day" className="text-sm font-semibold text-slate-600 mb-3">
          Antal behandlingar per dag
        </label>
        <div className="relative flex items-center gap-2">
          <input
            id="treatments-per-day"
            type="number"
            min="1"
            max="12"
            step="1"
            value={treatmentsPerDay}
            onChange={handleTreatmentsChange}
            className="w-full text-base font-medium rounded-md border border-blue-100 focus:border-blue-400 bg-slate-50 py-2 px-3 pr-16 transition-all focus:ring-2 focus:ring-blue-200 outline-none h-12"
            aria-label="Behandlingar per dag"
          />
          <span className="ml-2 text-xs text-gray-500">st</span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <button
              onClick={incrementTreatments}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer"
              aria-label="Öka antal behandlingar"
              type="button"
            >
              <ChevronUp className="h-4 w-4 text-blue-700" />
            </button>
            <button
              onClick={decrementTreatments}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer"
              aria-label="Minska antal behandlingar"
              type="button"
            >
              <ChevronDown className="h-4 w-4 text-blue-700" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">Justeras med pilar eller tangentbord</p>
      </div>
      {/* Kundpris */}
      <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-blue-100 px-5 py-6 shadow-subtle min-h-[164px]">
        <label htmlFor="customer-price" className="text-sm font-semibold text-slate-600 mb-3">
          Kundpris per behandling (kr, inkl moms)
        </label>
        <div className="relative flex items-center gap-2">
          <input
            id="customer-price"
            type="number"
            min="0"
            step="100"
            value={customerPrice}
            onChange={handleCustomerPriceChange}
            onBlur={handleCustomerPriceBlur}
            className="w-full text-base font-medium rounded-md border border-blue-100 focus:border-blue-400 bg-slate-50 py-2 px-3 pr-16 transition-all focus:ring-2 focus:ring-blue-200 outline-none h-12"
            aria-label="Kundpris per behandling"
          />
          <span className="ml-2 text-xs text-gray-500">kr</span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <button
              onClick={incrementPrice}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer"
              aria-label="Öka pris"
              type="button"
            >
              <ChevronUp className="h-4 w-4 text-blue-700" />
            </button>
            <button
              onClick={decrementPrice}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer"
              aria-label="Minska pris"
              type="button"
            >
              <ChevronDown className="h-4 w-4 text-blue-700" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">Justeras med pilar eller tangentbord</p>
      </div>
    </section>
  );
};

export default TreatmentSettings;
