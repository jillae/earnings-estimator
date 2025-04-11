
import React, { createContext, useContext } from 'react';
import { CalculatorProvider as ActualCalculatorProvider } from './calculator/CalculatorProvider';
import { CalculatorContextType } from './calculator/types';

// Create context
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// Custom hook to use calculator context
export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator måste användas inom en CalculatorProvider');
  }
  return context;
};

// Re-export the context provider for backward compatibility
export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ActualCalculatorProvider>{children}</ActualCalculatorProvider>;
};

// Export the context for direct use
export { CalculatorContext };
