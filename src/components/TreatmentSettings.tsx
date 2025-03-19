
import React from 'react';
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown } from 'lucide-react';

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
  const handleTreatmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onTreatmentsChange(value);
    }
  };
  
  const incrementTreatments = () => {
    onTreatmentsChange(treatmentsPerDay + 1);
  };
  
  const decrementTreatments = () => {
    if (treatmentsPerDay > 1) {
      onTreatmentsChange(treatmentsPerDay - 1);
    }
  };
  
  const handleCustomerPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      // Round to nearest 100
      const roundedValue = Math.round(value / 100) * 100;
      onCustomerPriceChange(roundedValue);
    }
  };
  
  const incrementCustomerPrice = () => {
    onCustomerPriceChange(customerPrice + 100);
  };
  
  const decrementCustomerPrice = () => {
    if (customerPrice > 100) {
      onCustomerPriceChange(customerPrice - 100);
    }
  };
  
  return (
    <div className="calculator-grid animate-slide-in" style={{ animationDelay: '150ms' }}>
      <div className="input-group">
        <label htmlFor="treatments-per-day" className="input-label">
          Antal behandlingar per dag
        </label>
        <div className="relative">
          <Input
            id="treatments-per-day"
            type="number"
            min="1"
            value={treatmentsPerDay}
            onChange={handleTreatmentsChange}
            className="pr-16"
          />
          <div className="absolute right-0 top-0 h-full flex flex-col">
            <button 
              type="button" 
              onClick={incrementTreatments}
              className="flex-1 px-2 border-l border-b border-input flex items-center justify-center hover:bg-gray-100"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button 
              type="button" 
              onClick={decrementTreatments}
              className="flex-1 px-2 border-l border-input flex items-center justify-center hover:bg-gray-100"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="input-group">
        <label htmlFor="customer-price" className="input-label">
          Kundpris per behandling (kr) ink moms
        </label>
        <div className="relative">
          <Input
            id="customer-price"
            type="number"
            min="100"
            step="100"
            value={customerPrice}
            onChange={handleCustomerPriceChange}
            className="pr-16"
          />
          <div className="absolute right-0 top-0 h-full flex flex-col">
            <button 
              type="button" 
              onClick={incrementCustomerPrice}
              className="flex-1 px-2 border-l border-b border-input flex items-center justify-center hover:bg-gray-100"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button 
              type="button" 
              onClick={decrementCustomerPrice}
              className="flex-1 px-2 border-l border-input flex items-center justify-center hover:bg-gray-100"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentSettings;
