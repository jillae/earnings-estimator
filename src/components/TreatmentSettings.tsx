
import React from 'react';
import { formatCurrency } from '@/utils/calculatorUtils';
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
  // Funktion för att uppdatera antal behandlingar
  const handleTreatmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 12) {
      onTreatmentsChange(value);
    }
  };
  
  // Funktion för att uppdatera kundpris
  const handleCustomerPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      // Avrunda till närmaste 100-tal
      const roundedValue = Math.round(value / 100) * 100;
      onCustomerPriceChange(roundedValue);
    }
  };
  
  // När fältet förlorar fokus, avrunda till närmaste 100-tal
  const handleCustomerPriceBlur = () => {
    const roundedValue = Math.round(customerPrice / 100) * 100;
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
              min="1"
              max="12"
              step="1"
              value={treatmentsPerDay}
              onChange={handleTreatmentsChange}
              className="input-field pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">st</span>
            </div>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col">
              <ChevronUp className="h-4 w-4 text-gray-600" />
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Använd pilarna på tangentbordet för att justera värdet</p>
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
              step="100"
              value={customerPrice}
              onChange={handleCustomerPriceChange}
              onBlur={handleCustomerPriceBlur}
              className="input-field pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">kr</span>
            </div>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col">
              <ChevronUp className="h-4 w-4 text-gray-600" />
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Använd pilarna på tangentbordet för att justera värdet</p>
        </div>
      </div>
    </div>
  );
};

export default TreatmentSettings;
