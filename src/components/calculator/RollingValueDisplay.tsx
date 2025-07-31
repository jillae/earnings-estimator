import React, { useEffect, useState, useRef } from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import CreditInfoPopover from './CreditInfoPopover';

interface RollingValueDisplayProps {
  value: number;
  label: string;
  className?: string;
  showTrendIcon?: boolean;
  trendDirection?: 'up' | 'down' | 'neutral';
  showStandardBadge?: boolean;
  isStandardPosition?: boolean;
  animationStyle?: 'rolling' | 'slotmachine' | 'rolodex' | 'digitalflip' | 'typewriter';
}

const RollingValueDisplay: React.FC<RollingValueDisplayProps> = ({ 
  value, 
  label, 
  className = "",
  showTrendIcon = false,
  trendDirection = 'up',
  showStandardBadge = false,
  isStandardPosition = false,
  animationStyle = 'rolling'
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debug logging
    console.log(`RollingValueDisplay [${label}]: value=${value}, displayValue=${displayValue}`);
    
    // Rensa tidigare timeout och animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Direkt uppdatering för första gången eller när värdet är 0
    if (displayValue === 0 || value === 0) {
      setDisplayValue(value);
      return;
    }

    if (displayValue !== value && !isAnimating) {
      // Debounce för att undvika för många animationer
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(true);
        
        const animateValue = () => {
          switch (animationStyle) {
            case 'slotmachine': {
              const duration = 800;
              const startTime = Date.now();
              const startValue = displayValue;
              const endValue = value;
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 0.8) {
                  const randomValue = Math.floor(Math.random() * 50000) + Math.min(startValue, endValue);
                  setDisplayValue(randomValue);
                } else {
                  const finalProgress = (progress - 0.8) / 0.2;
                  const currentValue = startValue + (endValue - startValue) * finalProgress;
                  setDisplayValue(Math.round(currentValue));
                }
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            case 'rolodex': {
              const duration = 50;
              const startTime = Date.now();
              const startValue = displayValue;
              const endValue = value;
              const steps = 8;
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const stepProgress = Math.floor(progress * steps) / steps;
                const easing = 1 - Math.pow(1 - stepProgress, 2);
                
                const currentValue = startValue + (endValue - startValue) * easing;
                setDisplayValue(Math.round(currentValue));
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            case 'digitalflip': {
              const duration = 300;
              const startTime = Date.now();
              const startValue = displayValue;
              const endValue = value;
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 0.5) {
                  setDisplayValue(startValue);
                } else {
                  setDisplayValue(endValue);
                }
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            case 'typewriter': {
              const duration = 400;
              const startTime = Date.now();
              const endValue = value;
              const endString = endValue.toString();
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const charIndex = Math.floor(progress * endString.length);
                const partialValue = parseInt(endString.substring(0, charIndex + 1)) || 0;
                setDisplayValue(partialValue);
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            default: {
              // Standard rolling animation - MER SMOOTH
              const duration = 200; // Långsammare för mindre flimmer
              const startValue = displayValue;
              const endValue = value;
              const startTime = Date.now();
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (endValue - startValue) * easeProgress;
                setDisplayValue(Math.round(currentValue));
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
          }
        };
        
        animateValue();
      }, 100); // Ökad debounce till 100ms för mindre flimmer
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, displayValue, animationStyle, isAnimating]);

  return (
    <div className="relative">
      {showStandardBadge && isStandardPosition && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200 shadow-sm">
            Standard
          </span>
        </div>
      )}
      {/* Credits info badge i höger hörn */}
      {label.includes('Credits') && (
        <div className="absolute -top-1 -right-1 z-20">
          <CreditInfoPopover />
        </div>
      )}
      <div className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm ${className}`}>
        <div className="flex items-center gap-1 text-xs font-medium text-blue-700 mb-1">
          {showTrendIcon && (
            trendDirection === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
            ) : trendDirection === 'down' ? (
              <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
            )
          )}
          <span>{label}</span>
        </div>
        <div className={`text-lg font-bold text-blue-900 transition-all duration-200 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
          <span>{formatCurrency(displayValue)}</span>
        </div>
        <div className="text-xs text-blue-600">
          {label.includes('Credits') ? '/styck' : label.includes('Styckepris') ? '/st' : '/månad'}
        </div>
      </div>
    </div>
  );
};

export default RollingValueDisplay;