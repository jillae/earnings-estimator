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
  // Temporärt dold gate - alltid upplåst
  const isUnlocked = true;
  const { logInteraction } = useCalculator();

  const handleClick = (e: React.MouseEvent) => {
    // Logga interaktionen
    logInteraction(action, data);
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};