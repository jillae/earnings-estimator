
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import CostDisplay from './lease-adjuster/CostDisplay';
import LeaseSlider from './lease-adjuster/LeaseSlider';

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
  allowBelowFlatrate = true
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

  const oldMaxCost = (exactMinCost + exactMaxCost) / 2;
  
  const calculatedLeasingCost = exactMinCost + (adjustmentFactor * costRange);
  
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
  
  useEffect(() => {
    const isAtDefaultPosition = Math.abs(adjustmentFactor - 0.5) < 0.01;
    if (isAtDefaultPosition) {
      toast({
        title: "Rekommenderat pris",
        description: "Detta är listpriset för maskinen",
      });
    }
  }, [adjustmentFactor, toast]);

  const handleSliderChange = (values: number[]) => {
    let newValue = values[0] / 100;
    
    // Om flatrate är aktivt (showFlatrateIndicator) och inte tillåter under 80%, begränsa till minst 0.8
    if (showFlatrateIndicator && !allowBelowFlatrate) {
      newValue = Math.max(0.8, newValue);
    }
    
    const exactCost = exactMinCost + (newValue * costRange);
    
    let roundedCost = Math.round(exactCost / stepSize) * stepSize;
    const lastDigit = roundedCost % 10;
    if (lastDigit !== 6) {
      roundedCost = roundedCost - lastDigit + 6;
    }
    
    const newFactor = (roundedCost - exactMinCost) / Math.max(0.001, costRange);
    
    const clampedFactor = Math.max(0, Math.min(1, newFactor));
    
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
    console.log(`FLATRATE INFO SYNLIGHET: 
      Leasingkostnad (${leaseCost}) ${isAboveFlatrateThreshold ? '>=' : '<'} Tröskelvärde (${flatrateThreshold})
      Gamla Max (mittpunkt): ${oldMaxCost}
      Antal behandlingar per dag: ${treatmentsPerDay}
      AllowBelowFlatrate: ${allowBelowFlatrate}
    `);
  }, [leaseCost, flatrateThreshold, oldMaxCost, isAboveFlatrateThreshold, showFlatrateIndicator, treatmentsPerDay, allowBelowFlatrate]);

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

      <LeaseSlider 
        adjustmentFactor={adjustmentFactor * 100}
        onSliderChange={handleSliderChange}
        thresholdPosition={flatratePosition}
        showFlatrateIndicator={showFlatrateIndicator}
        allowBelowFlatrate={allowBelowFlatrate}
      />
    </div>
  );
};

export default LeaseAdjuster;
