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
        
        <p className="text-base text-slate-700 mb-6 leading-relaxed min-h-[3rem] flex items-center">
          Maximal flexibilitet – betala bara för det du använder
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
            <span>Betala enbart per behandling</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-blue-600 font-bold text-base">✔</span>
            <span>Ingen bindning – full frihet</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-blue-600 font-bold text-base">✔</span>
            <span>Anpassa efter faktisk användning</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-blue-600 font-bold text-base">✔</span>
            <span>Perfekt vid ojämnt kundflöde eller lägre volym</span>
          </div>
        </div>
        
        {/* Bottom sektion - samma struktur */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-700 mb-3 min-h-[2.5rem] flex items-center">
            <span className="font-semibold">Bäst för dig som gör upp till 2 behandlingar per dag</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">💡</span>
              <div className="text-blue-700">
                <span className="font-medium">Tips:</span> Överstiger du 2 behandlingar per dag i snitt? Då kan vårt Flatrate-abonnemang bli mer lönsamt.
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