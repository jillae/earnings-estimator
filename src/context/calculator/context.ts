
import { createContext } from 'react';
import { CalculatorContextType } from './types';

// Skapa context med undefined som standardvärde
export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);
