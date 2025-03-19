
// This file re-exports everything from the refactored structure
// to maintain backward compatibility
import { CalculatorContext, useCalculator } from './calculator/context';
import { CalculatorProvider } from './calculator/CalculatorProvider';

export { CalculatorContext, CalculatorProvider, useCalculator };
