
import React, { createContext, useContext } from 'react';
import { CalculatorProvider as ActualCalculatorProvider } from './calculator/CalculatorProvider';
import { CalculatorContextType } from './calculator/types';

// Skapa context
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

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
