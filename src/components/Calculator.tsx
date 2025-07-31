
import React from 'react';
import CalculatorLayout from './calculator/CalculatorLayout';
import { CalculatorProvider } from '@/context/CalculatorContext';
import MachineGalleryContainer from './MachineGalleryContainer';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Steg 1: Maskinval */}
        <div className="relative mb-8">
          <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            STEG 1
          </div>
          <div className="glass-card animate-slide-in pt-2">
            <h3 className="text-lg font-semibold mb-4">Välj din maskin</h3>
            <MachineGalleryContainer />
          </div>
        </div>
        <CalculatorLayout />
      </div>
    </CalculatorProvider>
  );
};

export default Calculator;
