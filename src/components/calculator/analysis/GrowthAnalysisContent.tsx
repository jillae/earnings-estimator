import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import DetailedAnalysisModal from '../DetailedAnalysisModal';

const GrowthAnalysisContent: React.FC = () => {
  const calculator = useCalculator();

  // Vi återanvänder innehållet från DetailedAnalysisModal men utan modal-wrappern
  // Detta är en temporary lösning - vi borde refactora DetailedAnalysisModal till innehållskomponent + modal
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Tillväxtprognos</h3>
        <p className="text-muted-foreground">
          Interaktiv analys av din kliniks ekonomiska utveckling över tid
        </p>
        {calculator.selectedMachine && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Baserat på {calculator.selectedMachine.name}
          </div>
        )}
      </div>
      
      {/* Här skulle vi vilja ha innehållet från DetailedAnalysisModal */}
      {/* För nu visar vi en placeholder med samma styling */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">📈 Tillväxtprognos</h4>
        <p className="text-blue-800 text-sm mb-4">
          Denna analys visar hur din kliniks ekonomi kan utvecklas över tid med {calculator.selectedMachine?.name || 'den valda maskinen'}.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded border">
            <div className="text-2xl font-bold text-green-600">
              {calculator.revenue.monthlyRevenueExVat ? `${Math.round(calculator.revenue.monthlyRevenueExVat / 1000)}k` : '--'}
            </div>
            <div className="text-sm text-gray-600">Månatlig intäkt (ex moms)</div>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <div className="text-2xl font-bold text-blue-600">
              {calculator.netResults.netPerMonthExVat ? `${Math.round(calculator.netResults.netPerMonthExVat / 1000)}k` : '--'}
            </div>
            <div className="text-sm text-gray-600">Månatligt netto (ex moms)</div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Tips:</strong> Använd denna data som grund för att planera din verksamhets tillväxt och investeringar.
            Kom ihåg att detta är beräkningsunderlag baserat på dina nuvarande inställningar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrowthAnalysisContent;