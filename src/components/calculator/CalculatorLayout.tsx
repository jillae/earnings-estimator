
import React from 'react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import { useCalculator } from '@/context/CalculatorContext';

const CalculatorLayout: React.FC = () => {
  const { netResults } = useCalculator();
  
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 min-h-0">
        <div className="space-y-6">
          <CalculatorInputs />
        </div>
        <div className="space-y-6">
          <CalculatorResults />
        </div>
      </div>
    </div>
  );
};

export default CalculatorLayout;
