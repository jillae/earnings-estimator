
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FlatrateToggleProps {
  showFlatrateIndicator: boolean;
  flatrateThreshold: number;
  useFlatrateOption: 'perCredit' | 'flatrate';
  onToggleFlatrate: (option: 'perCredit' | 'flatrate') => void;
  leasingCostPercentage: number;
  allowBelowFlatrate: boolean;
}

const FlatrateToggle: React.FC<FlatrateToggleProps> = ({
  showFlatrateIndicator,
  flatrateThreshold,
  useFlatrateOption,
  onToggleFlatrate,
  leasingCostPercentage,
  allowBelowFlatrate
}) => {
  const isFlatrateUnlocked = leasingCostPercentage >= 80;

  if (!showFlatrateIndicator) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="flatrate-switch" 
            checked={useFlatrateOption === 'flatrate'}
            onCheckedChange={(checked) => onToggleFlatrate(checked ? 'flatrate' : 'perCredit')}
            disabled={!isFlatrateUnlocked}
          />
          <Label 
            htmlFor="flatrate-switch"
            className="text-sm cursor-pointer"
          >
            Aktivera flatrate för credits
          </Label>
        </div>
        <span className={`text-xs ${useFlatrateOption === 'flatrate' ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
          {useFlatrateOption === 'flatrate' ? 'Flatrate aktiverat' : 'Styckepris'}
        </span>
      </div>

      {!isFlatrateUnlocked && (
        <div className="text-xs text-amber-600 mt-1">
          Flatrate blir tillgängligt när leasingkostnaden når 80% av maximal kostnad.
        </div>
      )}
    </div>
  );
};

export default FlatrateToggle;
