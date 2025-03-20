
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FlatrateToggleProps {
  showFlatrateIndicator: boolean;
  flatrateThreshold?: number;
  allowBelowFlatrate: boolean;
  onToggleFlatrate: () => void;
}

const FlatrateToggle: React.FC<FlatrateToggleProps> = ({
  showFlatrateIndicator,
  flatrateThreshold,
  allowBelowFlatrate,
  onToggleFlatrate
}) => {
  if (!showFlatrateIndicator || !flatrateThreshold) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Switch 
          id="allow-below-flatrate" 
          checked={!allowBelowFlatrate}
          onCheckedChange={onToggleFlatrate}
        />
        <Label 
          htmlFor="allow-below-flatrate"
          className="text-sm cursor-pointer"
        >
          Aktivera flatrate för credits
        </Label>
      </div>
      <span className={`text-xs ${allowBelowFlatrate ? 'text-yellow-600' : 'text-green-600'} font-medium`}>
        {allowBelowFlatrate ? 'Flatrate inaktiverat' : 'Flatrate aktiverat'}
      </span>
    </div>
  );
};

export default FlatrateToggle;
