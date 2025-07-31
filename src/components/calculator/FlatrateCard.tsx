import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

interface FlatrateCardProps {
  isSelected: boolean;
  isEnabled: boolean;
  onSelect: () => void;
  flatrateCost: number;
  discountText?: string;
  selectedSlaLevel: string;
}

const FlatrateCard: React.FC<FlatrateCardProps> = ({
  isSelected,
  isEnabled,
  onSelect,
  flatrateCost,
  discountText,
  selectedSlaLevel
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 h-full border-2 ${
        !isEnabled 
          ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' 
          : isSelected 
            ? 'ring-2 ring-green-500 border-green-500 bg-green-50 shadow-lg' 
            : 'border-slate-200 hover:border-green-300 hover:shadow-md'
      }`}
      onClick={isEnabled ? onSelect : undefined}
    >
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Flatrate
            </h3>
          </div>
          {isSelected && (
            <Badge variant="default" className="text-sm font-bold px-3 py-1.5 bg-green-600 shadow-md ring-2 ring-green-300">
              <Check className="h-4 w-4 mr-1" />
              VALD
            </Badge>
          )}
        </div>
        
        <p className="text-base text-slate-700 mb-4 leading-relaxed">
          Fullständig kostnadskontroll med fast månadsavgift
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(flatrateCost)}<span className="text-base font-normal text-slate-500">/mån</span>
          </div>
          
          
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-green-600 font-bold">✔</span>
              <span>Fast månadspris</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-green-600 font-bold">✔</span>
              <span>Alla credits inkluderade</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-green-600 font-bold">✔</span>
              <span>Inga extra driftkostnader</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-green-600 font-bold">✔</span>
              <span>Förutsägbar budget – inga överraskningar</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-700 mb-2">
            <span className="font-semibold">Bäst för dig som gör fler än 2 behandlingar per dag</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">💡</span>
              <div className="text-blue-700">
                <span className="font-medium">Tips:</span> Gör du i snitt mer än 2 behandlingar per dag? Då är Flatrate mer lönsam än styckepris.
              </div>
            </div>
          </div>
          
          {!isEnabled && (
            <div className="mt-2 text-sm text-orange-600 font-medium">
              Kräver standard leasingnivå eller högre
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlatrateCard;