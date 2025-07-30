import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatUtils';

interface RollingValueDisplayProps {
  value: number;
  label: string;
  className?: string;
}

const RollingValueDisplay: React.FC<RollingValueDisplayProps> = ({ 
  value, 
  label, 
  className = "" 
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      
      // Kör animationen över 300ms
      const duration = 300;
      const startValue = displayValue;
      const endValue = value;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function för smidig animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        setDisplayValue(Math.round(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, displayValue]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm ${className}`}>
      <div className="text-xs font-medium text-blue-700 mb-1">
        {label}
      </div>
      <div className={`text-lg font-bold text-blue-900 transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        {formatCurrency(displayValue)}
      </div>
      <div className="text-xs text-blue-600">
        /månad
      </div>
    </div>
  );
};

export default RollingValueDisplay;