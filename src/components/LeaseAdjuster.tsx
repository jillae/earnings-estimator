
import React, { useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from '@/utils/calculatorUtils';
import { Info } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

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
  allowBelowFlatrate = false,
  onAllowBelowFlatrateChange
}) => {
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

  // Använd de exakta min- och max-värdena direkt från props
  const exactMinCost = minLeaseCost;
  const exactMaxCost = maxLeaseCost;
  const costRange = exactMaxCost - exactMinCost;

  // Beräkna stegstorlek baserat på ett rimligt antal steg över hela intervallet
  const totalSteps = 100; // Vi vill ha 100 steg från min till max
  const sliderStep = 1 / totalSteps; // Fast steg på 1/100 av sliderns skala

  // Beräkna exakt leasingkostnad för den aktuella faktorn
  const calculatedLeasingCost = exactMinCost + (adjustmentFactor * costRange);
  
  // Beräkna flatrate-faktorn (position) om vi har ett tröskelvärde
  let flatratePosition = 0;
  if (flatrateThreshold) {
    flatratePosition = (flatrateThreshold - exactMinCost) / Math.max(0.001, costRange);
    flatratePosition = Math.max(0, Math.min(1, flatratePosition));
  }
  
  const handleSliderChange = (values: number[]) => {
    // Om under-80%-läge inte är tillåtet, begränsa slider till flatratePosition
    let newValue = values[0];
    
    if (!allowBelowFlatrate && flatrateThreshold && newValue < flatratePosition) {
      newValue = flatratePosition;
    }
    
    onAdjustmentChange(newValue);
  };

  // Omfattande diagnostikloggning för att felsöka sliderbeteendet
  useEffect(() => {
    console.log(`Slider diagnostik: 
      - Faktor: ${adjustmentFactor}
      - Min: ${exactMinCost}
      - Max: ${exactMaxCost}
      - Range: ${costRange}
      - Beräknad kostnad vid faktor ${adjustmentFactor}: ${calculatedLeasingCost}
      - Aktuell kostnad: ${leaseCost}
      - Flatrate position: ${flatratePosition}
      - Allow below flatrate: ${allowBelowFlatrate}
    `);
  }, [adjustmentFactor, exactMinCost, exactMaxCost, costRange, leaseCost, calculatedLeasingCost, flatratePosition, allowBelowFlatrate]);

  // Säkerställ att leasingCost är inom intervallet
  let actualLeasingCost = leaseCost;
  if (leaseCost > exactMaxCost) {
    actualLeasingCost = exactMaxCost;
  } else if (leaseCost < exactMinCost) {
    actualLeasingCost = exactMinCost;
  }

  // Använd formaterade värden utan avrundning för konsekvent visning
  const formattedMinCost = formatCurrency(exactMinCost, false);
  const formattedMaxCost = formatCurrency(exactMaxCost, false);
  const formattedCost = formatCurrency(actualLeasingCost, false);

  // Beräkna flatrate-tröskelpositionen som procent om relevant
  let thresholdPosition = null;
  if (showFlatrateIndicator && flatrateThreshold && !allowBelowFlatrate) {
    // Beräkna tröskelpositionen som procent av slidersträckan
    thresholdPosition = ((flatrateThreshold - exactMinCost) / Math.max(0.001, exactMaxCost - exactMinCost)) * 100;
    // Säkerställ att positionen är begränsad mellan 0 och 100
    thresholdPosition = Math.max(0, Math.min(100, thresholdPosition));
    console.log(`Flatrate threshold position: ${thresholdPosition}% (${flatrateThreshold} / ${exactMinCost} / ${exactMaxCost})`);
  }

  // Kontrollera och logga om vi är över flatrate-tröskeln
  const isAboveFlatrateThreshold = flatrateThreshold ? leaseCost >= flatrateThreshold : false;
  
  // Visa flatrate-info om vi är över tröskeln, visar flatrate-indikatorn, och allowBelowFlatrate är false (alltså flatrate är aktiverat)
  const shouldShowFlatrateInfo = showFlatrateIndicator && isAboveFlatrateThreshold && !allowBelowFlatrate;
  
  useEffect(() => {
    console.log(`FLATRATE INFO SYNLIGHET: 
      Leasingkostnad (${leaseCost}) ${isAboveFlatrateThreshold ? '>=' : '<'} Tröskelvärde (${flatrateThreshold})
      Antal behandlingar per dag: ${treatmentsPerDay}
      Visar info: ${shouldShowFlatrateInfo}
      AllowBelowFlatrate: ${allowBelowFlatrate}
    `);
  }, [leaseCost, flatrateThreshold, isAboveFlatrateThreshold, showFlatrateIndicator, treatmentsPerDay, shouldShowFlatrateInfo, allowBelowFlatrate]);

  // Hantera växling av flatrate-läge
  const handleToggleFlatrate = () => {
    if (onAllowBelowFlatrateChange) {
      const newValue = !allowBelowFlatrate;
      console.log(`Ändrar allowBelowFlatrate till: ${newValue}`);
      
      // Om vi aktiverar flatrate-läget (allowBelowFlatrate = false) och nuvarande faktorn är under flatratePosition,
      // uppdatera faktorn till flatratePosition
      if (!newValue && adjustmentFactor < flatratePosition) {
        onAdjustmentChange(flatratePosition);
      }
      
      onAllowBelowFlatrateChange(newValue);
    }
  };

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
              {!allowBelowFlatrate ? '80% flatrate gräns' : '80%'}
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

      {showFlatrateIndicator && flatrateThreshold && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              id="allow-below-flatrate" 
              checked={!allowBelowFlatrate}
              onCheckedChange={handleToggleFlatrate}
            />
            <label 
              htmlFor="allow-below-flatrate"
              className="text-sm cursor-pointer"
            >
              Aktivera flatrate för credits
            </label>
          </div>
          <span className={`text-xs ${allowBelowFlatrate ? 'text-yellow-600' : 'text-green-600'}`}>
            {allowBelowFlatrate ? 'Flatrate inaktiverat' : 'Flatrate aktiverat'}
          </span>
        </div>
      )}
    </div>
  );
};

export default LeaseAdjuster;
