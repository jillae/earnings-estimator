
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { Check, Phone, Headphones, Crown } from 'lucide-react';

const SlaSelector: React.FC = () => {
  const { 
    selectedSlaLevel, 
    setSlaLevel, 
    slaCosts,
    selectedMachine,
    leasingMax60mRef
  } = useCalculator();

const handleSlaChange = (value: 'Brons' | 'Silver' | 'Guld') => {
    setSlaLevel(value);
  };

  // Beräkna om Flatrate ska visas i Silver/Guld beskrivningen
  const showCreditsIncludedSilver = selectedMachine?.usesCredits && selectedSlaLevel === 'Silver';
  const showCreditsIncludedGuld = selectedMachine?.usesCredits && selectedSlaLevel === 'Guld';

  // Ta bort denna logg för att undvika loops

  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '350ms' }}>
      <h3 className="text-lg font-semibold mb-4">Serviceavtal (SLA)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Brons SLA */}
        <Card 
          className={`cursor-pointer transition-all duration-300 border-2 ${
            selectedSlaLevel === 'Brons'
              ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50 shadow-lg' 
              : 'border-slate-200 hover:border-amber-300 hover:shadow-md'
          }`}
          onClick={() => handleSlaChange('Brons')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-slate-900">Brons</h4>
              </div>
              {selectedSlaLevel === 'Brons' && (
                <Badge variant="default" className="text-xs font-bold bg-amber-600 shadow-md ring-2 ring-amber-300">
                  <Check className="h-3 w-3 mr-1" />
                  VALD
                </Badge>
              )}
            </div>
            
            <div className="text-lg font-bold text-amber-600 mb-2">
              Ingår vid köp
            </div>
            <div className="text-xs text-slate-500 mb-3">
              {formatCurrency(0)}/mån
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                <span>Grundläggande telefonsupport</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Silver SLA */}
        <Card 
          className={`cursor-pointer transition-all duration-300 border-2 ${
            selectedSlaLevel === 'Silver'
              ? 'ring-2 ring-slate-500 border-slate-500 bg-slate-50 shadow-lg' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
          }`}
          onClick={() => handleSlaChange('Silver')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-slate-600" />
                <h4 className="font-semibold text-slate-900">Silver</h4>
              </div>
              {selectedSlaLevel === 'Silver' && (
                <Badge variant="default" className="text-xs font-bold bg-slate-600 shadow-md ring-2 ring-slate-300">
                  <Check className="h-3 w-3 mr-1" />
                  VALD
                </Badge>
              )}
            </div>
            
            <div className="text-lg font-bold text-slate-600 mb-2">
              {formatCurrency(slaCosts.Silver)}
            </div>
            <div className="text-xs text-slate-500 mb-3">
              per månad
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full flex-shrink-0"></div>
                <span>Prioriterad support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full flex-shrink-0"></div>
                <span>Fjärrhjälp</span>
              </div>
            </div>
            
            {selectedMachine?.usesCredits && (
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">
                + Flatrate ingår
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Guld SLA */}
        <Card 
          className={`cursor-pointer transition-all duration-300 border-2 ${
            selectedSlaLevel === 'Guld'
              ? 'ring-2 ring-yellow-500 border-yellow-500 bg-yellow-50 shadow-lg' 
              : 'border-slate-200 hover:border-yellow-300 hover:shadow-md'
          }`}
          onClick={() => handleSlaChange('Guld')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-slate-900">Guld</h4>
              </div>
              {selectedSlaLevel === 'Guld' && (
                <Badge variant="default" className="text-xs font-bold bg-yellow-600 shadow-md ring-2 ring-yellow-300">
                  <Check className="h-3 w-3 mr-1" />
                  VALD
                </Badge>
              )}
            </div>
            
            <div className="text-lg font-bold text-yellow-600 mb-2">
              {formatCurrency(slaCosts.Guld)}
            </div>
            <div className="text-xs text-slate-500 mb-3">
              per månad
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <span>VIP-support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <span>Årlig genomgång på plats</span>
              </div>
            </div>
            
            {selectedMachine?.usesCredits && (
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">
                + Flatrate ingår
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
      
      {(showCreditsIncludedSilver || showCreditsIncludedGuld) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Obegränsat antal credits ingår i detta SLA-abonnemang.
          </p>
        </div>
      )}
    </div>
  );
};

export default SlaSelector;
