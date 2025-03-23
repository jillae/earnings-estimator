
import { useEffect } from 'react';

// Konstant för versionsnummer
const VERSION = "bas1";

export function useDebugLogging({
  leasingRange,
  leasingCost,
  leaseAdjustmentFactor,
  allowBelowFlatrate
}: {
  leasingRange: { min: number, max: number, default: number, flatrateThreshold?: number };
  leasingCost: number;
  leaseAdjustmentFactor: number;
  allowBelowFlatrate?: boolean;
}) {
  // Utökad loggning för att se beräkningarna och inställningarna
  useEffect(() => {
    console.log(`
      ----- LEASING CALCULATIONS DIAGNOSTICS -----
      Version: ${VERSION}
      Range: ${leasingRange.min} - ${leasingRange.max} (default: ${leasingRange.default})
      Current: ${leasingCost} (factor: ${leaseAdjustmentFactor})
      Flatrate threshold: ${leasingRange.flatrateThreshold || "N/A"}
      Allow below flatrate: ${allowBelowFlatrate} (Flatrate ${allowBelowFlatrate ? 'INAKTIVERAD' : 'AKTIVERAD'})
      ---------------------------------------
    `);
  }, [leasingRange, leasingCost, leaseAdjustmentFactor, allowBelowFlatrate]);
}
