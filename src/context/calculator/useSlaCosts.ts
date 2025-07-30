
import React from 'react';
import { SlaEngine } from '@/utils/core/SlaEngine';
import { Machine } from '@/data/machines/types';

export function useSlaCosts(selectedMachine: Machine | undefined, leasingMax60mRef: number) {
  return React.useMemo(() => {
    console.log(`useSlaCosts beräknar med grundkostnad: ${leasingMax60mRef} för ${selectedMachine?.name}`);
    return SlaEngine.getAllCosts(selectedMachine, leasingMax60mRef);
  }, [selectedMachine, leasingMax60mRef]);
}
