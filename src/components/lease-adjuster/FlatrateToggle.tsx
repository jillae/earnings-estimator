
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FlatrateToggleProps {
  showFlatrateIndicator: boolean;
  flatrateThreshold: number;
  useFlatrateOption: 'perCredit' | 'flatrate';
  onToggleFlatrate: (value: 'perCredit' | 'flatrate') => void;
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
  if (!showFlatrateIndicator) {
    return null;
  }

  const isUnlocked = leasingCostPercentage >= 80;

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-2 mb-2">
        <Label htmlFor="flatrate-switch-lease" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Använd Flatrate
        </Label>
        <Switch
          id="flatrate-switch-lease"
          checked={useFlatrateOption === 'flatrate'}
          onCheckedChange={(checked) => onToggleFlatrate(checked ? 'flatrate' : 'perCredit')}
          disabled={!isUnlocked}
        />
      </div>
      
      {!isUnlocked && (
        <p className="text-xs text-red-500 mb-2">
          Flatrate blir tillgängligt när leasingkostnaden når 80% eller mer.
        </p>
      )}
    </div>
  );
};

export default FlatrateToggle;
