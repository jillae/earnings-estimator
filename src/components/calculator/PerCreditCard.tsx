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
          Maximal flexibilitet – betala bara för det du använder
        </p>
        
        <div className="space-y-3 mb-4 flex-grow">
          <div className="text-base text-slate-600 bg-slate-50 p-3 rounded-lg">
            {formatCurrency(creditPrice)} × {totalCreditsPerMonth} credits/mån = {formatCurrency(creditsCostPerMonth)}/mån (exempel)
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-blue-600 font-bold">✔</span>
              <span>Betala enbart per behandling</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-blue-600 font-bold">✔</span>
              <span>Ingen bindning – full frihet</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-blue-600 font-bold">✔</span>
              <span>Anpassa efter faktisk användning</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-blue-600 font-bold">✔</span>
              <span>Perfekt vid ojämnt kundflöde eller lägre volym</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-700 mb-2">
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