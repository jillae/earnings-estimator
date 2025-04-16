
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

const PaymentOptionToggle: React.FC = () => {
  const { paymentOption, setPaymentOption, cashPriceSEK } = useCalculator();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Betalningsalternativ</label>
      <ToggleGroup 
        type="single"
        variant="outline" 
        value={paymentOption}
        onValueChange={(value) => {
          if (value) setPaymentOption(value as 'leasing' | 'cash');
        }}
        className="w-full grid grid-cols-2"
      >
        <ToggleGroupItem value="leasing" className="w-full rounded-r-none">
          <span className="mr-2">Leasing</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="cash" className="w-full rounded-l-none">
          <span className="mr-2">Kontant (exkl. moms och ev. tull, inkl. frakt & handhavandeutbildning)</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default PaymentOptionToggle;

