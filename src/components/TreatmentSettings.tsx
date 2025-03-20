
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from '@/utils/calculatorUtils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TreatmentSettingsProps {
  treatmentsPerDay: number;
  customerPrice: number;
  onTreatmentsChange: (value: number) => void;
  onCustomerPriceChange: (value: number) => void;
}

// Create price options with step of 100 from 400 to 5000
const priceOptions = Array.from({ length: 47 }, (_, i) => 400 + i * 100);

const TreatmentSettings: React.FC<TreatmentSettingsProps> = ({
  treatmentsPerDay,
  customerPrice,
  onTreatmentsChange,
  onCustomerPriceChange
}) => {
  const handlePriceChange = (value: string) => {
    onCustomerPriceChange(parseInt(value, 10));
  };

  // Min och max värden för behandlingar per dag
  const MIN_TREATMENTS = 1;
  const MAX_TREATMENTS = 12;

  // Hanterare för öka/minska-knappar
  const increaseTreatments = () => {
    if (treatmentsPerDay < MAX_TREATMENTS) {
      onTreatmentsChange(treatmentsPerDay + 1);
    }
  };

  const decreaseTreatments = () => {
    if (treatmentsPerDay > MIN_TREATMENTS) {
      onTreatmentsChange(treatmentsPerDay - 1);
    }
  };

  // Hanterare för direkt inmatning i fältet
  const handleTreatmentsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      const clampedValue = Math.max(MIN_TREATMENTS, Math.min(value, MAX_TREATMENTS));
      onTreatmentsChange(clampedValue);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
      <div className="input-group mb-0">
        <div className="h-14 flex items-center">
          <label htmlFor="treatments-per-day" className="input-label">
            Antal behandlingar per dag
          </label>
        </div>
        
        <div className="flex h-10 items-center rounded-md border border-input">
          <input
            id="treatments-per-day"
            type="number"
            min={MIN_TREATMENTS}
            max={MAX_TREATMENTS}
            value={treatmentsPerDay}
            onChange={handleTreatmentsInputChange}
            className="w-full rounded-l-md px-3 py-2 text-sm bg-transparent"
          />
          <div className="flex flex-col h-full border-l">
            <button 
              className="flex-1 px-2 hover:bg-muted flex items-center justify-center"
              onClick={increaseTreatments}
              type="button"
              aria-label="Öka antal behandlingar"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <div className="border-t w-full"></div>
            <button 
              className="flex-1 px-2 hover:bg-muted flex items-center justify-center"
              onClick={decreaseTreatments}
              type="button"
              aria-label="Minska antal behandlingar"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
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
