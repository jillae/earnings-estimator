
import React from 'react';
import { SlaEngine } from '@/utils/core/SlaEngine';
import { Machine } from '@/data/machines/types';

export function useSlaCosts(selectedMachine: Machine | undefined, leasingStandardRef: number) {
  return React.useMemo(() => {
    console.log(`useSlaCosts beräknar med grundkostnad: ${leasingStandardRef} för ${selectedMachine?.name}`);
    return SlaEngine.getAllCosts(selectedMachine, leasingStandardRef);
  }, [selectedMachine, leasingStandardRef]);
}
