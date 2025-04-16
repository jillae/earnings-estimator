
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
  const defaultCost = exactMinCost + (0.5 * costRange); // 50% av vägen - rekommenderat pris
  
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
  
  const handleSliderChange = (values: number[]) => {
    let newValue = values[0] / 100;
    
    // Låt slidern röra sig fritt oavsett om vi är över eller under flatrate-tröskeln
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
      <div className="flex items-center justify-between mb-2">
        <label className="input-label flex items-center gap-2">
          Justera leasingkostnad
          <InfoTooltip 
            content="Leasingkostnaden påverkar kreditpriset omvänt för att balansera totalkostnaden. Alla priser avrundas till närmaste hundrating som slutar på 6." 
          />
        </label>
      </div>

      <CostDisplay 
        minLeaseCost={exactMinCost}
        maxLeaseCost={exactMaxCost}
        leaseCost={actualLeasingCost}
      />

      <div className="flex items-center justify-between mb-4 py-2 px-3 bg-blue-50 rounded-md">
        <span className="text-sm text-blue-700">Rekommenderat pris: </span>
        <span className="font-medium text-blue-700">{defaultCost.toLocaleString('sv-SE')} kr</span>
      </div>

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
