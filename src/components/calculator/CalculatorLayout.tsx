
import React from 'react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import { useCalculator } from '@/context/CalculatorContext';

const CalculatorLayout: React.FC = () => {
  const { netResults } = useCalculator();
  
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid md:grid-cols-2 gap-8">
        <CalculatorInputs />
        <CalculatorResults />
      </div>
    </div>
  );
};

export default CalculatorLayout;
