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
  isDisabled?: boolean;
}

const PerCreditCard: React.FC<PerCreditCardProps> = ({
  isSelected,
  onSelect,
  creditPrice,
  creditsPerTreatment,
  treatmentsPerDay,
  isDisabled = false
}) => {
  const treatmentsPerMonth = treatmentsPerDay * WORKING_DAYS_PER_MONTH;
  const totalCreditsPerMonth = treatmentsPerMonth * creditsPerTreatment;
  const creditsCostPerMonth = totalCreditsPerMonth * creditPrice;

  return (
    <Card 
      className={`transition-all duration-300 h-full border-2 ${
        isDisabled 
          ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' 
          : isSelected 
            ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 shadow-lg cursor-pointer' 
            : 'border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
      }`}
      onClick={isDisabled ? undefined : onSelect}
    >
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Styckepris
            </h3>
          </div>
          {isSelected && (
            <Badge variant="default" className="text-sm font-bold px-3 py-1.5 bg-blue-600 shadow-md ring-2 ring-blue-300">
              <Check className="h-4 w-4 mr-1" />
              VALD
            </Badge>
          )}
        </div>
        
        <p className="text-base text-slate-700 mb-4 leading-relaxed">
          Betala endast för de credits du faktiskt använder.
        </p>
        
        <div className="space-y-3 mb-4 flex-grow">
          <div className="text-base text-slate-600 bg-slate-50 p-3 rounded-lg">
            {formatCurrency(creditPrice)} × {totalCreditsPerMonth} credits/mån
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(creditsCostPerMonth)}<span className="text-base font-normal text-slate-500">/mån</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Flexibel användning</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Betala endast för faktisk användning</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Variabel kostnad</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-700">Bäst för:</span> Låg eller varierande behandlingsvolym
          </div>
          
          {isDisabled && (
            <div className="mt-2 text-sm text-orange-600 font-medium">
              Credits ingår redan i ditt valda paket
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerCreditCard;