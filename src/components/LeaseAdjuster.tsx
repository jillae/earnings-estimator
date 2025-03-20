
import React, { useEffect } from 'react';
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
  treatmentsPerDay?: number;
  onAdjustmentChange: (value: number) => void;
}

const LeaseAdjuster: React.FC<LeaseAdjusterProps> = ({
  minLeaseCost,
  maxLeaseCost,
  leaseCost,
  adjustmentFactor,
  flatrateThreshold,
  showFlatrateIndicator = false,
  treatmentsPerDay = 0,
  onAdjustmentChange
}) => {
  console.log("LeaseAdjuster rendering with:", {
    minLeaseCost,
    maxLeaseCost,
    leaseCost,
    adjustmentFactor,
    flatrateThreshold,
    showFlatrateIndicator,
    treatmentsPerDay
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
  
  const handleSliderChange = (values: number[]) => {
    onAdjustmentChange(values[0]);
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
    `);
  }, [adjustmentFactor, exactMinCost, exactMaxCost, costRange, leaseCost, calculatedLeasingCost]);

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
  if (showFlatrateIndicator && flatrateThreshold) {
    // Beräkna tröskelpositionen som procent av slidersträckan
    thresholdPosition = ((flatrateThreshold - exactMinCost) / Math.max(0.001, exactMaxCost - exactMinCost)) * 100;
    // Säkerställ att positionen är begränsad mellan 0 och 100
    thresholdPosition = Math.max(0, Math.min(100, thresholdPosition));
    console.log(`Flatrate threshold position: ${thresholdPosition}% (${flatrateThreshold} / ${exactMinCost} / ${exactMaxCost})`);
  }

  // Kontrollera och logga om vi är över flatrate-tröskeln
  const isAboveFlatrateThreshold = flatrateThreshold ? leaseCost >= flatrateThreshold : false;
  
  // Visa flatrate-info om vi är över tröskeln och visar flatrate-indikatorn
  const shouldShowFlatrateInfo = showFlatrateIndicator && isAboveFlatrateThreshold;
  
  useEffect(() => {
    console.log(`FLATRATE INFO SYNLIGHET: 
      Leasingkostnad (${leaseCost}) ${isAboveFlatrateThreshold ? '>=' : '<'} Tröskelvärde (${flatrateThreshold})
      Antal behandlingar per dag: ${treatmentsPerDay}
      Visar info: ${shouldShowFlatrateInfo}
    `);
  }, [leaseCost, flatrateThreshold, isAboveFlatrateThreshold, showFlatrateIndicator, treatmentsPerDay, shouldShowFlatrateInfo]);

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

      {/* Visa flatrate-informationsrutan när vi är över tröskeln */}
      {shouldShowFlatrateInfo && (
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
