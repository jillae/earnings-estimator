
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FlatrateToggleProps {
  showFlatrateIndicator: boolean;
  flatrateThreshold?: number;
  useFlatrateOption: 'perCredit' | 'flatrate';
  onToggleFlatrate: (value: 'perCredit' | 'flatrate') => void;
  leasingCostPercentage: number;
  allowBelowFlatrate?: boolean; // Lägger till denna egenskap för att matcha props i LeaseAdjuster
}

const FlatrateToggle: React.FC<FlatrateToggleProps> = ({
  showFlatrateIndicator,
  flatrateThreshold,
  useFlatrateOption,
  onToggleFlatrate,
  leasingCostPercentage,
  allowBelowFlatrate
}) => {
  if (!showFlatrateIndicator || !flatrateThreshold) {
    return null;
  }

  // Flatrate är endast tillgänglig när leasingkostnaden är minst 80%
  const isFlatrateUnlocked = leasingCostPercentage >= 80;

  return (
    <div className="mt-4 flex items-center justify-between">
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
      <span className={`text-xs ${useFlatrateOption === 'perCredit' ? 'text-yellow-600' : 'text-green-600'} font-medium`}>
        {useFlatrateOption === 'perCredit' ? 'Styckepris' : 'Flatrate aktiverat'}
      </span>
    </div>
  );
};

export default FlatrateToggle;
