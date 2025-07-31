import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LEASING_PACKAGES, PACKAGE_LOCK_WARNING } from '@/data/leasingPackages';

interface LeasingModelSelectorProps {
  selectedModel: 'hybridmodell' | 'strategimodell';
  onModelChange: (model: 'hybridmodell' | 'strategimodell') => void;
  currentSliderStep: number;
}

const LeasingModelSelector: React.FC<LeasingModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  currentSliderStep
}) => {
  // Förhindra scroll-hopp vid klick
  const handleModelChange = (model: 'hybridmodell' | 'strategimodell', event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onModelChange(model);
  };
  // Statiska paketrubriker - ska aldrig ändras dynamiskt
  const hybridmodellPackage = LEASING_PACKAGES.HYBRIDPAKET;
  const strategimodellPackage = LEASING_PACKAGES.ALLT_INKLUDERAT;

  return (
    <div className="space-y-4 mb-6">
      <div className="text-sm font-medium text-slate-900 mb-3">
        Välj leasingmodell
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Hybridmodell - Primär */}
        <div 
          className={`
            relative h-full flex flex-col
            ${selectedModel === 'hybridmodell' 
              ? 'border-2 border-emerald-400 bg-emerald-50 shadow-lg scale-[1.02]' 
              : 'border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
            } 
            rounded-xl p-4 transition-all cursor-pointer group
          `}
          onClick={(e) => handleModelChange('hybridmodell', e)}
        >
          {/* Vald badge i övre högra hörnet */}
          {selectedModel === 'hybridmodell' && (
            <div className="absolute -top-2 -right-2 z-10">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2 py-1 shadow-md">
                ✓ Vald
              </Badge>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <span className="text-lg">{hybridmodellPackage.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {hybridmodellPackage.primaryTitle}
              </h3>
              <h4 className="font-medium text-slate-700 text-sm">
                {hybridmodellPackage.name}
              </h4>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
            {hybridmodellPackage.description}
          </p>
          
          <ul className="space-y-2 mb-4 flex-grow">
            {hybridmodellPackage.benefits.map((benefit, index) => (
              <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                {benefit}
              </li>
            ))}
          </ul>
          
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-auto">
            <span className="font-semibold text-slate-700">Bäst för:</span> {hybridmodellPackage.bestFor}
          </div>
        </div>

        {/* Strategimodell */}
        <div 
          className={`
            relative h-full flex flex-col
            ${selectedModel === 'strategimodell' 
              ? 'border-2 border-blue-400 bg-blue-50 shadow-lg scale-[1.02]' 
              : 'border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
            } 
            rounded-xl p-4 transition-all cursor-pointer group
          `}
          onClick={(e) => handleModelChange('strategimodell', e)}
        >
          {/* Vald badge i övre högra hörnet */}
          {selectedModel === 'strategimodell' && (
            <div className="absolute -top-2 -right-2 z-10">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 shadow-md">
                ✓ Vald
              </Badge>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <span className="text-lg">{strategimodellPackage.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {strategimodellPackage.primaryTitle}
              </h3>
              <h4 className="font-medium text-slate-700 text-sm">
                {strategimodellPackage.name}
              </h4>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
            {strategimodellPackage.description}
          </p>
          
          <ul className="space-y-2 mb-4 flex-grow">
            {strategimodellPackage.benefits.map((benefit, index) => (
              <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                {benefit}
              </li>
            ))}
          </ul>
          
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-auto">
            <span className="font-semibold text-slate-600">Bäst för:</span> {strategimodellPackage.bestFor}
          </div>
        </div>
      </div>

      {/* Varning om att valet låses - flyttad till sist */}
      <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4">
        <span className="text-amber-600 text-sm">{PACKAGE_LOCK_WARNING.icon}</span>
        <div>
          <div className="font-medium text-amber-800 text-sm">
            {PACKAGE_LOCK_WARNING.title}
          </div>
          <div className="text-amber-700 text-xs mt-1">
            {PACKAGE_LOCK_WARNING.message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeasingModelSelector;