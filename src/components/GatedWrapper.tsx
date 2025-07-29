import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';

interface GatedWrapperProps {
  children: React.ReactNode;
  action: string;
  data?: any;
}

export const GatedWrapper: React.FC<GatedWrapperProps> = ({ 
  children, 
  action, 
  data 
}) => {
  const { isUnlocked, triggerOptIn, logInteraction } = useCalculator();

  const handleClick = (e: React.MouseEvent) => {
    if (!isUnlocked) {
      e.preventDefault();
      e.stopPropagation();
      triggerOptIn();
      return;
    }
    
    // Logga interaktionen om användaren är upplåst
    logInteraction(action, data);
  };

  return (
    <div 
      onClick={handleClick}
      className={!isUnlocked ? 'pointer-events-none opacity-60' : ''}
    >
      {children}
    </div>
  );
};