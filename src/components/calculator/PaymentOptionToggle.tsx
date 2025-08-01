
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';

interface PaymentOptionToggleProps {
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange?: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
}

const PaymentOptionToggle: React.FC<PaymentOptionToggleProps> = ({ 
  hoveredInput, 
  onHoveredInputChange 
}) => {
  const { paymentOption, setPaymentOption, cashPriceSEK } = useCalculator();

  return (
    <div 
      className="mb-4 p-4 bg-red-50/20 border border-red-200 rounded-lg hover:bg-red-50/30 hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => onHoveredInputChange?.('payment')}
      onMouseLeave={() => onHoveredInputChange?.(null)}
    >
      {/* Ingen label - strömlinjeformat flöde */}
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
          <span className="mr-2">Kontant ({formatCurrency(cashPriceSEK)})</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default PaymentOptionToggle;
