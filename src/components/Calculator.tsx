
import React from 'react';
import CalculatorLayout from './calculator/CalculatorLayout';
import { CalculatorProvider } from '@/context/CalculatorContext';
import MachineGalleryContainer from './MachineGalleryContainer';
import ExportButton from './ExportButton';
import StickyEconomicGraph from './StickyEconomicGraph';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-40">
        {/* Maskinval */}
        <div className="glass-card animate-slide-in mb-8">
          <MachineGalleryContainer />
        </div>
        <CalculatorLayout />
        {/* Gömd ExportButton som kan öppnas via event */}
        <ExportButton />
      </div>
      
      {/* Sticky kumulativ graf */}
      <StickyEconomicGraph />
    </CalculatorProvider>
  );
};

export default Calculator;
