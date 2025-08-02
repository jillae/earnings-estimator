
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { Check, Phone, Headphones, Crown } from 'lucide-react';
import LeasingAlternativesModal from '../LeasingAlternativesModal';

interface SlaSelectorProps {
  hoveredInput?: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null;
  onHoveredInputChange?: (input: 'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | 'clinic' | null) => void;
}

const SlaSelector: React.FC<SlaSelectorProps> = ({ 
  hoveredInput, 
  onHoveredInputChange 
}) => {
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
    <div 
      className="glass-card mt-4 animate-slide-in bg-red-50/20 border-red-200 hover:bg-red-50/30 hover:shadow-lg transition-all duration-200" 
      style={{ animationDelay: '350ms' }}
      onMouseEnter={() => onHoveredInputChange?.('sla')}
      onMouseLeave={() => onHoveredInputChange?.(null)}
    >
      <h3 className="text-lg font-semibold mb-6">
        Serviceavtal (SLA) - Jämförelsetabell
      </h3>
      
      {/* Matrix Header */}
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white rounded-lg border border-slate-200 shadow-sm">
          
          {/* Header Row */}
          <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
            <div className="p-4 font-semibold text-slate-700">Funktioner</div>
            <div className="p-4 text-center border-l border-slate-200">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-slate-900">Brons</span>
                </div>
                {selectedSlaLevel === 'Brons' && (
                  <Badge variant="default" className="text-xs font-bold bg-amber-600">
                    <Check className="h-3 w-3 mr-1" />
                    VALD
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-slate-600" />
                  <span className="font-semibold text-slate-900">Silver</span>
                </div>
                {selectedSlaLevel === 'Silver' && (
                  <Badge variant="default" className="text-xs font-bold bg-slate-600">
                    <Check className="h-3 w-3 mr-1" />
                    VALD
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-slate-900">Guld</span>
                </div>
                {selectedSlaLevel === 'Guld' && (
                  <Badge variant="default" className="text-xs font-bold bg-yellow-600">
                    <Check className="h-3 w-3 mr-1" />
                    VALD
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Price Row - hela celler klickbara */}
          <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-25">
            <div className="p-4 font-medium text-slate-700">Månadskostnad</div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Brons' ? 'bg-amber-50' : 'hover:bg-amber-25'
              }`}
              onClick={() => handleSlaChange('Brons')}
            >
              <div className="text-lg font-bold text-amber-600">Ingår vid köp</div>
              <div className="text-xs text-slate-500">{formatCurrency(0)}/mån</div>
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Silver' ? 'bg-slate-50' : 'hover:bg-slate-25'
              }`}
              onClick={() => handleSlaChange('Silver')}
            >
              <div className="text-lg font-bold text-slate-600">{formatCurrency(slaCosts.Silver)}</div>
              <div className="text-xs text-slate-500">per månad (25% av grundkostnad)</div>
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Guld' ? 'bg-yellow-50' : 'hover:bg-yellow-25'
              }`}
              onClick={() => handleSlaChange('Guld')}
            >
              <div className="text-lg font-bold text-yellow-600">{formatCurrency(slaCosts.Guld)}</div>
              <div className="text-xs text-slate-500">per månad (50% av grundkostnad)</div>
            </div>
          </div>

          {/* Features Matrix - hela celler klickbara */}
          <div className="grid grid-cols-4 border-b border-slate-200">
            <div className="p-4 font-medium text-slate-700">Telefonsupport</div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Brons' ? 'bg-amber-50' : 'hover:bg-amber-25'
              }`}
              onClick={() => handleSlaChange('Brons')}
            >
              <Check className="h-5 w-5 text-green-600 mx-auto" />
              <div className="text-xs text-slate-600 mt-1">Grundläggande</div>
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Silver' ? 'bg-slate-50' : 'hover:bg-slate-25'
              }`}
              onClick={() => handleSlaChange('Silver')}
            >
              <Check className="h-5 w-5 text-green-600 mx-auto" />
              <div className="text-xs text-slate-600 mt-1">Prioriterad</div>
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Guld' ? 'bg-yellow-50' : 'hover:bg-yellow-25'
              }`}
              onClick={() => handleSlaChange('Guld')}
            >
              <Check className="h-5 w-5 text-green-600 mx-auto" />
              <div className="text-xs text-slate-600 mt-1">VIP-support</div>
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-slate-200">
            <div className="p-4 font-medium text-slate-700">Fjärrhjälp</div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Brons' ? 'bg-amber-50' : 'hover:bg-amber-25'
              }`}
              onClick={() => handleSlaChange('Brons')}
            >
              <div className="text-slate-400">-</div>
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Silver' ? 'bg-slate-50' : 'hover:bg-slate-25'
              }`}
              onClick={() => handleSlaChange('Silver')}
            >
              <Check className="h-5 w-5 text-green-600 mx-auto" />
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Guld' ? 'bg-yellow-50' : 'hover:bg-yellow-25'
              }`}
              onClick={() => handleSlaChange('Guld')}
            >
              <Check className="h-5 w-5 text-green-600 mx-auto" />
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-slate-200">
            <div className="p-4 font-medium text-slate-700">Årlig genomgång på plats</div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Brons' ? 'bg-amber-50' : 'hover:bg-amber-25'
              }`}
              onClick={() => handleSlaChange('Brons')}
            >
              <div className="text-slate-400">-</div>
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Silver' ? 'bg-slate-50' : 'hover:bg-slate-25'
              }`}
              onClick={() => handleSlaChange('Silver')}
            >
              <div className="text-slate-400">-</div>
            </div>
            <div 
              className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                selectedSlaLevel === 'Guld' ? 'bg-yellow-50' : 'hover:bg-yellow-25'
              }`}
              onClick={() => handleSlaChange('Guld')}
            >
              <Check className="h-5 w-5 text-green-600 mx-auto" />
            </div>
          </div>

          {selectedMachine?.usesCredits && (
            <div className="grid grid-cols-4 border-b border-slate-200 bg-green-25">
              <div className="p-4 font-medium text-slate-700">Flatrate Credits</div>
              <div 
                className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                  selectedSlaLevel === 'Brons' ? 'bg-amber-50' : 'hover:bg-amber-25'
                }`}
                onClick={() => handleSlaChange('Brons')}
              >
                <div className="text-slate-400">-</div>
              </div>
              <div 
                className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                  selectedSlaLevel === 'Silver' ? 'bg-slate-50' : 'hover:bg-slate-25'
                }`}
                onClick={() => handleSlaChange('Silver')}
              >
                <Check className="h-5 w-5 text-green-600 mx-auto" />
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs mt-1">
                  Ingår
                </Badge>
              </div>
              <div 
                className={`p-4 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                  selectedSlaLevel === 'Guld' ? 'bg-yellow-50' : 'hover:bg-yellow-25'
                }`}
                onClick={() => handleSlaChange('Guld')}
              >
                <Check className="h-5 w-5 text-green-600 mx-auto" />
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs mt-1">
                  Ingår
                </Badge>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="grid grid-cols-4 bg-slate-50">
            <div className="p-4"></div>
            <div className="p-4 text-center border-l border-slate-200">
              <button
                onClick={() => handleSlaChange('Brons')}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedSlaLevel === 'Brons'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {selectedSlaLevel === 'Brons' ? 'Vald' : 'Välj Brons'}
              </button>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <button
                onClick={() => handleSlaChange('Silver')}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedSlaLevel === 'Silver'
                    ? 'bg-slate-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedSlaLevel === 'Silver' ? 'Vald' : 'Välj Silver'}
              </button>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <button
                onClick={() => handleSlaChange('Guld')}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedSlaLevel === 'Guld'
                    ? 'bg-yellow-600 text-white shadow-md'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                {selectedSlaLevel === 'Guld' ? 'Vald' : 'Välj Guld'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leasingalternativ modal */}
      <div className="mt-6">
        <LeasingAlternativesModal />
      </div>

      {/* Flatrate info om det är valt */}
      {selectedMachine?.usesCredits && (selectedSlaLevel === 'Silver' || selectedSlaLevel === 'Guld') && (
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
