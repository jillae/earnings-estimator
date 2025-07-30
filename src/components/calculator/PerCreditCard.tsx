import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { WORKING_DAYS_PER_MONTH } from '@/utils/constants';

interface PerCreditCardProps {
  isSelected: boolean;
  onSelect: () => void;
  creditPrice: number;
  creditsPerTreatment: number;
  treatmentsPerDay: number;
}

const PerCreditCard: React.FC<PerCreditCardProps> = ({
  isSelected,
  onSelect,
  creditPrice,
  creditsPerTreatment,
  treatmentsPerDay
}) => {
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditsCostPerMonth = totalCreditsPerMonth * creditPrice;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary bg-primary/5' 
          : 'hover:bg-slate-50'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">
              Per Credit
            </h3>
          </div>
          {isSelected && (
            <Badge variant="default" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Vald
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-slate-600 mb-3">
          Betala endast för de credits du faktiskt använder.
        </p>
        
        <div className="space-y-2">
          <div className="text-sm text-slate-600">
            {formatCurrency(creditPrice)} × {totalCreditsPerMonth} credits/mån
          </div>
          <div className="text-lg font-semibold text-blue-600">
            {formatCurrency(creditsCostPerMonth)}/mån
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              Flexibel användning
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              Betala endast för faktisk användning
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              Variabel kostnad
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-slate-500">
          <strong>Bäst för:</strong> Låg eller varierande behandlingsvolym
        </div>
      </CardContent>
    </Card>
  );
};

export default PerCreditCard;