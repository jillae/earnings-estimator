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
      className={`cursor-pointer transition-all duration-200 ${
        !isEnabled 
          ? 'opacity-50 cursor-not-allowed bg-slate-50' 
          : isSelected 
            ? 'ring-2 ring-primary bg-primary/5' 
            : 'hover:bg-slate-50'
      }`}
      onClick={isEnabled ? onSelect : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-slate-900">
              Flatrate
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
          Fast månadsavgift för obegränsad användning av credits.
        </p>
        
        <div className="space-y-2">
          <div className="text-lg font-semibold text-green-600">
            {formatCurrency(flatrateCost)}/mån
          </div>
          
          {discountText && (
            <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
              Med {selectedSlaLevel}: {discountText}
            </Badge>
          )}
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              Obegränsad användning
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              Förutsägbar budgetering
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              Fast kostnad oavsett volym
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-slate-500">
          <strong>Bäst för:</strong> Höga behandlingsvolymer med förutsägbar kostnad
        </div>
        
        {!isEnabled && (
          <div className="mt-2 text-xs text-orange-600">
            Kräver standard leasingnivå eller högre
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlatrateCard;