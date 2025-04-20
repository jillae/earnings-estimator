
import React from 'react';
import { calculateSlaCost } from '@/utils/pricingUtils';
import { SlaLevel } from '@/utils/constants';
import { Machine } from '@/data/machines/types';

export function useSlaCosts(selectedMachine: Machine | undefined, leasingMax60mRef: number) {
  return React.useMemo(() => {
    if (!selectedMachine) return { Brons: 0, Silver: 0, Guld: 0 };
    return {
      Brons: calculateSlaCost(selectedMachine, 'Brons', leasingMax60mRef),
      Silver: calculateSlaCost(selectedMachine, 'Silver', leasingMax60mRef),
      Guld: calculateSlaCost(selectedMachine, 'Guld', leasingMax60mRef)
    };
  }, [selectedMachine, leasingMax60mRef]);
}
