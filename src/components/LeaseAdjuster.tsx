
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from '@/utils/calculatorUtils';
import { Info } from 'lucide-react';

interface LeaseAdjusterProps {
  minLeaseCost: number;
  maxLeaseCost: number;
  leaseCost: number;
  adjustmentFactor: number;
  flatrateThreshold?: number;
  showFlatrateIndicator?: boolean;
  onAdjustmentChange: (value: number) => void;
}

const LeaseAdjuster: React.FC<LeaseAdjusterProps> = ({
  minLeaseCost,
  maxLeaseCost,
  leaseCost,
  adjustmentFactor,
  flatrateThreshold,
  showFlatrateIndicator = false,
  onAdjustmentChange
}) => {
  console.log("LeaseAdjuster rendering with:", {
    minLeaseCost,
    maxLeaseCost,
    leaseCost,
    adjustmentFactor,
    flatrateThreshold,
    showFlatrateIndicator
  });

  // Use exact min and max costs directly from props without modification
  const exactMinCost = minLeaseCost;
  const exactMaxCost = maxLeaseCost;

  // Calculate the step size for the slider based on 500 SEK
  const stepSizeSek = 500;
  const costRange = exactMaxCost - exactMinCost;
  const sliderStep = costRange > 0 ? stepSizeSek / costRange : 0.01; // Fallback if range is zero

  const handleSliderChange = (values: number[]) => {
    onAdjustmentChange(values[0]);
  };

  // Use the exact max/min leasing cost values for calculation
  // This ensures we don't exceed the defined range
  let actualLeasingCost = leaseCost;
  if (leaseCost > exactMaxCost) {
    // Cap at max
    actualLeasingCost = exactMaxCost;
  } else if (leaseCost < exactMinCost) {
    actualLeasingCost = exactMinCost;
  }

  // Use formatted values without rounding for display consistency
  const formattedMinCost = formatCurrency(exactMinCost, false);
  const formattedMaxCost = formatCurrency(exactMaxCost, false);
  const formattedCost = formatCurrency(actualLeasingCost, false);

  // Calculate flatrate threshold position as percentage if applicable
  let thresholdPosition = null;
  if (showFlatrateIndicator && flatrateThreshold) {
    // Ensure threshold is within the valid range for the slider
    const normalizedThreshold = Math.max(exactMinCost, Math.min(exactMaxCost, flatrateThreshold));
    
    // Calculate threshold position as percentage of the slider range
    thresholdPosition = ((normalizedThreshold - exactMinCost) / Math.max(0.001, costRange)) * 100;
    console.log(`Flatrate threshold position: ${thresholdPosition}% (${normalizedThreshold} / ${exactMinCost} / ${exactMaxCost})`);
  }

  return (
    <div className="input-group animate-slide-in" style={{ animationDelay: '300ms' }}>
      <label className="input-label">
        Justera leasingkostnad
      </label>

      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-500">Min: {formattedMinCost}</span>
        <span className="text-xs text-slate-500">Max: {formattedMaxCost}</span>
      </div>

      <div className="slider-container relative mb-6">
        {showFlatrateIndicator && thresholdPosition !== null && (
          <div className="flatrate-indicator">
            <div 
              className="absolute h-8 border-l-2 border-primary z-10 top-4" 
              style={{ left: `${thresholdPosition}%` }}
            />
            <div 
              className="absolute text-xs text-primary font-medium top-0"
              style={{ 
                left: `${thresholdPosition > 70 ? thresholdPosition - 50 : thresholdPosition}%`, 
                maxWidth: '50%',
                whiteSpace: 'nowrap'
              }}
            >
              80% flatrate gräns
            </div>
          </div>
        )}
        
        <Slider
          id="leasingCostSlider"
          value={[adjustmentFactor]}
          min={0}
          max={1}
          step={sliderStep}
          onValueChange={handleSliderChange}
          className="mt-8"
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Leasingkostnad per månad (ex moms)</span>
        <span className="text-lg font-semibold text-slate-700">{formattedCost}</span>
      </div>

      {showFlatrateIndicator && (
        <div 
          id="flatrateInfo" 
          className="mt-5 p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm"
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-base mb-2">Information om Flatrate</h3>
              <p className="mb-2">Vid en leasingkostnad som motsvarar minst 80% av den ordinarie investeringskostnaden (vårt maximala leasingpris) erbjuds <strong>Flatrate för credits</strong>.</p>
              <p className="mb-2">Med Flatrate kan kliniken beställa ett obegränsat antal credits under avtalsperioden.</p>
              <p>Detta baseras på en förväntad minimibeläggning om 2 kunder per veckodag.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseAdjuster;
