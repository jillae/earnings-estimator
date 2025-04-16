import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import CostDisplay from './lease-adjuster/CostDisplay';
import LeaseSlider from './lease-adjuster/LeaseSlider';
import { Info, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useCalculator } from '@/context/CalculatorContext';

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
  const { calculatedCreditPrice, selectedMachine } = useCalculator();
  
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

  const defaultCost = exactMinCost + (0.5 * costRange);
  
  const recommendedFactor = 0.5;
  
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
    
    console.log(`Slider flyttad till: ${newValue * 100}% (råvärde)`);
    
    if (Math.abs(newValue - 0.5) < 0.01) {
      newValue = 0.5;
      console.log("Justerar till exakt 0.5 (50%)");
    }
    
    const exactCost = exactMinCost + (newValue * costRange);
    
    let roundedCost = Math.round(exactCost / stepSize) * stepSize;
    const lastDigit = roundedCost % 10;
    if (lastDigit !== 6) {
      roundedCost = roundedCost - lastDigit + 6;
    }
    
    console.log(`Beräknad leasingkostnad:
      Slider position: ${newValue * 100}%
      Exakt kostnad: ${exactCost}
      Avrundad kostnad: ${roundedCost}
    `);
    
    if (flatrateThreshold && roundedCost < flatrateThreshold && onAllowBelowFlatrateChange) {
      onAllowBelowFlatrateChange(false);
    }
    
    onAdjustmentChange(newValue);
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

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-center text-sm bg-blue-50 p-2 rounded-md">
          <Info className="w-4 h-4 mr-2 text-blue-600" />
          <span>Rekommenderat pris: <span className="font-medium">{Math.round(defaultCost).toLocaleString('sv-SE')} kr</span></span>
        </div>
        
        {selectedMachine?.usesCredits && (
          <div className="flex items-center justify-center text-sm bg-green-50 p-2 rounded-md">
            <CreditCard className="w-4 h-4 mr-2 text-green-600" />
            <span>Krediter per behandling: <span className="font-medium">{formatCurrency(calculatedCreditPrice)} kr/credit</span></span>
          </div>
        )}
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
