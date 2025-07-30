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
              Alla våra maskiner (ej batteridrivna) drivs av ett digitalt pollettsystem. 
              Credits fylls på online till ditt avtalspris. Varje credit täcker en behandling.
            </p>
          </div>
          
          <div className="grid gap-3">
            <div className="flex items-start gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-900 text-sm">Budgeterbar kostnadsbild</div>
                <div className="text-blue-700 text-xs">Förutsägbara kostnader för din verksamhet</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-green-900 text-sm">Ingen missbruk av maskiner</div>
                <div className="text-green-700 text-xs">Personal kan inte använda din maskin utan tillstånd</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-purple-900 text-sm">Dela och ta betalt</div>
                <div className="text-purple-700 text-xs">Precis som en frisörsalong hyr ut en stol</div>
              </div>
            </div>
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