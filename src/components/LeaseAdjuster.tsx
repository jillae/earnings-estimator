import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import CostDisplay from './lease-adjuster/CostDisplay';
import LeaseSlider from './lease-adjuster/LeaseSlider';
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
  
  console.log("LeaseAdjuster rendering with:", {
    minLeaseCost,
    maxLeaseCost,
    leaseCost,
    adjustmentFactor,
    flatrateThreshold,
    showFlatrateIndicator,
    treatmentsPerDay,
    allowBelowFlatrate
  });

  const exactMinCost = minLeaseCost;
  const exactMaxCost = maxLeaseCost;
  const costRange = exactMaxCost - exactMinCost;

  // Beräknar det rekommenderade priset vid 50% av leasingområdet
  const defaultCost = exactMinCost + (0.5 * costRange);
  
  // Beräknar faktorn för att placera slidern vid rekommenderat pris
  const recommendedFactor = (defaultCost - exactMinCost) / Math.max(0.001, costRange);
  
  const calculatedLeasingCost = exactMinCost + (recommendedFactor * costRange);
  
  const stepSize = 100;
  let roundedLeasingCost = Math.round(calculatedLeasingCost / stepSize) * stepSize;
  
  const lastDigit = roundedLeasingCost % 10;
  if (lastDigit !== 6) {
    roundedLeasingCost = roundedLeasingCost - lastDigit + 6;
  }
  
  let flatratePosition = null;
  if (flatrateThreshold) {
    flatratePosition = ((flatrateThreshold - exactMinCost) / Math.max(0.001, costRange)) * 100;
    flatratePosition = Math.max(0, Math.min(100, flatratePosition));
  }
  
  const handleSliderChange = (values: number[]) => {
    let newValue = values[0] / 100;
    
    const exactCost = exactMinCost + (newValue * costRange);
    
    let roundedCost = Math.round(exactCost / stepSize) * stepSize;
    const lastDigit = roundedCost % 10;
    if (lastDigit !== 6) {
      roundedCost = roundedCost - lastDigit + 6;
    }
    
    const newFactor = (roundedCost - exactMinCost) / Math.max(0.001, costRange);
    const clampedFactor = Math.max(0, Math.min(1, newFactor));
    
    if (flatrateThreshold && roundedCost < flatrateThreshold && onAllowBelowFlatrateChange) {
      onAllowBelowFlatrateChange(false);
    }
    
    onAdjustmentChange(clampedFactor);
  };

  let actualLeasingCost = leaseCost;
  if (leaseCost > exactMaxCost) {
    actualLeasingCost = exactMaxCost;
  } else if (leaseCost < exactMinCost) {
    actualLeasingCost = exactMinCost;
  }

  const isAboveFlatrateThreshold = flatrateThreshold ? leaseCost >= flatrateThreshold : false;
  
  useEffect(() => {
    console.log(`FLATRATE INFO:
      Leasingkostnad (${leaseCost}) ${isAboveFlatrateThreshold ? '>=' : '<'} Tröskelvärde (${flatrateThreshold})
      Antal behandlingar per dag: ${treatmentsPerDay}
      AllowBelowFlatrate: ${allowBelowFlatrate}
    `);
  }, [leaseCost, flatrateThreshold, isAboveFlatrateThreshold, showFlatrateIndicator, treatmentsPerDay, allowBelowFlatrate]);

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="input-label">
        Justera leasingkostnad
      </label>

      <CostDisplay 
        minLeaseCost={exactMinCost}
        maxLeaseCost={exactMaxCost}
        leaseCost={actualLeasingCost}
      />

      <div className="flex items-center justify-center mb-2 text-sm bg-blue-50 p-2 rounded-md">
        <Info className="w-4 h-4 mr-2 text-blue-600" />
        <span>Rekommenderat pris: <span className="font-medium">{defaultCost.toLocaleString('sv-SE')} kr</span></span>
      </div>

      <LeaseSlider 
        adjustmentFactor={recommendedFactor * 100}
        onSliderChange={handleSliderChange}
        thresholdPosition={flatratePosition}
        showFlatrateIndicator={showFlatrateIndicator}
        allowBelowFlatrate={allowBelowFlatrate}
      />
    </div>
  );
};

export default LeaseAdjuster;
