
import React from 'react';
import CalculatorLayout from './calculator/CalculatorLayout';
import { CalculatorProvider } from '@/context/CalculatorContext';
import MachineGalleryContainer from './MachineGalleryContainer';

const Calculator: React.FC = () => {
  return (
    <CalculatorProvider>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Steg 1: Välj maskin */}
        <div className="relative mb-6">
          <div className="absolute -top-3 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            STEG 1
          </div>
          <div className="pt-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <span className="text-lg font-bold text-blue-800">Välj din maskin</span>
              </div>
              <div className="text-sm text-blue-700">
                Börja med att välja vilken maskin du vill beräkna för din klinik
              </div>
            </div>
            <MachineGalleryContainer />
          </div>
        </div>
        <CalculatorLayout />
      </div>
    </CalculatorProvider>
  );
};

export default Calculator;
