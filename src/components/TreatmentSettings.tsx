
import React from 'react';
import { Input } from "@/components/ui/input";

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
  
  const handleCustomerPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onCustomerPriceChange(value);
    }
  };
  
  return (
    <div className="calculator-grid animate-slide-in" style={{ animationDelay: '500ms' }}>
      <div className="input-group">
        <label htmlFor="treatments-per-day" className="input-label">
          Antal behandlingar per dag
        </label>
        <Input
          id="treatments-per-day"
          type="number"
          min="1"
          value={treatmentsPerDay}
          onChange={handleTreatmentsChange}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="customer-price" className="input-label">
          Kundpris per behandling (kr) ink moms
        </label>
        <Input
          id="customer-price"
          type="number"
          min="1"
          value={customerPrice}
          onChange={handleCustomerPriceChange}
        />
      </div>
    </div>
  );
};

export default TreatmentSettings;
