
import React from 'react';
import CalculatorLayout from './calculator/CalculatorLayout';
import { CalculatorProvider } from '@/context/CalculatorContext';
import MachineGalleryContainer from './MachineGalleryContainer';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Maskinval */}
        <div className="glass-card animate-slide-in mb-8">
          <MachineGalleryContainer />
        </div>
        <CalculatorLayout />
      </div>
    </CalculatorProvider>
  );
};

export default Calculator;
