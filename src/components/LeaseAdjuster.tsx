
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import CostDisplay from './lease-adjuster/CostDisplay';
import LeaseSlider from './lease-adjuster/LeaseSlider';
import InfoTooltip from './ui/info-tooltip';
import { Info } from 'lucide-react';

interface LeaseAdjusterProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
  adjustmentFactor: number;
  flatrateThreshold?: number;
  showFlatrateIndicator?: boolean;
  treatmentsPerDay?: number;
  onAdjustmentChange: (value: number) => void;
  allowBelowFlatrate?: boolean;
  onAllowBelowFlatrateChange?: (allow: boolean) => void;
}

const LeaseAdjuster: React.FC<LeaseAdjusterProps> = ({
  minLeaseCost,
  maxLeaseCost,
  leaseCost,
  adjustmentFactor,
  flatrateThreshold,
  showFlatrateIndicator = false,
  treatmentsPerDay = 0,
  onAdjustmentChange,
  allowBelowFlatrate = true,
  onAllowBelowFlatrateChange
}) => {
  const { toast } = useToast();
  const exactMinCost = minLeaseCost;
  const exactMaxCost = maxLeaseCost;
  const costRange = exactMaxCost - exactMinCost;
  const recommendedCost = exactMinCost + (0.5 * costRange);
  
  useEffect(() => {
    // När slidern går under 80% mellan min och originalMax (som är mittpunkten)
    const oldMaxCost = (exactMinCost + exactMaxCost) / 2;
    const threshold = exactMinCost + (oldMaxCost - exactMinCost) * 0.8;
    
    if (leaseCost < threshold && !allowBelowFlatrate) {
      onAllowBelowFlatrateChange?.(true);
    }
  }, [leaseCost, exactMinCost, exactMaxCost, allowBelowFlatrate, onAllowBelowFlatrateChange]);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0] / 100;
    const exactCost = exactMinCost + (newValue * costRange);
    let roundedCost = Math.round(exactCost / 100) * 100;
    const lastDigit = roundedCost % 10;
    if (lastDigit !== 6) {
      roundedCost = roundedCost - lastDigit + 6;
    }
    
    const newFactor = (roundedCost - exactMinCost) / Math.max(0.001, costRange);
    const clampedFactor = Math.max(0, Math.min(1, newFactor));
    onAdjustmentChange(clampedFactor);
  };

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-2">
        <label className="input-label flex items-center gap-2">
          Justera leasingkostnad
          <InfoTooltip 
            content="Leasingkostnaden påverkar kreditpriset omvänt för att balansera totalkostnaden. Alla priser avrundas till närmaste hundratal som slutar på 6." 
          />
        </label>
      </div>

      <CostDisplay 
        minLeaseCost={exactMinCost}
        maxLeaseCost={exactMaxCost}
        leaseCost={leaseCost}
      />

      <div className="flex items-center justify-between mb-4 py-2 px-3 bg-blue-50 rounded-md">
        <span className="text-sm text-blue-700">Rekommenderat pris: </span>
        <span className="font-medium text-blue-700">{recommendedCost.toLocaleString('sv-SE')} kr</span>
      </div>

      <LeaseSlider 
        adjustmentFactor={adjustmentFactor * 100}
        onSliderChange={handleSliderChange}
        thresholdPosition={null}
        showFlatrateIndicator={showFlatrateIndicator}
        allowBelowFlatrate={allowBelowFlatrate}
      />
    </div>
  );
};

export default LeaseAdjuster;
