import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info, Shield, Users, BarChart3 } from 'lucide-react';

const CreditInfoSection: React.FC = () => {
  return (
    <Card className="glass-card mb-6 animate-slide-in border-l-4 border-l-primary" style={{ animationDelay: '150ms' }}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-slate-900">Vad är Credits?</h3>
        </div>
        
        <p className="text-slate-700 mb-6 leading-relaxed">
          Alla våra maskiner (ej batteridrivna) drivs av ett digitalt pollettsystem. Detta möjliggör enkelt 
          samarbete med andra terapeuter om man vill hyra ut sin maskin och du bibehåller kontrollen över din 
          maskin. Credits fylls på med en digital voucher som beställs online till ditt avtalspris. Varje 
          credit täcker en behandling. Maskinen har inga förbruksartiklar och ingen kalibrering tillkommer.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-blue-900 text-sm">Budgeterbar kostnadsbild</div>
              <div className="text-blue-700 text-xs mt-1">Förutsägbara kostnader för din verksamhet</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-green-900 text-sm">Ingen missbruk av maskiner</div>
              <div className="text-green-700 text-xs mt-1">Personal kan inte använda din maskin utan tillstånd</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-purple-900 text-sm">Dela och ta betalt</div>
              <div className="text-purple-700 text-xs mt-1">Precis som en frisörsalong hyr ut en stol</div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <a 
            href="#" 
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
          >
            Läs mer om kreditmodellen här →
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditInfoSection;