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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grundleasing + Credits */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            selectedModel === 'grundleasing' 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:bg-slate-50'
          }`}
          onClick={() => onModelChange('grundleasing')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{grundleasingPackage.icon}</span>
                <h3 className="font-semibold text-slate-900">
                  {grundleasingPackage.name}
                </h3>
              </div>
              {selectedModel === 'grundleasing' && (
                <Badge variant="default" className="text-xs">Vald</Badge>
              )}
            </div>
            
            <p className="text-sm text-slate-600 mb-3">
              {grundleasingPackage.description}
            </p>
            
            <div className="space-y-1">
              {grundleasingPackage.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  {benefit}
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-slate-500">
              <strong>Bäst för:</strong> {grundleasingPackage.bestFor}
            </div>
          </CardContent>
        </Card>

        {/* Strategisk Leasing (Credits ingår) - De-promoterad */}
        <Card 
          className={`cursor-pointer transition-all duration-200 opacity-75 ${
            selectedModel === 'strategisk' 
              ? 'ring-2 ring-slate-400 bg-slate-50' 
              : 'hover:bg-slate-50 border-slate-300'
          }`}
          onClick={() => onModelChange('strategisk')}
        >
          <CardContent className="p-4 opacity-75">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{strategiskPackage.icon}</span>
                <h3 className="font-semibold text-slate-700">
                  {strategiskPackage.name}
                </h3>
                
              </div>
              {selectedModel === 'strategisk' && (
                <Badge variant="secondary" className="text-xs">Vald</Badge>
              )}
            </div>
            
            <p className="text-sm text-slate-500 mb-3">
              {strategiskPackage.description}
            </p>
            
            <div className="space-y-1">
              {strategiskPackage.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  {benefit}
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-slate-400">
              <strong>Bäst för:</strong> {strategiskPackage.bestFor}
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