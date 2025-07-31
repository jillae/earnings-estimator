
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
          <h3 className="text-lg font-semibold mb-4">Välj din maskin</h3>
          <MachineGalleryContainer />
        </div>
        <CalculatorLayout />
      </div>
    </CalculatorProvider>
  );
};

export default Calculator;
