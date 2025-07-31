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
      className={`relative transition-all duration-300 h-full border-2 ${
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
            <div className="absolute -top-2 -right-2 z-10">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 shadow-md">
                ✓ Vald
              </Badge>
            </div>
          )}
        </div>
        
        <p className="text-base text-slate-700 mb-6 leading-relaxed min-h-[3rem] flex items-center">
          Betala endast för den användning du faktiskt har
        </p>
        
        {/* Pris sektion - förenklad design */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {formatCurrency(creditPrice)} × {totalCreditsPerMonth}
          </div>
          <div className="text-lg font-semibold text-slate-600 mb-1">
            = {formatCurrency(creditsCostPerMonth)}<span className="text-base font-normal text-slate-500">/mån</span>
          </div>
          <div className="text-sm text-slate-500">(exempel vid nuvarande användning)</div>
        </div>
        
        {/* Fördelar sektion - kompaktare */}
        <div className="space-y-2.5 mb-6 flex-grow min-h-[7rem]">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-blue-600 font-bold text-base">✔</span>
            <span>Betala per faktisk behandling</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-blue-600 font-bold text-base">✔</span>
            <span>Ingen bindning</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-blue-600 font-bold text-base">✔</span>
            <span>Perfekt för låg eller varierande volym</span>
          </div>
        </div>
        
        {/* Bottom sektion - samma struktur */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-700 mb-3 min-h-[2.5rem] flex items-center">
            <span className="font-semibold">Passar dig som gör upp till 2 behandlingar per dag.</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">💡</span>
              <div className="text-blue-700">
                <span className="font-medium">Tips:</span> Gör du fler än 2? Då är Flatrate sannolikt mer kostnadseffektivt.
              </div>
            </div>
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