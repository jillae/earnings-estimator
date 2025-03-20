
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
  if (!showFlatrateIndicator || thresholdPosition === null) {
    return null;
  }

  return (
    <div className="flatrate-indicator">
      <div 
        className="absolute h-8 border-l-2 border-primary z-10 top-4" 
        style={{ left: `${thresholdPosition}%` }}
      />
      <div 
        className="absolute text-xs text-primary font-medium top-0"
        style={{ 
          left: `${thresholdPosition > 70 ? thresholdPosition - 50 : thresholdPosition}%`, 
          maxWidth: '50%',
          whiteSpace: 'nowrap'
        }}
      >
        {!allowBelowFlatrate ? 'Flatrate-gräns' : '80% av maximalt'}
      </div>
    </div>
  );
};

export default FlatrateIndicator;
