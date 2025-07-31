
import React from 'react';
import CalculatorLayout from './calculator/CalculatorLayout';
import { CalculatorProvider } from '@/context/CalculatorContext';
import MachineGalleryContainer from './MachineGalleryContainer';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Steg 1: Välj maskin */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-bold text-primary">Välj din maskin</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Börja med att välja vilken maskin du vill beräkna för din klinik
          </div>
        </div>
        <MachineGalleryContainer />
        <CalculatorLayout />
      </div>
    </CalculatorProvider>
  );
};

export default Calculator;
