
import React, { useContext } from 'react';
import { CalculatorProvider as ActualCalculatorProvider } from './calculator/CalculatorProvider';
import { CalculatorContext } from './calculator/context';
import { CalculatorContextType } from './calculator/types';

// Custom hook för att använda calculator context
export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator måste användas inom en CalculatorProvider');
  }
  return context;
};

// Exportera provider för bakåtkompatibilitet
export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ActualCalculatorProvider>{children}</ActualCalculatorProvider>;
};

// Exportera context för direkt användning
export { CalculatorContext };
