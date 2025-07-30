import React, { useState } from 'react';
import { Info, BarChart3, Shield, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const CreditInfoPopover: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-500 hover:text-slate-700 p-1 h-auto"
        >
          <Info className="h-4 w-4 mr-1" />
          <span className="text-xs">Vad är Credits?</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Vad är Credits?</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              Alla våra golvmaskiner (ej batteridrivna) använder ett offline digitalt kreditsystem – godkänt för medicinskt bruk. 
              Varje credit motsvarar en behandling och beställs enkelt i 25-pack till avtalspris. Påfyllning sker direkt i maskinen – inga internetuppkopplingar krävs.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-slate-900 mb-3 text-sm">Dina tre största fördelar</h5>
            <div className="grid gap-3">
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5 flex-shrink-0">💰</span>
                <div>
                  <div className="font-medium text-blue-900 text-sm">Förutsägbara kostnader</div>
                  <div className="text-blue-700 text-xs">Du vet exakt vad varje behandling kostar – perfekt för budget och lönsamhet. Välj mellan styckpris eller Fastpris-abonnemang.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5 flex-shrink-0">🔒</span>
                <div>
                  <div className="font-medium text-green-900 text-sm">Säker och kontrollerad användning</div>
                  <div className="text-green-700 text-xs">Endast auktoriserad personal kan använda maskinen. Du slipper missbruk och får trygg drift.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5 flex-shrink-0">🤝</span>
                <div>
                  <div className="font-medium text-purple-900 text-sm">Dela och tjänar extra</div>
                  <div className="text-purple-700 text-xs">Hyr ut maskinen, per behandling – precis som en frisör hyr ut en stol. Smidigt och lönsamt.</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              Vill du behandla obegränsat? Då är vårt Fastpris-abonnemang det självklara valet för kliniker med 2+ kunder/dag.
            </p>
          </div>
          
          <div className="pt-2 border-t border-slate-100">
            <a 
              href="#" 
              className="text-primary hover:text-primary/80 text-xs font-medium transition-colors duration-200"
            >
              Läs mer om kreditmodellen här →
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreditInfoPopover;