
import { useEffect } from 'react';

export function useDebugLogging({
  leasingRange,
  leasingCost,
  leaseAdjustmentFactor
}: {
  leasingRange: { min: number, max: number, default: number };
  leasingCost: number;
  leaseAdjustmentFactor: number;
}) {
  // Debug logs for leasing settings
  useEffect(() => {
    console.log("Leasing cost values:", {
      minLeaseCost: leasingRange.min,
      maxLeaseCost: leasingRange.max,
      leaseCost: leasingCost,
      actualLeasingCost: leasingCost,
      roundedMinCost: Math.round(leasingRange.min / 500) * 500,
      roundedMaxCost: Math.round(leasingRange.max / 500) * 500,
      numSteps: Math.floor((leasingRange.max - leasingRange.min) / 100),
      currentStepFactor: 1 / Math.max(1, Math.floor((leasingRange.max - leasingRange.min) / 100)),
      adjustmentFactor: leaseAdjustmentFactor
    });
  }, [leasingRange, leasingCost, leaseAdjustmentFactor]);
}
