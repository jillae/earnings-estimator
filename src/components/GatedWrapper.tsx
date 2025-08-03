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
    // Logga interaktionen men låt klick-event fortsätta
    logInteraction(action, data);
    // VIKTIGT: Stoppa inte propagation - låt andra click handlers fungera
  };

  return (
    <div onClick={handleClick} style={{ pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};