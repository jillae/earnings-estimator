
import React from 'react';

interface FlatrateIndicatorProps {
  thresholdPosition: number | null;
  showFlatrateIndicator: boolean;
  allowBelowFlatrate: boolean;
}

const FlatrateIndicator: React.FC<FlatrateIndicatorProps> = ({ 
  thresholdPosition, 
  showFlatrateIndicator,
  allowBelowFlatrate
}) => {
  // Returnera null för att ta bort den visuella indikatorn helt
  return null;
};

export default FlatrateIndicator;
