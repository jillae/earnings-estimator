
import React from 'react';
import { formatCurrency } from '@/utils/calculatorUtils';

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
  // Funktion för att uppdatera antal behandlingar
  const handleTreatmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onTreatmentsChange(value);
    }
  };
  
  // Funktion för att uppdatera kundpris
  const handleCustomerPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      // Avrunda till närmaste 10-tal
      const roundedValue = Math.round(value / 10) * 10;
      onCustomerPriceChange(roundedValue);
    }
  };
  
  // När fältet förlorar fokus, avrunda till närmaste 10-tal
  const handleCustomerPriceBlur = () => {
    const roundedValue = Math.round(customerPrice / 10) * 10;
    onCustomerPriceChange(roundedValue);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="input-group">
          <label htmlFor="treatments-per-day" className="input-label">
            Antal behandlingar per dag
          </label>
          <div className="relative">
            <input
              id="treatments-per-day"
              type="number"
              min="0"
              step="1"
              value={treatmentsPerDay}
              onChange={handleTreatmentsChange}
              className="input-field pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">st</span>
            </div>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="customer-price" className="input-label">
            Kundpris per behandling (kr) ink moms
          </label>
          <div className="relative">
            <input
              id="customer-price"
              type="number"
              min="0"
              step="10"
              value={customerPrice}
              onChange={handleCustomerPriceChange}
              onBlur={handleCustomerPriceBlur}
              className="input-field pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">kr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentSettings;
