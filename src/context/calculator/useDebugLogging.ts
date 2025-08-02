
import { useEffect } from 'react';

export function useDebugLogging({
  leasingRange,
  leasingCost,
  leaseAdjustmentFactor,
  allowBelowFlatrate,
  slaCosts,
  leasingStandardRef
}: {
  leasingRange: { min: number; max: number; default: number; flatrateThreshold?: number };
  leasingCost: number;
  leaseAdjustmentFactor: number;
  allowBelowFlatrate?: boolean;
  slaCosts?: { Brons: number; Silver: number; Guld: number };
  leasingStandardRef?: number;
}) {
  useEffect(() => {
    // Logga nuvarande inställningar för lättare debugging
    console.log(`
      ----- LEASING CALCULATIONS DIAGNOSTICS -----
      Version: 3.0
      Range: ${leasingRange.min} - ${leasingRange.max} (default: ${leasingRange.default})
      Current: ${leasingCost} (factor: ${leaseAdjustmentFactor})
      Flatrate threshold: ${leasingRange.flatrateThreshold || 'N/A'}
      Allow below flatrate: ${allowBelowFlatrate} (Flatrate ${allowBelowFlatrate ? 'aktiverad' : 'INAKTIVERAD'})
      ---------------------------------------
    `);

    if (slaCosts) {
      console.log(`
        ----- SLA COSTS -----
        Reference value (leasingStandardRef): ${leasingStandardRef}
        Brons: ${slaCosts.Brons}
        Silver: ${slaCosts.Silver}
        Guld: ${slaCosts.Guld}
        ---------------------------------------
      `);
    }

  }, [leasingRange, leasingCost, leaseAdjustmentFactor, allowBelowFlatrate, slaCosts, leasingStandardRef]);
}
