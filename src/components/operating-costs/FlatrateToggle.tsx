
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface FlatrateToggleProps {
  useFlatrateOption: string;
  handleFlatrateChange: (checked: boolean) => void;
  canEnableFlatrate: boolean;
  paymentOption: string;
  selectedDriftpaket?: string;
}

const FlatrateToggle: React.FC<FlatrateToggleProps> = ({
  useFlatrateOption,
  handleFlatrateChange,
  canEnableFlatrate,
  paymentOption,
  selectedDriftpaket = 'Bas'
}) => {
  
  // Om Silver/Guld-paket, visa förklaringstext istället för toggle
  if (selectedDriftpaket === 'Silver' || selectedDriftpaket === 'Guld') {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <span className="text-sm font-medium text-blue-800">
          Flatrate-credits är automatiskt aktiverat för {selectedDriftpaket}-paketet
        </span>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="flatrate-switch"
            checked={useFlatrateOption === 'flatrate'}
            onCheckedChange={handleFlatrateChange}
            disabled={!canEnableFlatrate}
          />
          <Label htmlFor="flatrate-switch" className="text-sm font-medium">
            Använd Flatrate
          </Label>
        </div>
        <span className="text-sm text-gray-500">
          {useFlatrateOption === 'flatrate' ? 'Flatrate' : 'Per Credit'}
        </span>
      </div>

      {!canEnableFlatrate && useFlatrateOption !== 'flatrate' && paymentOption === 'leasing' && (
        <div className="flex items-center gap-2 p-2 mb-4 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Leasingpaketet behöver vara Standard eller högre för att aktivera Flatrate
          </span>
        </div>
      )}
    </>
  );
};

export default FlatrateToggle;
