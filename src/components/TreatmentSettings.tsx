
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from '@/utils/calculatorUtils';

interface TreatmentSettingsProps {
  treatmentsPerDay: number;
  customerPrice: number;
  onTreatmentsChange: (value: number) => void;
  onCustomerPriceChange: (value: number) => void;
}

const treatmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// Create price options with step of 100 from 400 to 5000
const priceOptions = Array.from({ length: 47 }, (_, i) => 400 + i * 100);

const TreatmentSettings: React.FC<TreatmentSettingsProps> = ({
  treatmentsPerDay,
  customerPrice,
  onTreatmentsChange,
  onCustomerPriceChange
}) => {
  const handleTreatmentsChange = (value: string) => {
    onTreatmentsChange(parseInt(value, 10));
  };

  const handlePriceChange = (value: string) => {
    onCustomerPriceChange(parseInt(value, 10));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
      <div className="input-group mb-0">
        <div className="h-14 flex items-center">
          <label htmlFor="treatments-per-day" className="input-label">
            Antal behandlingar per dag
          </label>
        </div>
        
        <Select 
          value={treatmentsPerDay.toString()} 
          onValueChange={handleTreatmentsChange}
        >
          <SelectTrigger className="w-full" id="treatments-per-day">
            <SelectValue placeholder="Välj antal" />
          </SelectTrigger>
          <SelectContent>
            {treatmentOptions.map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="input-group mb-0">
        <div className="h-14 flex items-center">
          <label htmlFor="customer-price" className="input-label">
            Kundpris per behandling (kr) ink moms
          </label>
        </div>
        
        <Select 
          value={customerPrice.toString()} 
          onValueChange={handlePriceChange}
        >
          <SelectTrigger className="w-full" id="customer-price">
            <SelectValue placeholder="Välj pris" />
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {formatCurrency(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TreatmentSettings;
