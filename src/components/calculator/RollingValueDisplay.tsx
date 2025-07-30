import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RollingValueDisplayProps {
  value: number;
  label: string;
  className?: string;
  showTrendIcon?: boolean;
  trendDirection?: 'up' | 'down';
  showStandardBadge?: boolean;
  isStandardPosition?: boolean;
}

const RollingValueDisplay: React.FC<RollingValueDisplayProps> = ({ 
  value, 
  label, 
  className = "",
  showTrendIcon = false,
  trendDirection = 'up',
  showStandardBadge = false,
  isStandardPosition = false
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      
      // Grövre steg-animation
      const duration = 400;
      const startValue = displayValue;
      const endValue = value;
      const startTime = Date.now();
      const steps = 8; // Antal diskreta steg
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Grov steg-animation istället för smidig
        const stepProgress = Math.floor(progress * steps) / steps;
        
        const currentValue = startValue + (endValue - startValue) * stepProgress;
        setDisplayValue(Math.round(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, displayValue]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center gap-1 text-xs font-medium text-blue-700 mb-1">
        {showTrendIcon && (
          trendDirection === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
          )
        )}
        <span>{label}</span>
      </div>
      <div className={`text-lg font-bold text-blue-900 transition-all duration-300 flex items-center gap-2 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        <span>{formatCurrency(displayValue)}</span>
        {showStandardBadge && isStandardPosition && (
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
            Standard
          </span>
        )}
      </div>
      <div className="text-xs text-blue-600">
        /månad
      </div>
    </div>
  );
};

export default RollingValueDisplay;