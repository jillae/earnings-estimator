
import React from 'react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import { KlinikOptimeringSidebar } from '@/components/KlinikOptimeringSidebar';
import { useCalculator } from '@/context/CalculatorContext';

const CalculatorLayout: React.FC = () => {
  const { netResults } = useCalculator();
  
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <CalculatorInputs />
          </div>
          <div className="space-y-6">
            <CalculatorResults />
          </div>
        </div>
        <div className="space-y-6">
          <KlinikOptimeringSidebar />
        </div>
      </div>
    </div>
  );
};

export default CalculatorLayout;
