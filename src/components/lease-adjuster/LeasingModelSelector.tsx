import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LEASING_PACKAGES, PACKAGE_LOCK_WARNING } from '@/data/leasingPackages';

interface LeasingModelSelectorProps {
  selectedModel: 'grundleasing' | 'strategisk';
  onModelChange: (model: 'grundleasing' | 'strategisk') => void;
  currentSliderStep: number;
}

const LeasingModelSelector: React.FC<LeasingModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  currentSliderStep
}) => {
  // Statiska paketrubriker - ska aldrig ändras dynamiskt
  const grundleasingPackage = LEASING_PACKAGES.HYBRIDPAKET;
  const strategiskPackage = LEASING_PACKAGES.ALLT_INKLUDERAT;

  return (
    <div className="space-y-4 mb-6">
      <div className="text-sm font-medium text-slate-900 mb-3">
        Välj leasingmodell
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hybridpaket - Primär */}
        <Card 
          className={`cursor-pointer transition-all duration-300 h-full border-2 ${
            selectedModel === 'grundleasing' 
              ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-lg' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
          }`}
          onClick={() => onModelChange('grundleasing')}
        >
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{grundleasingPackage.icon}</span>
                <h3 className="text-xl font-bold text-slate-900">
                  {grundleasingPackage.name}
                </h3>
              </div>
              {selectedModel === 'grundleasing' && (
                <Badge variant="default" className="text-sm font-semibold px-3 py-1">
                  Vald
                </Badge>
              )}
            </div>
            
            <p className="text-base text-slate-700 mb-4 leading-relaxed">
              {grundleasingPackage.description}
            </p>
            
            <div className="space-y-2 mb-4 flex-grow">
              {grundleasingPackage.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-3 border-t border-slate-100">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Bäst för:</span> {grundleasingPackage.bestFor}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allt-inkluderat - Sekundär */}
        <Card 
          className={`cursor-pointer transition-all duration-300 h-full border-2 ${
            selectedModel === 'strategisk' 
              ? 'ring-2 ring-slate-400 border-slate-400 bg-slate-50 shadow-lg' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-md opacity-75'
          }`}
          onClick={() => onModelChange('strategisk')}
        >
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{strategiskPackage.icon}</span>
                <h3 className="text-xl font-bold text-slate-700">
                  {strategiskPackage.name}
                </h3>
              </div>
              {selectedModel === 'strategisk' && (
                <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
                  Vald
                </Badge>
              )}
            </div>
            
            <p className="text-base text-slate-600 mb-4 leading-relaxed">
              {strategiskPackage.description}
            </p>
            
            <div className="space-y-2 mb-4 flex-grow">
              {strategiskPackage.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-slate-400 rounded-full flex-shrink-0"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-3 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                <span className="font-semibold text-slate-600">Bäst för:</span> {strategiskPackage.bestFor}
              </div>
            </div>
          </CardContent>
        </Card>
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