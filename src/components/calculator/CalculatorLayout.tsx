
import React, { useState } from 'react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import { useCalculator } from '@/context/CalculatorContext';
import { SaveConfigurationButton } from './SaveConfigurationButton';
import { QuoteRequestButton } from './QuoteRequestButton';
import DetailedAnalysisModal from './DetailedAnalysisModal';

const CalculatorLayout: React.FC = () => {
  const { netResults } = useCalculator();
  const [hoveredInput, setHoveredInput] = useState<'treatments' | 'price' | 'workdays' | 'leasing' | 'payment' | 'sla' | 'credits' | null>(null);
  
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CalculatorInputs hoveredInput={hoveredInput} onHoveredInputChange={setHoveredInput} />
        </div>
        <div className="space-y-6">
          <CalculatorResults hoveredInput={hoveredInput} />
        </div>
      </div>
      
      {/* Flytta "Nästa steg" utanför grid för full-width */}
      <div className="mt-12">
        {/* Full-width förbättrat action block */}
        <div className="-mx-4 sm:-mx-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          {/* Separator med gradient */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-0"></div>
          
          {/* Hero-style nästa steg sektion */}
          <div className="relative overflow-hidden">
            {/* Bakgrundsmönster */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-emerald-600/5 to-purple-600/5"></div>
            
            <div className="relative px-4 sm:px-6 py-12">
              <div className="max-w-4xl mx-auto text-center">
                {/* Header */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Nästa steg</h3>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Din beräkning är klar! Välj hur du vill gå vidare med din investering
                  </p>
                </div>
                
                {/* Action cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  <div className="group bg-white rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">💾</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Spara din konfiguration</h4>
                      <p className="text-sm text-slate-600 mb-4">Behåll alla dina inställningar för framtida användning</p>
                    </div>
                    <SaveConfigurationButton />
                  </div>
                  
                  <div className="group bg-white rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">📝</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Begär personlig offert</h4>
                      <p className="text-sm text-slate-600 mb-4">Få en skräddarsydd offert baserad på din konfiguration</p>
                    </div>
                    <QuoteRequestButton />
                  </div>
                  
                  <div className="group bg-white rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">📊</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Djupare analys</h4>
                      <p className="text-sm text-slate-600 mb-4">Utforska detaljerade prognoser och tillväxtmöjligheter</p>
                    </div>
                    <DetailedAnalysisModal />
                  </div>
                </div>
                
                {/* Support info */}
                <div className="mt-10 pt-8 border-t border-slate-200/50">
                  <p className="text-sm text-slate-500">
                    Behöver du hjälp? <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Kontakta oss</a> eller 
                    läs vår <a href="/manual" className="text-blue-600 hover:text-blue-700 font-medium">användarmanual</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorLayout;
