
import { createContext, useContext } from 'react';
import { CalculatorContextType } from './types';

// Create the context with undefined as default value
export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// Custom hook to use the calculator context
export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};
