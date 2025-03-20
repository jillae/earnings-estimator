import React, { useEffect } from 'react';
import CostDisplay from './lease-adjuster/CostDisplay';
import LeaseSlider from './lease-adjuster/LeaseSlider';
import FlatrateToggle from './lease-adjuster/FlatrateToggle';

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

  // Beräkna exakt leasingkostnad för den aktuella faktorn
  const calculatedLeasingCost = exactMinCost + (adjustmentFactor * costRange);
  
  // Avrunda leasingkostnaden till närmaste 100 SEK
  const stepSize = 100;
  const roundedLeasingCost = Math.round(calculatedLeasingCost / stepSize) * stepSize;
  
  // Beräkna flatrate-faktorn (position) om vi har ett tröskelvärde
  let flatratePosition = null;
  if (flatrateThreshold) {
    flatratePosition = (flatrateThreshold - exactMinCost) / Math.max(0.001, costRange);
    flatratePosition = Math.max(0, Math.min(1, flatratePosition)) * 100; // Konvertera till procent
  }
  
  const handleSliderChange = (values: number[]) => {
    // Om under-80%-läge inte är tillåtet, begränsa slider till flatratePosition
    let newValue = values[0];
    
    if (!allowBelowFlatrate && flatrateThreshold && flatratePosition !== null && newValue < flatratePosition / 100) {
      newValue = flatratePosition / 100;
    }
    
    // Beräkna exakt kostnad baserat på positionen
    const exactCost = exactMinCost + (newValue * costRange);
    
    // Avrunda till närmaste 100 SEK
    const roundedCost = Math.round(exactCost / stepSize) * stepSize;
    
    // Konvertera tillbaka till en faktor mellan 0 och 1
    const newFactor = (roundedCost - exactMinCost) / Math.max(0.001, costRange);
    
    // Begränsa faktorn till mellan 0 och 1
    const clampedFactor = Math.max(0, Math.min(1, newFactor));
    
    onAdjustmentChange(clampedFactor);
  };

  // Omfattande diagnostikloggning för att felsöka sliderbeteendet
  useEffect(() => {
    console.log(`Slider diagnostik: 
      - Faktor: ${adjustmentFactor}
      - Min: ${exactMinCost}
      - Max: ${exactMaxCost}
      - Range: ${costRange}
      - Beräknad kostnad vid faktor ${adjustmentFactor}: ${calculatedLeasingCost}
      - Avrundad kostnad: ${roundedLeasingCost}
      - Aktuell kostnad: ${leaseCost}
      - Flatrate position: ${flatratePosition}
      - Allow below flatrate: ${allowBelowFlatrate}
      - Steg storlek: ${stepSize}
    `);
  }, [adjustmentFactor, exactMinCost, exactMaxCost, costRange, leaseCost, calculatedLeasingCost, flatratePosition, allowBelowFlatrate, roundedLeasingCost]);

  // Säkerställ att leasingCost är inom intervallet
  let actualLeasingCost = leaseCost;
  if (leaseCost > exactMaxCost) {
    actualLeasingCost = exactMaxCost;
  } else if (leaseCost < exactMinCost) {
    actualLeasingCost = exactMinCost;
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
      if (!newValue && flatratePosition !== null && adjustmentFactor < flatratePosition / 100) {
        onAdjustmentChange(flatratePosition / 100);
      }
      
      onAllowBelowFlatrateChange(newValue);
    }
  };

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
        adjustmentFactor={adjustmentFactor}
        onSliderChange={handleSliderChange}
        thresholdPosition={flatratePosition}
        showFlatrateIndicator={showFlatrateIndicator}
        allowBelowFlatrate={allowBelowFlatrate}
      />

      <CostDisplay 
        minLeaseCost={exactMinCost}
        maxLeaseCost={exactMaxCost}
        leaseCost={actualLeasingCost}
      />

      {showFlatrateIndicator && flatrateThreshold && (
        <FlatrateToggle 
          showFlatrateIndicator={showFlatrateIndicator}
          flatrateThreshold={flatrateThreshold}
          allowBelowFlatrate={allowBelowFlatrate}
          onToggleFlatrate={handleToggleFlatrate}
        />
      )}
    </div>
  );
};

export default LeaseAdjuster;
