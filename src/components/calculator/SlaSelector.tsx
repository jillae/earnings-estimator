
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCalculator } from '@/context/CalculatorContext';
import { SLA_PRICES } from '@/utils/constants';
import { formatCurrency } from '@/utils/formatUtils';

const SlaSelector: React.FC = () => {
  const { selectedSlaLevel, setSlaLevel } = useCalculator();

  const handleSlaChange = (value: 'Brons' | 'Silver' | 'Guld') => {
    setSlaLevel(value);
  };

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '350ms' }}>
      <h3 className="text-lg font-semibold mb-4">Serviceavtal (SLA)</h3>
      
      <RadioGroup 
        value={selectedSlaLevel} 
        onValueChange={handleSlaChange as (value: string) => void}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Brons" id="sla-brons" />
          <Label htmlFor="sla-brons" className="flex-1">
            <span className="font-medium">Brons</span>
            <div className="text-xs text-gray-500">Ingår vid köp ({formatCurrency(SLA_PRICES.Brons)}/mån)</div>
            <div className="text-xs text-blue-600">Grundläggande telefonsupport</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Silver" id="sla-silver" />
          <Label htmlFor="sla-silver" className="flex-1">
            <span className="font-medium">Silver</span>
            <div className="text-xs text-gray-500">{formatCurrency(SLA_PRICES.Silver)}/mån</div>
            <div className="text-xs text-blue-600">Prioriterad support & fjärrhjälp</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Guld" id="sla-guld" />
          <Label htmlFor="sla-guld" className="flex-1">
            <span className="font-medium">Guld</span>
            <div className="text-xs text-gray-500">{formatCurrency(SLA_PRICES.Guld)}/mån</div>
            <div className="text-xs text-blue-600">VIP-support & årlig genomgång på plats</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SlaSelector;
