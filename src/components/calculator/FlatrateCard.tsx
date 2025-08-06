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
  isEconomicallyViable: boolean;     // NYTT: Baserat på >2 behandlingar per dag
  recommendationText: string;        // NYTT: Dynamisk rekommendationstext
  recommendationType: 'positive' | 'negative' | 'neutral'; // NYTT: Typ av rekommendation
}

const FlatrateCard: React.FC<FlatrateCardProps> = ({
  isSelected,
  isEnabled,
  onSelect,
  flatrateCost,
  discountText,
  selectedSlaLevel,
  isEconomicallyViable,
  recommendationText,
  recommendationType
}) => {
  return (
    <Card 
      className={`relative cursor-pointer transition-all duration-300 h-full border-2 ${
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
            <div className="absolute -top-2 -right-2 z-10">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2 py-1 shadow-md">
                ✓ Vald
              </Badge>
            </div>
          )}
        </div>
        
        <p className="text-base text-slate-700 mb-6 leading-relaxed min-h-[3rem] flex items-center">
          {isEconomicallyViable 
            ? "Obegränsad användning till fast månadskostnad - ekonomiskt fördelaktigt för din volym (fler än 2 behandlingar/dag)"
            : "Obegränsad användning till fast månadskostnad - blir lönsamt när du gör fler än 2 behandlingar per dag"}
        </p>
        
        {/* Pris sektion - förenklad design */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {formatCurrency(flatrateCost)}<span className="text-lg font-normal text-slate-500">/mån</span>
          </div>
          
          {discountText && (
            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-sm px-2 py-1 mt-2">
              {discountText}
            </Badge>
          )}
        </div>
        
        {/* Fördelar sektion - kompaktare */}
        <div className="space-y-2.5 mb-6 flex-grow min-h-[7rem]">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-green-600 font-bold text-base">✔</span>
            <span>Alla credits inkluderade</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-green-600 font-bold text-base">✔</span>
            <span>Ingen risk för extra kostnader</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <span className="text-green-600 font-bold text-base">✔</span>
            <span>Minimalt med administration</span>
          </div>
        </div>
        
        {/* Bottom sektion - dynamisk rekommendation */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-700 mb-3 min-h-[2.5rem] flex items-center">
            <span className="font-semibold">
              {isEconomicallyViable 
                ? "✅ Optimal för dig som gör fler än 2 behandlingar per dag – slipp tänka på saldo, inköp eller variation."
                : "⚠️ För dig med hög volym – men kontrollera lönsamheten: Flatrate blir ekonomiskt fördelaktigt vid fler än 2 behandlingar per dag."}
            </span>
          </div>
          
          {/* KRITISK EKONOMISK REKOMMENDATION */}
          <div className={`border rounded-lg p-3 text-sm ${
            recommendationType === 'positive' 
              ? 'bg-green-50 border-green-200' 
              : recommendationType === 'negative'
              ? 'bg-orange-50 border-orange-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-2">
              <span className={
                recommendationType === 'positive' 
                  ? 'text-green-600 font-bold' 
                  : recommendationType === 'negative'
                  ? 'text-orange-600 font-bold'
                  : 'text-blue-600 font-bold'
              }>
                {recommendationType === 'positive' ? '💰' : recommendationType === 'negative' ? '⚠️' : '💡'}
              </span>
              <div className={
                recommendationType === 'positive' 
                  ? 'text-green-700' 
                  : recommendationType === 'negative'
                  ? 'text-orange-700'
                  : 'text-blue-700'
              }>
                <span className="font-medium">
                  {recommendationType === 'positive' ? 'Ekonomiskt fördelaktigt:' : 
                   recommendationType === 'negative' ? 'Ekonomisk varning:' : 'Tips:'}
                </span> {recommendationText}
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